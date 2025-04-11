import { BaseStrategy } from "./base";
import type { Address, Hex } from "viem";
import { sendTransaction } from "@wagmi/core";
import { wagmiConfig as config } from "@/providers/config";
import {
  ANKR_CONTRACTS,
  AnkrSupportedChains,
} from "../constants/protocols/ankr";

export class AnkrFlowStrategy extends BaseStrategy {
  public readonly ANKR_CORE: Address;

  constructor(chainId: AnkrSupportedChains) {
    super(chainId);
    this.ANKR_CORE = ANKR_CONTRACTS[chainId].ankrFLOW;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(user: Address, amount: bigint) {
    const result = await sendTransaction(config, {
      to: this.ANKR_CORE,
      value: amount,
      data: "0xac76d450" as Hex,
    });

    console.log(result);

    return "AnkrFlow strategy executed successfully";
  }
}
