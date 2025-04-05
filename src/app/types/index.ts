// Message type definition for the chatbot
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}
