import { Address } from "viem";
import { base, celo } from "viem/chains";
import { MorphoSupportedChains } from "./morpho";
import { AaveSupportedChains } from "./aave";

export type DynaVestSupportedChains =
  | MorphoSupportedChains
  | AaveSupportedChains;

export const DYNAVEST_CONTRACTS: Record<
  DynaVestSupportedChains,
  {
    executor: Address;
  }
> = {
  [base.id]: {
    executor: "0xbB6Aed42b49e427FeA6048715e0a1E4F9cFfacA6",
  },
  [celo.id]: {
    executor: "0x2a386fb9e19d201a1daf875fcd5c934c06265b65",
  },
};
