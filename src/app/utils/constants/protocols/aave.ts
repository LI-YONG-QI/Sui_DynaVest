import { Address } from "viem";
import { celo } from "viem/chains";

export type AaveSupportedChains = typeof celo.id;

export const AAVE_CONTRACTS: Record<
  AaveSupportedChains,
  {
    pool: Address;
  }
> = {
  [celo.id]: {
    pool: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402", // TODO: cEUR pool bound
  },
};
