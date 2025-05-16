import { Address } from "viem";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useMemo } from "react";
import { useChainId } from "wagmi";

import { BaseStrategy } from "@/classes/strategies/baseStrategy";
import { Protocols } from "@/types/strategies";
import { MultiStrategy } from "@/classes/strategies/multiStrategy";

export function useStrategyExecutor() {
  const { client } = useSmartWallets();
  const chainId = useChainId();

  const user = useMemo(() => {
    return client?.account?.address || null;
  }, [client?.account?.address]);

  async function execute<T extends Protocols>(
    strategy: BaseStrategy<T> | MultiStrategy,
    amount: bigint,
    asset?: Address
  ): Promise<string> {
    if (!client) throw new Error("Smart wallet client not available");
    if (!user) throw new Error("Smart wallet account not found");

    await client.switchChain({ id: chainId });

    // Get calls from strategy
    const calls = await strategy.buildCalls(amount, user, asset);

    // Execute the calls
    const userOp = await client.sendTransaction(
      {
        calls,
      },
      {
        uiOptions: {
          showWalletUIs: false,
        },
      }
    );

    return waitForUserOp(userOp);
  }

  async function waitForUserOp(userOp: `0x${string}`): Promise<string> {
    if (!client) {
      throw new Error("Smart wallet client not available");
    }

    console.log(userOp);

    await client.switchChain({ id: chainId });

    const { success, receipt, reason, userOpHash } =
      await client.waitForUserOperationReceipt({
        hash: userOp,
      });

    if (success === true) {
      return receipt.transactionHash;
    } else {
      throw new Error(
        `Strategy execution reverted with reason: ${reason} / userOpHash: ${userOpHash} / txHash: ${receipt.transactionHash}`
      );
    }
  }

  return {
    user,
    execute,
    waitForUserOp,
    isReady: !!client && !!user,
  };
}
