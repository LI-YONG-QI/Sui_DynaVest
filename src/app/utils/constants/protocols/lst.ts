import { Address } from "viem";
import { UNISWAP_CONTRACTS, UniswapSupportedChains } from "./uniswap";

export type LSTSupportedChains = UniswapSupportedChains;

// Uniswap protocol contract addresses for each network
export const LST_CONTRACTS: Record<
  LSTSupportedChains,
  {
    swapRouter: Address;
  }
> = { ...UNISWAP_CONTRACTS };
