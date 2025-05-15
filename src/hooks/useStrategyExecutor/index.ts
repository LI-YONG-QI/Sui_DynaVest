import { Address } from "viem";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useMemo } from "react";
import { useChainId } from "wagmi";

import { BaseStrategy } from "@/classes/strategies/baseStrategy";
import { Protocols } from "@/types/strategies";
import { MultiStrategy } from "@/classes/strategies/multiStrategy";
export function useStrategyExecutor() {
  const { client, getClientForChain } = useSmartWallets();
  const chainId = useChainId();

  const user = useMemo(() => {
    return client?.account?.address || null;
  }, [client?.account?.address]);

  const uiOptions = {
    title: "Sample title text",
    description: "Sample description text",
    buttonText: "Sample button text",
  };

  async function execute<T extends Protocols>(
    strategy: BaseStrategy<T> | MultiStrategy,
    amount: bigint,
    asset?: Address
  ): Promise<string> {
    if (!client) throw new Error("Smart wallet client not available");
    if (!user) throw new Error("Smart wallet account not found");

    const clientForChain = await getClientForChain({ id: chainId });

    // Get calls from strategy
    const calls = await strategy.buildCalls(amount, user, asset);

    // Execute the calls
    const userOp = await clientForChain!.sendTransaction({
      calls,
    });

    return waitForUserOp(userOp);
  }

  async function waitForUserOp(userOp: `0x${string}`): Promise<string> {
    if (!client) {
      throw new Error("Smart wallet client not available");
    }

    const clientForChain = await getClientForChain({ id: chainId });

    const { success, receipt, reason, userOpHash } =
      await clientForChain!.waitForUserOperationReceipt({
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
    uiOptions,
    execute,
    waitForUserOp,
    isReady: !!client && !!user,
  };
}
