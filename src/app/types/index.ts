// Message type definition for the chatbot

import { InvestStrategy } from "../utils/types";

export type MessageStrategy = Record<string, number>;
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  strategy?: InvestStrategy;
}
