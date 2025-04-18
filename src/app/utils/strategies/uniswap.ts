/* eslint-disable */

import { Address } from "viem";
import { mainnet } from "viem/chains";
import { readContract, writeContract } from "@wagmi/core";

import { BaseStrategy } from "./base";
import {
  UNISWAP_CONTRACTS,
  UniswapSupportedChains,
} from "../constants/protocols/uniswap";
import { wagmiConfig as config } from "@/providers/config";
import { ERC20_ABI, NFT_MANAGER_ABI } from "@/app/abis";
import { USDT } from "@/app/utils/constants/coins";
import { getDeadline } from "./utils";

/**
 * Compares two addresses lexicographically
 * @param addressA First address
 * @param addressB Second address
 * @returns negative if addressA < addressB, positive if addressA > addressB, 0 if equal
 */
export function compareAddresses(addressA: Address, addressB: Address): number {
  // Convert to lowercase to ensure consistent comparison
  const a = addressA.toLowerCase();
  const b = addressB.toLowerCase();

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Returns addresses sorted in ascending order
 * @param addressA First address
 * @param addressB Second address
 * @returns [smallerAddress, largerAddress]
 */
export function sortAddresses(
  addressA: Address,
  addressB: Address
): [Address, Address] {
  return compareAddresses(addressA, addressB) < 0
    ? [addressA, addressB]
    : [addressB, addressA];
}

export class UniswapV3Strategy extends BaseStrategy<UniswapSupportedChains> {
  public readonly swapRouter: Address;
  public readonly nftManager: Address;

  constructor(chainId: number) {
    super(chainId);

    this.swapRouter = UNISWAP_CONTRACTS[this.chainId].swapRouter;
    this.nftManager = UNISWAP_CONTRACTS[this.chainId].nftManager;
  }

  // TODO: only support USDC/cbBTC, and user must have both
  async execute(
    user: Address,
    asset: Address,
    amount: bigint
  ): Promise<string> {
    const deadline = getDeadline();

    const assetAllowance = await readContract(config, {
      abi: ERC20_ABI,
      address: asset,
      functionName: "allowance",
      args: [user, this.nftManager],
    });

    if (assetAllowance < amount) {
      await writeContract(config, {
        abi: ERC20_ABI,
        address: asset,
        functionName: "approve",
        args: [this.nftManager, amount],
      });
    }

    const usdtAllowance = await readContract(config, {
      abi: ERC20_ABI,
      address: USDT.chains![this.chainId],
      functionName: "allowance",
      args: [user, this.nftManager],
    });

    if (usdtAllowance < amount * BigInt(2)) {
      await writeContract(config, {
        abi: ERC20_ABI,
        address: USDT.chains![this.chainId],
        functionName: "approve",
        args: [this.nftManager, amount * BigInt(2)],
      });
    }

    const [token0, token1] = this.sortAddresses(
      asset,
      USDT.chains![this.chainId]
    );

    const tx = await writeContract(config, {
      abi: NFT_MANAGER_ABI,
      address: this.nftManager,
      functionName: "mint",
      args: [
        {
          token0,
          token1,
          fee: 100,
          tickLower: -887220,
          tickUpper: 887220,
          amount0Desired: amount,
          amount1Desired: amount * BigInt(2), // TODO: calculate the valid amount of token1
          amount0Min: BigInt(0), // TODO: add min amount
          amount1Min: BigInt(0), // TODO: add min amount
          recipient: user,
          deadline,
        },
      ],
    });

    return tx;
  }

  isSupported(chainId: number): boolean {
    return Object.keys(UNISWAP_CONTRACTS).map(Number).includes(chainId);
  }

  private compareAddresses(addressA: Address, addressB: Address): number {
    // Convert to lowercase to ensure consistent comparison
    const a = addressA.toLowerCase();
    const b = addressB.toLowerCase();

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  private sortAddresses(
    addressA: Address,
    addressB: Address
  ): [Address, Address] {
    return this.compareAddresses(addressA, addressB) < 0
      ? [addressA, addressB]
      : [addressB, addressA];
  }
}
