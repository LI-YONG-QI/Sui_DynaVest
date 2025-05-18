import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

import { SuiBaseStrategy } from "@/classes/strategies/base";
import { sui } from "@/constants/chains";
import { Protocols } from "@/types";

export const SUI_PACKAGES = {
  [sui.id]: {
    bucket: "0x2::sui",
  },
} as const;

export function useSuiStrategyExecutor() {
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const account = useCurrentAccount();

  const execute = async (
    strategy: SuiBaseStrategy<Protocols>,
    amount: bigint
  ) => {
    if (!account) throw new Error("Account not found");

    const tx = await strategy.buildCalls(
      amount,
      "0xe61df5a25bc09dfc835d7507bf7f307d3e7a9756664912b4d1371dfe1e51d79a"
    );
    const { digest } = await signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:mainnet",
      },
      {
        onError: (error) => {
          throw new Error(
            `Failed to execute transaction, error: ${error.message}`
          );
        },
      }
    );
    return digest;
  };

  return { execute };
}
