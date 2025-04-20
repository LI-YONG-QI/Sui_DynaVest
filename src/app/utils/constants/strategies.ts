import { celo, flowMainnet, base, bsc, arbitrum, polygon } from "viem/chains";

import { USDC, USDT, CELO, FLOW, cEUR, ETH, BNB } from "./coins";
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
    image: "/crypto-icons/base.png",
    externalLink: "https://morpho.org",
    learnMoreLink: "https://morpho.org",
    tokens: [USDT, USDC],
    chainId: base.id,
    displayInsufficientBalance: true,
  },
  {
    title: "Morpho Supplying",
    apy: 5.4,
    risk: {
      level: "Medium" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "Morpho",
    description:
      "Supplying USDC to AAVE Lending Protocol enables earning interest and rewards, maximizing returns in DeFi.",
    image: "/crypto-icons/base.png",
    externalLink:
      "https://app.morpho.org/base/market/0x8793cf302b8ffd655ab97bd1c695dbd967807e8367a65cb2f4edaf1380ba1bda/weth-usdc",
    learnMoreLink:
      "https://app.morpho.org/base/market/0x8793cf302b8ffd655ab97bd1c695dbd967807e8367a65cb2f4edaf1380ba1bda/weth-usdc",
    tokens: [USDC],
    chainId: base.id,
  },
  {
    title: "AAVE Lending Strategy",
    apy: 3.33,
    risk: {
      level: "Medium" as const,
      color: "#B9AB15",
      bgColor: "rgba(230, 212, 9, 0.3)",
    },
    protocol: "AAVE",
    description:
      "Supplying USDC to AAVE Lending Protocol enables earning interest and rewards, maximizing returns in DeFi.",
    image: "/crypto-icons/base.png",
    externalLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&marketName=proto_base_v3",
    learnMoreLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&marketName=proto_base_v3",
    tokens: [USDC],
    chainId: base.id,
  },
  {
    title: "AAVE Lending Strategy",
    apy: 2.47,
    risk: {
      level: "Medium" as const,
      color: "#B9AB15",
      bgColor: "rgba(230, 212, 9, 0.3)",
    },
    protocol: "AAVE",
    description:
      "Supplying USDC to AAVE Lending Protocol enables earning interest and rewards, maximizing returns in DeFi.",
    image: "/crypto-icons/arb.svg",
    externalLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0xaf88d065e77c8cc2239327c5edb3a432268e5831&marketName=proto_arbitrum_v3",
    learnMoreLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0xaf88d065e77c8cc2239327c5edb3a432268e5831&marketName=proto_arbitrum_v3",
    tokens: [USDC],
    chainId: arbitrum.id,
  },
  {
    title: "AAVE Lending Strategy",
    apy: 2.93,
    risk: {
      level: "Medium" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "BSC Aave",
    description:
      "Supplying USDC to AAVE Lending Protocol enables earning interest and rewards, maximizing returns in DeFi.",
    image: "/crypto-icons/bnb.svg",
    externalLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&marketName=proto_bnb_v3",
    learnMoreLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&marketName=proto_bnb_v3",
    tokens: [USDC],
    chainId: bsc.id,
  },
  {
    title: "AAVE Lending Strategy",
    apy: 0.09,
    risk: {
      level: "Medium" as const,
      color: "#B9AB15",
      bgColor: "rgba(230, 212, 9, 0.3)",
    },
    protocol: "AAVE",
    description:
      "Supplying USDC to AAVE Lending Protocol enables earning interest and rewards, maximizing returns in DeFi.",
    image: "/crypto-icons/celo.svg",
    externalLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0xceba9300f2b948710d2653dd7b07f33a8b32118c&marketName=proto_celo_v3",
    learnMoreLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0xceba9300f2b948710d2653dd7b07f33a8b32118c&marketName=proto_celo_v3",
    tokens: [cEUR],
    chainId: celo.id,
  },
  {
    title: "AAVE Lending Strategy",
    apy: 3.28,
    risk: {
      level: "Medium" as const,
      color: "#B9AB15",
      bgColor: "rgba(230, 212, 9, 0.3)",
    },
    protocol: "AAVE",
    description:
      "Supplying USDC to AAVE Lending Protocol enables earning interest and rewards, maximizing returns in DeFi.",
    image: "/crypto-icons/polygon.svg",
    externalLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359&marketName=proto_polygon_v3",
    learnMoreLink:
      "https://app.aave.com/reserve-overview/?underlyingAsset=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359&marketName=proto_polygon_v3",
    tokens: [USDC],
    chainId: polygon.id,
  },
  {
    title: "Uniswap Liquidity",
    apy: 0.32,
    risk: {
      level: "High" as const,
      color: "",
      bgColor: "",
    },
    protocol: "Uniswap",
    description:
      "Adding USDC and USDT to the Uniswap v3 USDC/USDT 0.01% pool enables users to earn swap fees by providing liquidity for trading between these stablecoins.",
    image: "/crypto-icons/base.png",
    externalLink:
      "https://app.uniswap.org/explore/pools/base/0xD56da2B74bA826f19015E6B7Dd9Dae1903E85DA1",
    learnMoreLink:
      "https://app.uniswap.org/explore/pools/base/0xD56da2B74bA826f19015E6B7Dd9Dae1903E85DA1",
    tokens: [USDC],
    chainId: base.id,
  },
  {
    title: "Uniswap Liquidity",
    apy: 0.32,
    risk: {
      level: "High" as const,
      color: "",
      bgColor: "",
    },
    protocol: "Uniswap",
    description:
      "Adding USDC and USDT to the Uniswap v3 USDC/USDT 0.01% pool enables users to earn swap fees by providing liquidity for trading between these stablecoins.",
    image: "/crypto-icons/bnb.svg",
    externalLink:
      "https://app.uniswap.org/explore/pools/bnb/0x2C3c320D49019D4f9A92352e947c7e5AcFE47D68",
    learnMoreLink:
      "https://app.uniswap.org/explore/pools/bnb/0x2C3c320D49019D4f9A92352e947c7e5AcFE47D68",
    tokens: [USDC],
    chainId: bsc.id,
  },
  {
    title: "Uniswap Liquidity",
    apy: 0.32,
    risk: {
      level: "High" as const,
      color: "",
      bgColor: "",
    },
    protocol: "Uniswap",
    description:
      "Adding USDC and USDT to the Uniswap v3 USDC/USDT 0.01% pool enables users to earn swap fees by providing liquidity for trading between these stablecoins.",
    image: "/crypto-icons/arb.svg",
    externalLink:
      "https://app.uniswap.org/explore/pools/arbitrum/0xbE3aD6a5669Dc0B8b12FeBC03608860C31E2eef6",
    learnMoreLink:
      "https://app.uniswap.org/explore/pools/arbitrum/0xbE3aD6a5669Dc0B8b12FeBC03608860C31E2eef6",
    tokens: [USDC],
    chainId: arbitrum.id,
  },
  {
    title: "Liquid Staking",
    apy: 2.8,
    risk: {
      level: "High" as const,
      color: "",
      bgColor: "",
    },
    protocol: "LST",
    description:
      "Staking tokens to operate network nodes helps to maintain security on the blockchain.",
    image: "/crypto-icons/base.png",
    externalLink: "https://lido.fi/",
    learnMoreLink: "https://lido.fi/",
    tokens: [ETH],
    chainId: base.id,
  },
  {
    title: "Liquid Staking",
    apy: 2.8,
    risk: {
      level: "High" as const,
      color: "",
      bgColor: "",
    },
    protocol: "LST",
    description:
      "Staking tokens to operate network nodes helps to maintain security on the blockchain.",
    image: "/crypto-icons/arb.svg",
    externalLink: "https://lido.fi/",
    learnMoreLink: "https://lido.fi/",
    tokens: [ETH],
    chainId: arbitrum.id,
  },
  {
    title: "Binance Liquid Staking",
    apy: 2.8,
    risk: {
      level: "High" as const,
      color: "",
      bgColor: "",
    },
    protocol: "BSC LST",
    description:
      "Staking tokens to operate network nodes helps to maintain security on the blockchain.",
    image: "/crypto-icons/bnb.svg",
    externalLink: "https://lido.fi/",
    learnMoreLink: "https://lido.fi/",
    tokens: [BNB],
    chainId: bsc.id,
  },
  {
    title: "stCelo",
    apy: 2.8,
    risk: {
      level: "Low" as const,
      color: "#E83033",
      bgColor: "rgba(232, 48, 51, 0.3)",
    },
    protocol: "stCelo",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/crypto-icons/celo.svg",
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
    image: "/crypto-icons/flow.svg",
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
    image: "/crypto-icons/flow.svg",
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
    image: "/crypto-icons/flow.svg",
    externalLink: "https://flow.com",
    learnMoreLink: "https://flow.com",
    tokens: [FLOW],
    chainId: flowMainnet.id,
  },
];
