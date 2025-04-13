import type { Address } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

import { BaseStrategy } from "./base";
import { wagmiConfig as config } from "@/providers/config";
import { STAKED_CELO_ABI } from "@/app/abis/stakeCelo";
import {
  StCeloSupportedChains,
  ST_CELO_CONTRACTS,
} from "../constants/protocols";

export class StCeloStrategy extends BaseStrategy<StCeloSupportedChains> {
  public manager: Address;

  constructor(chainId: number) {
    super(chainId);

    this.manager = ST_CELO_CONTRACTS[this.chainId].manager;
  }

  async execute(
    user: Address,
    _asset: Address,
    amount: bigint
  ): Promise<string> {
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

  isSupported(chainId: number): boolean {
    return Object.keys(ST_CELO_CONTRACTS).map(Number).includes(chainId);
  }
}
