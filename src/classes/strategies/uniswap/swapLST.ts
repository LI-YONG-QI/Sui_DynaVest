import { Address, encodeFunctionData } from "viem";
import { KernelAccountClient } from "@zerodev/sdk";

import { BaseStrategy } from "../baseStrategy";

import { V3_SWAP_ROUTER_ABI } from "@/constants/abis";
import { getWrappedToken } from "@/constants/coins";
import { UNISWAP_CONTRACTS } from "@/constants/protocols/uniswap";
import { Token } from "@/types/blockchain";

/**
 * @notice swap nativeToken to wstETH
 * @notice Ethereum: ETH -> wstETH
 * @notice BSC: BNB -> wbETH
 */

export class UniswapV3SwapLST extends BaseStrategy<typeof UNISWAP_CONTRACTS> {
  constructor(
    chainId: number,
    kernelAccountClient: KernelAccountClient,
    public readonly nativeToken: Token,
    public readonly lstToken: Token
  ) {
    super(chainId, kernelAccountClient, UNISWAP_CONTRACTS);
  }

  async execute(amount: bigint, asset?: Address): Promise<string> {
    const swapRouter = this.getAddress("swapRouter");

    if (!asset) {
      const tokenIn = getWrappedToken(this.nativeToken);
      const tokenInAddress = tokenIn.chains![this.chainId];
      const tokenOutAddress = this.lstToken.chains![this.chainId];

      const userOp = await this.kernelAccountClient.sendUserOperation({
        calls: [
          {
            to: swapRouter,
            value: amount,
            data: encodeFunctionData({
              abi: V3_SWAP_ROUTER_ABI,
              functionName: "exactInputSingle",
              args: [
                {
                  tokenIn: tokenInAddress,
                  tokenOut: tokenOutAddress,
                  fee: 100,
                  recipient: this.user,
                  amountIn: amount,
                  amountOutMinimum: BigInt(0),
                  sqrtPriceLimitX96: BigInt(0),
                },
              ],
            }),
          },
        ],
      });

      return this.waitForUserOp(userOp);
    } else {
      throw new Error("UniswapV3SwapLST: ERC20 doesn't support yet.");
    }
  }
}
