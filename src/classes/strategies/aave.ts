import type { Address } from "viem";
import { encodeFunctionData } from "viem";
import { KernelAccountClient } from "@zerodev/sdk";

import { AAVE_V3_ABI, ERC20_ABI } from "@/constants/abis";
import { BaseStrategy } from "./base";
import { AAVE_CONTRACTS } from "@/constants/protocols/aave";

export class AaveV3Strategy extends BaseStrategy<typeof AAVE_CONTRACTS> {
  constructor(chainId: number, kernelAccountClient: KernelAccountClient) {
    super(chainId, kernelAccountClient, AAVE_CONTRACTS);
  }

  async execute(amount: bigint, asset: Address) {
    const pool = this.getAddress("pool");

    const userOp = await this.kernelAccountClient.sendUserOperation({
      calls: [
        {
          to: asset,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [pool, amount],
          }),
        },
        {
          to: pool,
          data: encodeFunctionData({
            abi: AAVE_V3_ABI,
            functionName: "supply",
            args: [asset, amount, this.user, 0],
          }),
        },
      ],
    });

    return this.waitForUserOp(userOp);
  }
}
