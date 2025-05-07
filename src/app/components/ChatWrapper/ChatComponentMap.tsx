import { MessageType } from "@/app/types";
import { FC } from "react";

import {
  PortfolioChatWrapper,
  EditChatWrapper,
  ReviewPortfolioChatWrapper,
  BuildPortfolioChatWrapper,
  FindDefiStrategiesChatWrapper,
  DefiStrategiesCardsChatWrapper,
  InvestmentFormChatWrapper,
  DepositChatWrapper,
} from "@/app/components/ChatWrapper";

// 定義組件映射的類型
type ComponentMap = {
  [key in MessageType]?: FC<any>;
};

// 建立消息類型到組件的映射
export const chatComponentMap: ComponentMap = {
  Invest: InvestmentFormChatWrapper,
  Portfolio: PortfolioChatWrapper,
  Edit: EditChatWrapper,
  "Review Portfolio": ReviewPortfolioChatWrapper,
  "Build Portfolio": BuildPortfolioChatWrapper,
  "Deposit Funds": DepositChatWrapper,
  "Find Defi Strategies": FindDefiStrategiesChatWrapper,
  "DeFi Strategies Cards": DefiStrategiesCardsChatWrapper,
};

// 使用此映射的函數
export const getComponentByMessageType = (type: MessageType) => {
  return chatComponentMap[type] || null;
};
