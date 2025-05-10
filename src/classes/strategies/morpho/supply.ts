import { KernelAccountClient } from "@zerodev/sdk";
import { Address, encodeFunctionData, Hex, toHex } from "viem";
import { readContract } from "@wagmi/core";

import { MORPHO_CONTRACTS, ERC20_ABI, MORPHO_ABI } from "@/constants";
import { BaseStrategy } from "../base";
import { wagmiConfig as config } from "@/providers/config";
import type {
  MorphoChains,
  MorphoAddresses,
} from "@/constants/protocols/morpho";

export class MorphoSupply extends BaseStrategy<MorphoChains, MorphoAddresses> {
  constructor(chainId: number, kernelAccountClient: KernelAccountClient) {
    super(chainId, kernelAccountClient, MORPHO_CONTRACTS);
  }

  async execute(amount: bigint, asset?: Address) {
    if (!asset)
      throw new Error("MorphoSupply: doesn't support native token yet");

    const morpho = this.getAddress("morpho");
    const wethUsdcMarket =
      "0x8793cf302b8ffd655ab97bd1c695dbd967807e8367a65cb2f4edaf1380ba1bda"; // TODO: mock market id
    const marketParams = await this.#getMarketParams(wethUsdcMarket);

    const userOp = await this.kernelAccountClient.sendUserOperation({
      calls: [
        {
          to: asset,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [morpho, amount],
          }),
        },
        {
          to: morpho,
          data: encodeFunctionData({
            abi: MORPHO_ABI,
            functionName: "supply",
            args: [marketParams, amount, BigInt(0), this.user, toHex("")],
          }),
        },
      ],
    });

    return this.waitForUserOp(userOp);
  }

  async #getMarketParams(marketId: Hex) {
    const morpho = this.getAddress("morpho");

    const [loanToken, collateralToken, oracle, irm, lltv] = await readContract(
      config,
      {
        chainId: this.chainId,
        abi: MORPHO_ABI,
        address: morpho,
        functionName: "idToMarketParams",
        args: [marketId],
      }
    );

    return {
      loanToken,
      collateralToken,
      oracle,
      irm,
      lltv,
    };
  }
}
