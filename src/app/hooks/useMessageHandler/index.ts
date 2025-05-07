import { Message, MessagePortfolioData, MessageType } from "@/app/types";
import {
  BotResponse,
  RiskLevel,
  RiskPortfolioStrategies,
} from "@/app/utils/types";
import { BOT_DEFAULT_RESPONSE_MAP } from "@/app/utils/constants/bot";

type MessageHandlerConfig = {
  riskLevel: RiskLevel;
  strategies: RiskPortfolioStrategies[];
  chains: number[];
  depositAmount: string;
  chainsName: string;
  hasEnoughBalance: boolean;
};

// 定義一個消息類型映射
type MessageTypeHandlers = {
  [K in MessageType]?: {
    text: string;
    data?: MessagePortfolioData;
    modifyType?: (config: MessageHandlerConfig) => MessageType;
  };
};

function assertData<T>(
  data: T | null | undefined,
  message: string
): asserts data is T {
  if (data == null) {
    throw new Error(message);
  }
}

// Start of Selection
export const useMessageHandler = (config: MessageHandlerConfig) => {
  // Define the logic for handling all message types
  const messageTypeHandlers: MessageTypeHandlers = {
    Invest: {
      text: "What's your investment size (Base by default)?",
      data: {
        risk: config.riskLevel,
        strategies: config.strategies,
      },
    },
    Edit: {
      text: "What's your Risk/Yield and Airdrop portfolio preference?",
      data: {
        risk: config.riskLevel,
        strategies: config.strategies,
      },
    },
    "DeFi Strategies Cards": {
      text: `Here're some ${config.riskLevel} risk DeFi yield strategies from reputable and secured platform on ${config.chainsName}`,
      data: {
        risk: config.riskLevel,
        strategies: config.strategies,
      },
    },
    "Review Portfolio": {
      text: "Here's your portfolio",
      data: {
        risk: config.riskLevel,
        strategies: config.strategies,
      },
    },
    "Build Portfolio": {
      text: config.hasEnoughBalance
        ? "Start building portfolio..."
        : "Oops, you have insufficient balance in your wallet. You can deposit or change amount.",
      data: {
        risk: config.riskLevel,
        strategies: config.strategies,
      },
      modifyType: () =>
        config.hasEnoughBalance ? "Build Portfolio" : "Deposit Funds",
    },
    "Find Defi Strategies": {
      text: "We will diversify your token into reputable and secured yield protocols based on your preference.",
      data: {
        risk: config.riskLevel,
        strategies: config.strategies,
      },
    },
  };

  // Handle bot response to create a message
  const createBotMessage = (botResponse: BotResponse): Message => {
    let data: MessagePortfolioData | undefined;
    const baseConfig = BOT_DEFAULT_RESPONSE_MAP[botResponse.type];
    let text = baseConfig.text;
    const type = baseConfig.type;

    // Handle special message types
    switch (botResponse.type) {
      case "question":
        assertData(
          botResponse.data,
          `CreateBotMessage: Not found data from bot response ${botResponse}`
        );
        text = botResponse.data.answer;
        break;
      case "strategies":
        assertData(
          botResponse.data,
          `CreateBotMessage: Not found data from bot response ${botResponse}`
        );
        // Data does not need to be set for this type, riskLevel and chains are set externally
        break;
      case "build_portfolio":
        data = {
          risk: config.riskLevel,
          strategies: config.strategies,
        };
        break;
    }

    return {
      id: (Date.now() + 1).toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      type,
      data,
    };
  };

  // Create a default message
  const createDefaultMessage = (type: MessageType): (() => Message) => {
    return () => {
      let messageType = type;
      let text = "";
      let data: MessagePortfolioData | undefined;

      // Find the type handler
      const handler = messageTypeHandlers[type];

      if (handler) {
        text = handler.text;

        if (handler.data) {
          data = handler.data;
        }

        if (handler.modifyType) {
          messageType = handler.modifyType(config);
        }
      }

      return {
        id: (Date.now() + 1).toString(),
        text,
        sender: "bot",
        timestamp: new Date(),
        type: messageType,
        data,
      };
    };
  };

  return {
    createBotMessage,
    createDefaultMessage,
  };
};
