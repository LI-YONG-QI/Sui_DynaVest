import { flowMainnet } from "viem/chains";
import { Address } from "viem";

export type AnkrSupportedChains = typeof flowMainnet.id;

export const ANKR_CONTRACTS: Record<
  AnkrSupportedChains,
  {
    ankrFLOW: Address;
  }
> = {
  [flowMainnet.id]: {
    ankrFLOW: "0xFE8189A3016cb6A3668b8ccdAC520CE572D4287a",
  },
};
