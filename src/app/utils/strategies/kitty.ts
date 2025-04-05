import { writeContract } from "@wagmi/core";
import type { Address } from "viem";

import { wagmiConfig as config } from "@/providers/config";
import { BaseStrategy } from "./base";
import { KITTY_ABI } from "@/app/abis/kitty";
import { ERC20_ABI } from "@/app/abis";

export class KittyStrategy extends BaseStrategy {
  public readonly KITTY: Address = "0x7296a9c350cad25fc69b47ec839dcf601752c3c2";
  public readonly ankrFLOW: Address =
    "0x1b97100eA1D7126C4d60027e231EA4CB25314bdb";

  constructor(chainId: number) {
    super(chainId);
  }

  async execute(user: Address, amount: bigint) {
    const approveTx = await writeContract(config, {
      address: this.ankrFLOW,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [this.KITTY, amount],
    });

    // await waitForTransactionReceipt(config, {
    //   hash: approveTx,
    // });

    console.log("Approved Success");

    const result = await writeContract(config, {
      address: this.KITTY,
      abi: KITTY_ABI,
      functionName: "add_liquidity",
      args: [[BigInt(0), amount], BigInt(0), user],
    });

    console.log(result);

    return "Kitty strategy executed successfully";
  }
}
