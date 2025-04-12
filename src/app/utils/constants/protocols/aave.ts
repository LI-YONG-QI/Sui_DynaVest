import { Address } from "viem";
import { celo } from "viem/chains";

export type AaveSupportedChains = typeof celo.id;

export const AAVE_CONTRACTS: Record<
  AaveSupportedChains,
  {
    executor: Address;
    supplyAssets: Address;
  }
> = {
  [celo.id]: {
    executor: "0x2A386Fb9e19D201A1dAF875fcD5c934c06265b65",
    supplyAssets: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  },
};
