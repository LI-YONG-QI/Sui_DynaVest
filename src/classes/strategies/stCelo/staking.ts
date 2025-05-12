import { encodeFunctionData } from "viem";
import { KernelAccountClient } from "@zerodev/sdk";

import { BaseStrategy } from "../baseStrategy";
import { STAKED_CELO_ABI } from "@/constants/abis";
import { ST_CELO_CONTRACTS } from "@/constants/protocols";

export class StCeloStaking extends BaseStrategy<typeof ST_CELO_CONTRACTS> {
  constructor(chainId: number, kernelAccountClient: KernelAccountClient) {
    super(chainId, kernelAccountClient, ST_CELO_CONTRACTS);
  }

  async execute(amount: bigint): Promise<string> {
    const manager = this.getAddress("manager");

    const userOp = await this.kernelAccountClient.sendUserOperation({
      calls: [
        {
          to: manager,
          value: amount,
          data: encodeFunctionData({
            abi: STAKED_CELO_ABI,
            functionName: "deposit",
            args: [],
          }),
        },
      ],
    });

    return this.waitForUserOp(userOp);
  }
}
