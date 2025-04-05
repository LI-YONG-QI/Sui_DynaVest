import { Address } from "viem";

import { BaseStrategy } from "./base";
import { FLOW_STRATEGY_ABI } from "@/app/abis/flowStrategy";
import { wagmiConfig as config } from "@/providers/config";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

export class FlowStrategy extends BaseStrategy {
  public readonly strategy: Address =
    "0xe6fe0766ff66b8768181b0f3f46e8e314f9277e0";

  constructor(chainId: number) {
    super(chainId);
  }

  async execute(user: Address, amount: bigint) {
    const result = await writeContract(config, {
      address: this.strategy,
      abi: FLOW_STRATEGY_ABI,
      functionName: "execute",
      args: [],
      value: amount,
    });

    await waitForTransactionReceipt(config, {
      hash: result,
    });

    return result;
  }
}
