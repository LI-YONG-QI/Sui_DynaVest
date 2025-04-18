import { Address } from "viem";
import { BaseStrategy } from "./base";
import { LST_CONTRACTS, LSTSupportedChains } from "../constants/protocols/lst";
import { writeContract } from "@wagmi/core";
import { V3_SWAP_ROUTER_ABI } from "@/app/abis";
import { wagmiConfig as config } from "@/providers/config";
import { ETH, getWrappedToken, wstETH } from "../constants/coins";

export class LSTStrategy extends BaseStrategy<LSTSupportedChains> {
  public readonly swapRouter: Address;

  constructor(chainId: number) {
    super(chainId);

    this.swapRouter = LST_CONTRACTS[this.chainId].swapRouter;
  }

  async execute(
    user: Address,
    asset: Address | null,
    amount: bigint
  ): Promise<string> {
    if (asset == null) {
      const tokenIn = getWrappedToken(ETH); // TODO: hardcode
      const tx = await writeContract(config, {
        abi: V3_SWAP_ROUTER_ABI,
        address: this.swapRouter,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: tokenIn.chains![this.chainId],
            tokenOut: wstETH.chains![this.chainId],
            fee: 100,
            recipient: user,
            amountIn: amount,
            amountOutMinimum: BigInt(0),
            sqrtPriceLimitX96: BigInt(0),
          },
        ],
        value: amount,
      });

      return tx;
    } else {
      throw new Error("Asset is not supported"); // TODO: ERC20 does not support yet.
    }
  }

  isSupported(chainId: number): boolean {
    return Object.keys(LST_CONTRACTS).map(Number).includes(chainId);
  }
}
