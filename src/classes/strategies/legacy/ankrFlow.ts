import { BaseStrategy } from "../baseStrategy";
import type { Address, Hex } from "viem";
import { sendTransaction } from "@wagmi/core";
import { ANKR_CONTRACTS, AnkrSupportedChains } from "@/constants/protocols";
import { wagmiConfig as config } from "@/providers/config";

/**
 * @deprecated
 */

export class AnkrFlowStrategy extends BaseStrategy<AnkrSupportedChains> {
  public readonly ANKR_CORE: Address;

  constructor(chainId: number) {
    super(chainId);
    this.ANKR_CORE = ANKR_CONTRACTS[this.chainId].ankrFLOW;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(
    user: Address,
    _asset: Address,
    amount: bigint
  ): Promise<strinag> {
    const result = await sendTransaction(config, {
      to: this.ANKR_CORE,
      value: amount,
      data: "0xac76d450" as Hex,
    });

    console.log(result);

    return "AnkrFlow strategy executed successfully";
  }

  isSupported(chainId: number): boolean {
    return Object.keys(ANKR_CONTRACTS).map(Number).includes(chainId);
  }
}
