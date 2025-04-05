import { BaseStrategy } from "./base";
import type { Address, Hex } from "viem";
import { sendTransaction } from "@wagmi/core";
import { wagmiConfig as config } from "@/providers/config";

export class AnkrFlowStrategy extends BaseStrategy {
  public readonly ANKR_CORE: Address =
    "0xFE8189A3016cb6A3668b8ccdAC520CE572D4287a";

  constructor(chainId: number) {
    super(chainId);
  }

  async execute(user: Address, amount: bigint) {
    const result = await sendTransaction(config, {
      to: this.ANKR_CORE,
      value: BigInt(100),
      data: "0xac76d450" as Hex,
    });

    console.log(result);

    return "AnkrFlow strategy executed successfully";
  }
}
