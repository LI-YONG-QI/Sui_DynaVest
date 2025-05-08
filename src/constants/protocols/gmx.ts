import { Address } from "viem";
import { arbitrum } from "viem/chains";

export type GMXSupportedChains = typeof arbitrum.id;

export const GMX_CONTRACTS: Record<
  GMXSupportedChains,
  {
    beefyVault: Address;
    gmxStrategy: Address;
  }
> = {
  [arbitrum.id]: {
    beefyVault: "0x5B904f19fb9ccf493b623e5c8cE91603665788b0",
    gmxStrategy: "0xC5943Be661378fA544d606cADCC67D3487AE25C9", // From the deployment log
  },
};
