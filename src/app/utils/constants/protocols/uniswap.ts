import { Address } from "viem";
import { base } from "viem/chains";

export type UniswapSupportedChains = typeof base.id;

// Uniswap protocol contract addresses for each network
export const UNISWAP_CONTRACTS: Record<
  UniswapSupportedChains,
  {
    swapRouter: Address;
    nftManager: Address;
  }
> = {
  [base.id]: {
    swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481",
    nftManager: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
  },
};

// Pool fee tiers available in Uniswap V3
export enum PoolFee {
  LOWEST = 100, // 0.01%
  LOW = 500, // 0.05%
  MEDIUM = 3000, // 0.3%
  HIGH = 10000, // 1%
}

// Commands for Universal Router
export enum UniswapCommand {
  V3_SWAP_EXACT_IN = 0x00,
  V3_SWAP_EXACT_OUT = 0x01,
  PERMIT2_TRANSFER_FROM = 0x02,
  PERMIT2_PERMIT_BATCH = 0x03,
  SWEEP = 0x04,
  TRANSFER = 0x05,
  PAY_PORTION = 0x06,
  V2_SWAP_EXACT_IN = 0x08,
  V2_SWAP_EXACT_OUT = 0x09,
  PERMIT2_PERMIT = 0x0a,
  WRAP_ETH = 0x0b,
  UNWRAP_WETH = 0x0c,
  PERMIT2_TRANSFER_FROM_BATCH = 0x0d,
  BALANCE_CHECK_ERC20 = 0x0e,
}
