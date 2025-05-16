import { bsc, celo, flowMainnet, base, arbitrum, polygon } from "viem/chains";

import { CELO, FLOW, BNB, USDT, USDC, ETH } from "@/constants/coins";
import { Token } from "@/types";
import type { SupportedChainIds } from "@/providers/config";

// Define SUPPORTED_TOKENS with the correct type annotation
export const SUPPORTED_TOKENS: Record<SupportedChainIds, Token[]> = {
  [polygon.id]: [USDT, USDC], // Polygon
  [arbitrum.id]: [ETH, USDT, USDC], // Arbitrum
  [base.id]: [ETH, USDT, USDC], // Base
  [bsc.id]: [BNB, USDT, USDC], // BSC
  [celo.id]: [CELO, USDT, USDC], // Celo
  [flowMainnet.id]: [FLOW, USDT, USDC], // Flow
};
