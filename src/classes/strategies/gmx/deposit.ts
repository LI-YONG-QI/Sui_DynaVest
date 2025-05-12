import { Address, encodeFunctionData } from "viem";
import { readContract } from "@wagmi/core";
import { KernelAccountClient } from "@zerodev/sdk";

import { BaseStrategy } from "../baseStrategy";
import { GMX_CONTRACTS } from "@/constants/protocols/gmx";
import { wagmiConfig } from "@/providers/config";
import { GMX_STRATEGY_ABI, ERC20_ABI } from "@/constants/abis";

export class GMXDeposit extends BaseStrategy<typeof GMX_CONTRACTS> {
  constructor(chainId: number, kernelAccountClient: KernelAccountClient) {
    super(chainId, kernelAccountClient, GMX_CONTRACTS);
  }

  async execute(amount: bigint, asset?: Address): Promise<string> {
    if (!asset) {
      // For native ETH deposits to Beefy vault via GMX strategy
      const gmxStrategy = this.getAddress("gmxStrategy");

      const userOp = await this.kernelAccountClient.sendUserOperation({
        calls: [
          {
            to: gmxStrategy,
            value: amount,
            data: encodeFunctionData({
              abi: GMX_STRATEGY_ABI,
              functionName: "depositToBeefyVaultWithETH",
              args: [],
            }),
          },
        ],
      });

      return this.waitForUserOp(userOp);
    } else {
      throw new Error(
        "GMXDeposit: Only native ETH is supported for GMX strategy"
      );
    }
  }

  async getBeefyVaultBalance(user: Address): Promise<bigint> {
    const beefyVault = this.getAddress("beefyVault");

    const beefyBalance = (await readContract(wagmiConfig, {
      address: beefyVault,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [user],
    })) as bigint;

    return beefyBalance;
  }
}
