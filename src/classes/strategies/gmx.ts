import { Address } from "viem";
import { arbitrum } from "viem/chains";
import { readContract, writeContract } from "@wagmi/core";

import { BaseStrategy } from ".//base";
import { GMX_CONTRACTS } from "@/constants/protocols/gmx";
import { wagmiConfig } from "@/providers/config";
import { GMX_STRATEGY_ABI, ERC20_ABI } from "@/constants/abis";

type GMXSupportedChains = typeof arbitrum.id;

export class GMXStrategy extends BaseStrategy<GMXSupportedChains> {
  public readonly beefyVault: Address;
  public readonly gmxStrategy: Address;

  constructor(chainId: number) {
    super(chainId);

    this.beefyVault = GMX_CONTRACTS[this.chainId].beefyVault;
    this.gmxStrategy = GMX_CONTRACTS[this.chainId].gmxStrategy;
  }

  async execute(
    user: Address,
    asset: Address | null,
    amount: bigint
  ): Promise<string> {
    if (asset == null) {
      // For native ETH deposits to Beefy vault via GMX strategy

      const result = await this.executeWaitTx(() =>
        writeContract(wagmiConfig, {
          address: this.gmxStrategy,
          abi: GMX_STRATEGY_ABI,
          functionName: "depositToBeefyVaultWithETH",
          args: [],
          value: amount,
        })
      );

      return result;
    } else {
      throw new Error("Only native ETH is supported for GMX strategy");
    }
  }

  async getBeefyVaultBalance(user: Address): Promise<bigint> {
    const beefyBalance = await readContract(wagmiConfig, {
      address: this.beefyVault,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [user],
    });

    return beefyBalance;
  }

  isSupported(chainId: number): boolean {
    return chainId === arbitrum.id;
  }
}
