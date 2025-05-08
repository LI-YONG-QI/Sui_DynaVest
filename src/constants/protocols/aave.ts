import { Address } from "viem";
import { arbitrum, base, bsc, celo, polygon } from "viem/chains";

export type AaveSupportedChains =
  | typeof celo.id
  | typeof bsc.id
  | typeof arbitrum.id
  | typeof base.id
  | typeof polygon.id;

export const AAVE_CONTRACTS: Record<
  AaveSupportedChains,
  {
    pool: Address;
  }
> = {
  [celo.id]: {
    pool: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
  },
  [bsc.id]: {
    pool: "0x6807dc923806fE8Fd134338EABCA509979a7e0cB",
  },
  [arbitrum.id]: {
    pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  },
  [base.id]: {
    pool: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
  },
  [polygon.id]: {
    pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  },
};
