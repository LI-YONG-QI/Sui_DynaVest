import type { TypedData, Address } from "viem";
import { RISK_OPTIONS } from "./constants/risk";
import { Message } from "../types";

export const PERMIT_TYPES = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const satisfies TypedData;

export type Protocol =
  | "1inch"
  | "AAVE"
  | "stCelo"
  | "ankrFlow"
  | "Kitty"
  | "Flow"
  | "Morpho"
  | "Uniswap"
  | "BSC Aave"
  | "LST"
  | "BSC LST"
  | "Camelot"
  | "GMX"
  | "Bot Strategy";

export type StrategyMetadata = InvestStrategy & {
  displayInsufficientBalance?: boolean;
};

export type InvestStrategy = {
  title: string;
  apy: number;
  risk: {
    level: RiskLevel;
    color: string;
    bgColor: string;
  };
  protocol: Protocol;
  description: string;
  /** @deprecated This field is no longer in use */
  image: string;
  externalLink?: string;
  learnMoreLink?: string;
  chainId: number;
  tokens: Token[];
};

export type Token = {
  name: string;
  icon: string;
  decimals: number;
  isNativeToken: boolean;
  chains?: {
    [key: number]: Address;
  };
};

export type Chain = {
  name: string;
  id: number;
  icon: string;
};

export type PieStrategy = {
  id: number;
  color: string;
  name: string;
  apy: string;
  risk: string;
  allocation: number;
};

export type RiskLevel = (typeof RISK_OPTIONS)[number];

export type RiskPortfolioStrategies = StrategyMetadata & {
  allocation: number;
};

export type StrategiesSet = Record<RiskLevel, RiskPortfolioStrategies[]>;

export type DepositAction = "Deposit" | "Change Amount";

export type NextStepFn = (
  userInput: string,
  getNextMessage: () => Message
) => void;

export type BotResponse = {
  type: BotResponseType;
  data: BotResponseData;
};

export type BotResponseType =
  | "strategies"
  | "question"
  | "build_portfolio"
  | "analyze_portfolio";

export type BotResponseData = {
  risk_level: RiskLevel;
  chain: number;
} & {
  answer: string;
};
