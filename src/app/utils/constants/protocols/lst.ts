import { Address } from "viem";
import { UNISWAP_CONTRACTS, UniswapSupportedChains } from "./uniswap";
import { bsc } from "viem/chains";

export type LSTSupportedChains = Exclude<UniswapSupportedChains, typeof bsc.id>;

// Uniswap protocol contract addresses for each network
export const LST_CONTRACTS: Record<
  LSTSupportedChains,
  {
    swapRouter: Address;
  }
> = { ...UNISWAP_CONTRACTS };
