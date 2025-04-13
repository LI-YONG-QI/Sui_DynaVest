export * from "./aave";

import { StCeloSupportedChains } from "../constants/protocols/stCelo";
import { AnkrSupportedChains } from "../constants/protocols/ankr";
import { KittySupportedChains } from "../constants/protocols/kitty";
import { flowMainnet, mainnet, bsc } from "viem/chains";
import {
  AaveSupportedChains,
  AAVE_CONTRACTS,
} from "../constants/protocols/aave";
import { ST_CELO_CONTRACTS } from "../constants/protocols/stCelo";
import { ANKR_CONTRACTS } from "../constants/protocols/ankr";
import { KITTY_CONTRACTS } from "../constants/protocols/kitty";

import { AaveV3Strategy } from "./aave";
import { AnkrFlowStrategy } from "./ankrFlow";
import { FlowStrategy } from "./flow";
import { KittyStrategy } from "./kitty";
import { StCeloStrategy } from "./stCelo";
import {
  MORPHO_CONTRACTS,
  MorphoSupportedChains,
} from "../constants/protocols/morpho";
import { MorphoSupplyingStrategy } from "./morpho";
import { BaseStrategy } from "./base";
import { UniswapV3Strategy } from "./uniswap";
import { BscAaveV3Strategy } from "./bsc";

// // Helper function to validate if chainId is supported for a specific protocol
// function isChainIdSupported(protocol: string, chainId: number): boolean {
//   switch (protocol) {
//     case "AAVE":
//       // Check if the chainId exists as a key in AAVE_CONTRACTS
//       return Object.keys(AAVE_CONTRACTS).map(Number).includes(chainId);
//     case "stCelo":
//       return Object.keys(ST_CELO_CONTRACTS).map(Number).includes(chainId);
//     case "ankrFlow":
//       return Object.keys(ANKR_CONTRACTS).map(Number).includes(chainId);
//     case "Kitty":
//       return Object.keys(KITTY_CONTRACTS).map(Number).includes(chainId);
//     case "Flow":
//       return chainId === flowMainnet.id; // Flow only supports flowMainnet for now
//     case "Morpho":
//       return Object.keys(MORPHO_CONTRACTS).map(Number).includes(chainId);
//     case "Uniswap":
//       return chainId === mainnet.id;
//     default:
//       return false;
//   }
// }

export function getStrategy(
  protocol: string,
  chainId: number
): BaseStrategy<number> {
  // The type casting here is safe because we've already verified the chainId is supported
  // for the specific protocol with isChainIdSupported
  switch (protocol) {
    case "AAVE":
      return new AaveV3Strategy(chainId as AaveSupportedChains);
    case "stCelo":
      return new StCeloStrategy(chainId as StCeloSupportedChains);
    case "ankrFlow":
      return new AnkrFlowStrategy(chainId as AnkrSupportedChains);
    case "Kitty":
      return new KittyStrategy(chainId as KittySupportedChains);
    case "Flow":
      return new FlowStrategy(chainId as typeof flowMainnet.id);
    case "Morpho":
      return new MorphoSupplyingStrategy(chainId as MorphoSupportedChains);
    case "Uniswap":
      return new UniswapV3Strategy(chainId as typeof mainnet.id);
    case "Bsc Aave":
      return new BscAaveV3Strategy(chainId as typeof bsc.id);
    default:
      throw new Error("Unsupported protocol");
  }
}
