import { bsc } from "viem/chains";

import { EVMProtocol, SuiProtocol, Protocols } from "@/types";
import { BNB, ETH, PERMIT_EXPIRY, wbETH, wstETH } from "@/constants";
import {
  MorphoSupply,
  UniswapV3SwapLST,
  CamelotStaking,
  GMXDeposit,
  StCeloStaking,
  AaveV3Supply,
  UniswapV3AddLiquidity,
} from "@/classes/strategies";

import { BucketStakeBut, BucketBorrow } from "@/classes/strategies/bucket";

import { EVMBaseStrategy, SuiBaseStrategy } from "@/classes/strategies/base";
import { ScallopSupply } from "@/classes/strategies/scallop/supply";
import { CetusSwap } from "@/classes/strategies/cetus/swap";
import { CetusAddLiquidity } from "@/classes/strategies/cetus/addLiquidity";

export function getDeadline(): bigint {
  const timestampInSeconds = Math.floor(Date.now() / 1000);
  return BigInt(timestampInSeconds) + BigInt(PERMIT_EXPIRY);
}

export function getEVMStrategy(
  protocol: EVMProtocol,
  chainId: number
): EVMBaseStrategy<Protocols> {
  // The type casting here is safe because we've already verified the chainId is supported
  // for the specific protocol with isChainIdSupported

  switch (protocol) {
    case "MorphoSupply":
      return new MorphoSupply(chainId);
    case "AaveV3Supply":
      return new AaveV3Supply(chainId);
    case "StCeloStaking":
      return new StCeloStaking(chainId);
    case "UniswapV3SwapLST": {
      if (chainId === bsc.id) {
        return new UniswapV3SwapLST(chainId, BNB, wbETH);
      } else {
        return new UniswapV3SwapLST(chainId, ETH, wstETH);
      }
    }
    case "UniswapV3AddLiquidity":
      return new UniswapV3AddLiquidity(chainId);
    case "CamelotStaking":
      return new CamelotStaking(chainId);
    case "GMXDeposit":
      return new GMXDeposit(chainId);
    default:
      throw new Error("Unsupported protocol");
  }
}

export function getSuiStrategy(
  protocol: SuiProtocol,
  chainId: number
): SuiBaseStrategy<Protocols> {
  switch (protocol) {
    case "BucketBorrow":
      return new BucketBorrow(chainId);
    case "BucketStaking":
      return new BucketStakeBut(chainId);
    case "ScallopSupply":
      return new ScallopSupply(chainId);
    case "CetusSwap":
      return new CetusSwap(chainId);
    case "CetusAddLiquidity":
      return new CetusAddLiquidity(chainId);
    default:
      throw new Error("Unsupported protocol");
  }
}
