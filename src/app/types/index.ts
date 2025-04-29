// Message type definition for the chatbot

export type MessageStrategy = Record<string, number>;
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type: "Text" | "Invest" | "Portfolio" | "ChangePercentage" | "Edit";
}
