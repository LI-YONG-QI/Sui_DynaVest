import { bsc } from "viem/chains";
import { BaseStrategy } from "./base";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { V3_SWAP_ROUTER_ABI } from "@/app/abis";
import { wagmiConfig as config } from "@/providers/config";
import { BNB, getWrappedToken, wbETH } from "../constants";
import { LST_CONTRACTS } from "../constants/protocols/lst";

export class BscLstStrategy extends BaseStrategy<typeof bsc.id> {
  public readonly swapRouter: Address;

  constructor(chainId: number) {
    super(chainId);

    this.swapRouter = LST_CONTRACTS[this.chainId].swapRouter;
  }

  async execute(user: Address, asset: Address | null, amount: bigint) {
    if (asset == null) {
      const tokenIn = getWrappedToken(BNB);
      const tx = await writeContract(config, {
        abi: V3_SWAP_ROUTER_ABI,
        address: this.swapRouter,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: tokenIn.chains![this.chainId],
            tokenOut: wbETH.chains![this.chainId],
            fee: 3000,
            recipient: user,
            amountIn: amount,
            amountOutMinimum: BigInt(0), // TODO: Add amountOutMinimum
            sqrtPriceLimitX96: BigInt(0), // TODO: Add sqrtPriceLimitX96
          },
        ],
        value: BigInt(amount),
      });

      return tx;
    } else {
      throw new Error("Asset is not supported");
    }
  }

  isSupported(chainId: number): boolean {
    return chainId === bsc.id;
  }
}
