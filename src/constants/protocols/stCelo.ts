import { Address } from "viem";
import { celo } from "viem/chains";

export type StCeloSupportedChains = typeof celo.id;

export const ST_CELO_CONTRACTS: Record<
  StCeloSupportedChains,
  {
    manager: Address;
  }
> = {
  [celo.id]: {
    manager: "0x0239b96D10a434a56CC9E09383077A0490cF9398",
  },
};
