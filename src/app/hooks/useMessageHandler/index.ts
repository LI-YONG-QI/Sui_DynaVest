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
    getText: (config: MessageHandlerConfig) => string;
    getData?: (
      config: MessageHandlerConfig
    ) => MessagePortfolioData | undefined;
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

export const useMessageHandler = () => {
  // 定義所有消息類型的處理邏輯
  const messageTypeHandlers: MessageTypeHandlers = {
    Invest: {
      getText: () => "What's your investment size (Base by default)?",
      getData: (config) => ({
        risk: config.riskLevel,
        strategies: config.strategies,
      }),
    },
    Edit: {
      getText: () => "What's your Risk/Yield and Airdrop portfolio preference?",
      getData: (config) => ({
        risk: config.riskLevel,
        strategies: config.strategies,
      }),
    },
    "DeFi Strategies Cards": {
      getText: (config) =>
        `Here're some ${config.riskLevel} risk DeFi yield strategies from reputable and secured platform on ${config.chainsName}`,
      getData: (config) => ({
        risk: config.riskLevel,
        strategies: config.strategies,
      }),
    },
    "Review Portfolio": {
      getText: () => "Here's your portfolio",
      getData: (config) => ({
        risk: config.riskLevel,
        strategies: config.strategies,
      }),
    },
    "Build Portfolio": {
      getText: (config) =>
        config.hasEnoughBalance
          ? "Start building portfolio..."
          : "Oops, you have insufficient balance in your wallet. You can deposit or change amount.",
      getData: (config) => ({
        risk: config.riskLevel,
        strategies: config.strategies,
      }),
      modifyType: (config) =>
        config.hasEnoughBalance ? "Build Portfolio" : "Deposit Funds",
    },
    "Find Defi Strategies": {
      getText: () =>
        "We will diversify your token into reputable and secured yield protocols based on your preference.",
      getData: (config) => ({
        risk: config.riskLevel,
        strategies: config.strategies,
      }),
    },
  };

  // 處理機器人響應創建消息
  const createBotMessage = (
    botResponse: BotResponse,
    config: MessageHandlerConfig
  ): Message => {
    let data: MessagePortfolioData | undefined;
    const baseConfig = BOT_DEFAULT_RESPONSE_MAP[botResponse.type];
    let text = baseConfig.text;
    const type = baseConfig.type;

    // 處理特殊消息類型
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
        // data 在這種類型中不需要設置，由外部設置 riskLevel 和 chains
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

  // 創建預設消息
  const createDefaultMessage = (
    type: MessageType,
    config: MessageHandlerConfig
  ): (() => Message) => {
    return () => {
      let messageType = type;
      let text = "";
      let data: MessagePortfolioData | undefined;

      // 查找類型處理器
      const handler = messageTypeHandlers[type];

      if (handler) {
        text = handler.getText(config);

        if (handler.getData) {
          data = handler.getData(config);
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
