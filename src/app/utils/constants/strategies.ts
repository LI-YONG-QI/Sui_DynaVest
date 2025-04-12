import { celo, flowMainnet, base } from "viem/chains";

import { USDC, USDT, CELO, FLOW, cEUR } from "./coins";
import type { StrategyMetadata } from "../types";

export const STRATEGIES_METADATA: StrategyMetadata[] = [
  {
    title: "1inch Swap",
    apy: 2.4,
    risk: {
      level: "Low" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "1inch",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/base.png",
    externalLink: "https://morpho.org",
    learnMoreLink: "https://morpho.org",
    tokens: [USDT, USDC],
    chainId: base.id,
    displayInsufficientBalance: true, // TODO: review hardcoded data
  },
  {
    title: "Morpho Supplying",
    apy: 2.4,
    risk: {
      level: "Low" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "Morpho",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/base.png",
    externalLink: "https://morpho.org",
    learnMoreLink: "https://morpho.org",
    tokens: [USDT, USDC],
    chainId: base.id,
  },
  {
    title: "Compound Yield",
    apy: 3.9,
    risk: {
      level: "High" as const,
      color: "#E83033",
      bgColor: "rgba(232, 48, 51, 0.3)",
    },
    protocol: "Compound",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/base.png",
    externalLink: "https://compound.finance",
    learnMoreLink: "https://compound.finance",
    tokens: [USDT, USDC],
    chainId: base.id,
  },
  {
    title: "AAVE Lending Strategy",
    apy: 10,
    risk: {
      level: "Medium" as const,
      color: "#B9AB15",
      bgColor: "rgba(230, 212, 9, 0.3)",
    },
    protocol: "AAVE",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/celo.png",
    externalLink: "https://aave.com",
    learnMoreLink: "https://aave.com",
    tokens: [cEUR],
    chainId: celo.id,
  },

  {
    title: "stCelo",
    apy: 2,
    risk: {
      level: "Low" as const,
      color: "#E83033",
      bgColor: "rgba(232, 48, 51, 0.3)",
    },
    protocol: "stCelo",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/celo.png",
    externalLink: "https://stcelo.com",
    learnMoreLink: "https://stcelo.com",
    tokens: [CELO],
    chainId: celo.id,
  },
  {
    title: "Ankr Flow",
    apy: 3.9,
    risk: {
      level: "Low" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "ankrFlow",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/flow.png",
    externalLink: "https://ankrflow.com",
    learnMoreLink: "https://ankrflow.com",
    tokens: [FLOW],
    chainId: flowMainnet.id,
  },
  {
    title: "Kitty",
    apy: 4.3,
    risk: {
      level: "Low" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "Kitty",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/flow.png",
    externalLink: "https://kitty.com",
    learnMoreLink: "https://kitty.com",
    tokens: [FLOW],
    chainId: flowMainnet.id,
  },
  {
    title: "Flow Yield",
    apy: 23.0,
    risk: {
      level: "High" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "Flow",
    description:
      "Providing ankrFlow tokens as liquidity to KittyStable allows you to earn both liquid staking rewards and swap fees.",
    image: "/flow.png",
    externalLink: "https://flow.com",
    learnMoreLink: "https://flow.com",
    tokens: [FLOW],
    chainId: flowMainnet.id,
  },
];
