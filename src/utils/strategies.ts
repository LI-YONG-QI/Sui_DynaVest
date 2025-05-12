import { KernelAccountClient } from "@zerodev/sdk";
import { bsc } from "viem/chains";

import { Protocol, Protocols } from "@/types";
import { BNB, ETH, PERMIT_EXPIRY, wbETH, wstETH } from "@/constants";
import {
  BaseStrategy,
  MorphoSupply,
  UniswapV3SwapLST,
  CamelotStaking,
  GMXDeposit,
  StCeloStaking,
  AaveV3Supply,
} from "@/classes/strategies";

export function getDeadline(): bigint {
  const timestampInSeconds = Math.floor(Date.now() / 1000);
  return BigInt(timestampInSeconds) + BigInt(PERMIT_EXPIRY);
}

export function getStrategy(
  protocol: Protocol,
  chainId: number,
  kernelAccountClient: KernelAccountClient
): BaseStrategy<Protocols> {
  // The type casting here is safe because we've already verified the chainId is supported
  // for the specific protocol with isChainIdSupported
  switch (protocol) {
    case "MorphoSupply":
      return new MorphoSupply(chainId, kernelAccountClient);
    case "AaveV3Supply":
      return new AaveV3Supply(chainId, kernelAccountClient);
    case "StCeloStaking":
      return new StCeloStaking(chainId, kernelAccountClient);
    case "UniswapV3SwapLST": {
      if (chainId === bsc.id) {
        return new UniswapV3SwapLST(chainId, kernelAccountClient, BNB, wbETH);
      } else {
        return new UniswapV3SwapLST(chainId, kernelAccountClient, ETH, wstETH);
      }
    }
    case "CamelotStaking":
      return new CamelotStaking(chainId, kernelAccountClient);
    case "GMXDeposit":
      return new GMXDeposit(chainId, kernelAccountClient);
    default:
      throw new Error("Unsupported protocol");
  }
}
