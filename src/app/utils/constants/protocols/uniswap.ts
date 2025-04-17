import { Address } from "viem";
import { arbitrum, base, bsc } from "viem/chains";

export type UniswapSupportedChains =
  | typeof base.id
  | typeof bsc.id
  | typeof arbitrum.id;

// Uniswap protocol contract addresses for each network
export const UNISWAP_CONTRACTS: Record<
  UniswapSupportedChains,
  {
    swapRouter: Address;
    nftManager: Address;
  }
> = {
  [base.id]: {
    swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481",
    nftManager: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
  },
  [arbitrum.id]: {
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    nftManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  [bsc.id]: {
    swapRouter: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
    nftManager: "0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613",
  },
};
