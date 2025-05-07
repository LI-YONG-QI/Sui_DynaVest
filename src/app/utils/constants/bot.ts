import { MessageType } from "@/app/types";
import { BotResponseType } from "@/app/utils/types";

export const BOT_DEFAULT_RESPONSE_MAP: Record<
  BotResponseType,
  {
    type: MessageType;
    text: string;
  }
> = {
  strategies: {
    type: "Find Defi Strategies",
    text: "We will diversify your token into reputable and secured yield protocols based on your preference.\nWhat's your investment size (Base by default)? ",
  },
  analyze_portfolio: {
    type: "Portfolio",
    text: "What's your Risk/Yield and Airdrop portfolio preference?",
  },
  question: {
    type: "Text",
    text: "",
  },
  build_portfolio: {
    type: "Invest",
    text: "Start building portfolio...",
  },
};
