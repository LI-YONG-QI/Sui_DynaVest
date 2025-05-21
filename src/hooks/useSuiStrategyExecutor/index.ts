import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Address } from "viem";

import { SuiBaseStrategy } from "@/classes/strategies/base";
import { sui } from "@/constants/chains";
import { Protocols } from "@/types";
import { Transaction } from "@mysten/sui/transactions";
import { MultiSuiStrategy } from "@/classes/strategies/multiSuiStrategy";
import axios from "axios";
import { useStatus } from "@/contexts/StatusContext";

export const SUI_PACKAGES = {
  [sui.id]: {
    bucket: "0x2::sui",
  },
} as const;

export function useSuiStrategyExecutor() {
  const { chainId } = useStatus();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const account = useCurrentAccount();

  const execute = async (
    strategy: SuiBaseStrategy<Protocols> | MultiSuiStrategy,
    amount: bigint
  ) => {
    if (!account) throw new Error("Account not found");

    const user = account.address as Address;

    const tx = await strategy.buildTransaction(new Transaction(), amount, user);

    const { digest } = await signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:mainnet",
      },
      {
        onSuccess: (result) => {
          const { digest } = result;
          console.log("Transaction executed successfully", digest);
          if (strategy instanceof SuiBaseStrategy) {
            axios.put("/api/user", {
              address: user,
              transactions: [
                {
                  hash: digest,
                  chainId,
                  strategy: strategy.metadata.protocol,
                  type: strategy.metadata.type,
                  amount: amount.toString(),
                  icon: strategy.metadata.icon,
                  tokenName: "SUI",
                },
              ],
            });
          } else if (strategy instanceof MultiSuiStrategy) {
            const transactions = strategy.strategies.map((strategy) => {
              return {
                hash: digest,
                chainId,
                strategy: strategy.strategy.metadata.protocol,
                type: strategy.strategy.metadata.type,
                amount: (
                  (amount * BigInt(strategy.allocation)) /
                  BigInt(100)
                ).toString(),
                icon: strategy.strategy.metadata.icon,
                tokenName: "SUI",
              };
            });

            axios.put("/api/user", {
              address: user,
              transactions,
            });
          }
        },
      }
    );
    return digest;
  };

  return { execute };
}
