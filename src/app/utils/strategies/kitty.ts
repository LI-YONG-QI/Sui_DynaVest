import { writeContract } from "@wagmi/core";
import type { Address } from "viem";

import { wagmiConfig as config } from "@/providers/config";
import { BaseStrategy } from "./base";
import { KITTY_ABI } from "@/app/abis/kitty";
import { ERC20_ABI } from "@/app/abis";
import {
  KITTY_CONTRACTS,
  KittySupportedChains,
} from "../constants/protocols/kitty";

export class KittyStrategy extends BaseStrategy {
  public readonly kitty: Address;
  public readonly ankrFLOW: Address;

  constructor(chainId: KittySupportedChains) {
    super(chainId);

    this.kitty = KITTY_CONTRACTS[chainId].kitty;
    this.ankrFLOW = KITTY_CONTRACTS[chainId].ankrFLOW;
  }

  async execute(user: Address, amount: bigint) {
    await writeContract(config, {
      address: this.ankrFLOW,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [this.kitty, amount],
    });

    console.log("Approved Success");

    const result = await writeContract(config, {
      address: this.kitty,
      abi: KITTY_ABI,
      functionName: "add_liquidity",
      args: [[BigInt(0), amount], BigInt(0), user],
    });

    console.log(result);

    return "Kitty strategy executed successfully";
  }
}
