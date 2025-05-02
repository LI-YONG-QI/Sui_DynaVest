// Message type definition for the chatbot

import { RiskLevel, RiskPortfolioStrategies } from "../utils/types";

export type MessageStrategy = Record<string, number>;

export type MessageType =
  | "Text"
  | "Invest"
  | "Portfolio"
  | "Edit"
  | "Review Portfolio"
  | "Build Portfolio";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type: MessageType;
  data?: MessagePortfolioData;
}

export interface MessagePortfolioData {
  risk: RiskLevel;
  strategies: RiskPortfolioStrategies[];
}
