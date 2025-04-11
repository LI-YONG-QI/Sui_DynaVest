import type { Address } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

import { BaseStrategy } from "./base";
import { wagmiConfig as config } from "@/providers/config";
import { STAKED_CELO_ABI } from "@/app/abis/stakeCelo";
import {
  StCeloSupportedChains,
  ST_CELO_CONTRACTS,
} from "../constants/protocols";

export class StCeloStrategy extends BaseStrategy {
  public manager: Address;

  constructor(chainId: StCeloSupportedChains) {
    super(chainId);

    this.manager = ST_CELO_CONTRACTS[chainId].manager;
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
