import { Address } from "viem";
import { celo, mainnet } from "viem/chains";

export type AaveSupportedChains = typeof celo.id | typeof mainnet.id;

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
  [mainnet.id]: {
    executor: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", // Ethereum mainnet AAVE V3 Pool Proxy
    supplyAssets: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC on mainnet
  },
};
