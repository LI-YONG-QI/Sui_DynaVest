/* eslint-disable */

import { Address } from "viem";
import { mainnet } from "viem/chains";
import { writeContract } from "@wagmi/core";

import { BaseStrategy } from "./base";
import {
  UNISWAP_CONTRACTS,
  UniswapSupportedChains,
} from "../constants/protocols/uniswap";
import { wagmiConfig as config } from "@/providers/config";
import { ERC20_ABI, NFT_MANAGER_ABI } from "@/app/abis";
import { cbBTC } from "@/app/utils/constants/coins";
import { PERMIT_EXPIRY } from "../constants";

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
    // TODO: build util function
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(timestampInSeconds) + BigInt(PERMIT_EXPIRY);

    await writeContract(config, {
      abi: ERC20_ABI,
      address: asset,
      functionName: "approve",
      args: [this.nftManager, amount],
    });

    await writeContract(config, {
      abi: ERC20_ABI,
      address: cbBTC.chains![this.chainId],
      functionName: "approve",
      args: [this.nftManager, amount],
    });

    const tx = await writeContract(config, {
      abi: NFT_MANAGER_ABI,
      address: this.nftManager,
      functionName: "mint",
      args: [
        {
          token0: asset,
          token1: cbBTC.chains![this.chainId],
          fee: 100,
          tickLower: -887220,
          tickUpper: 887220,
          amount0Desired: amount,
          amount1Desired: amount,
          amount0Min: BigInt(0),
          amount1Min: BigInt(0),
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
}
