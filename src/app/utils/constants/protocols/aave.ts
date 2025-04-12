import { Address } from "viem";
import { celo } from "viem/chains";

export type AaveSupportedChains = typeof celo.id;

export const AAVE_CONTRACTS: Record<
  AaveSupportedChains,
  {
    supplyAssets: Address;
    pool: Address;
  }
> = {
  [celo.id]: {
    supplyAssets: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
    pool: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
  },
};
