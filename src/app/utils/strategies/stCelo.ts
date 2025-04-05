import type { Address } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

import { BaseStrategy } from "./base";
import { wagmiConfig as config } from "@/providers/config";
import { STAKED_CELO_ABI } from "@/app/abis/stakeCelo";

export class StCeloStrategy extends BaseStrategy {
  public manager: Address;

  constructor(chainId: number) {
    super(chainId);

    // TODO: by chain config
    this.manager = "0x0239b96D10a434a56CC9E09383077A0490cF9398";
  }

  async execute(user: Address, amount: bigint) {
    const result = await writeContract(config, {
      abi: STAKED_CELO_ABI,
      address: this.manager,
      functionName: "deposit",
      value: amount,
      args: [],
    });

    await waitForTransactionReceipt(config, {
      hash: result,
    });

    return result;
  }
}
