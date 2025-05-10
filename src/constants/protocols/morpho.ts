import { Address } from "viem";
import { base } from "viem/chains";

import { ProtocolAddresses } from "@/types/strategies";

export type MorphoChains = typeof base.id;

export type MorphoAddresses = {
  morpho: Address;
};
 
export const MORPHO_CONTRACTS: ProtocolAddresses<
  MorphoChains,
  MorphoAddresses
> = {
  [base.id]: {
    morpho: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
  },
};
