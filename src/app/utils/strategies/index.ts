export * from "./aave";

import { AaveV3Strategy } from "./aave";
import { AnkrFlowStrategy } from "./ankrFlow";
import { FlowStrategy } from "./flow";
import { KittyStrategy } from "./kitty";
import { StCeloStrategy } from "./stCelo";

import { MorphoSupplyingStrategy } from "./morpho";
import { BaseStrategy } from "./base";
import { UniswapV3Strategy } from "./uniswap";
import { BscAaveV3Strategy } from "./bsc";
import { Protocol } from "../types";

export function getStrategy(
  protocol: Protocol,
  chainId: number
): BaseStrategy<number> {
  // The type casting here is safe because we've already verified the chainId is supported
  // for the specific protocol with isChainIdSupported
  switch (protocol) {
    case "AAVE":
      return new AaveV3Strategy(chainId);
    case "stCelo":
      return new StCeloStrategy(chainId);
    case "ankrFlow":
      return new AnkrFlowStrategy(chainId);
    case "Kitty":
      return new KittyStrategy(chainId);
    case "Flow":
      return new FlowStrategy(chainId);
    case "Morpho":
      return new MorphoSupplyingStrategy(chainId);
    case "Uniswap":
      return new UniswapV3Strategy(chainId);
    case "Bsc Aave":
      return new BscAaveV3Strategy(chainId);
    default:
      throw new Error("Unsupported protocol");
  }
}
