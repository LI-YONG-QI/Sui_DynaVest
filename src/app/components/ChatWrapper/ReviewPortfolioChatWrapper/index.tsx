import React from "react";

import type { Message, MessageType } from "@/app/types";
import type { RiskPortfolioStrategies } from "@/app/utils/types";

import RiskPortfolio from "../../RiskPortfolio";

interface ReviewPortfolioChatWrapperProps {
  messageStrategies: RiskPortfolioStrategies[];
  nextStep: (userInput: string, getNextMessage: () => Message) => void;
  createDefaultMessage: (type: MessageType) => () => Message;
}

const ReviewPortfolioChatWrapper: React.FC<ReviewPortfolioChatWrapperProps> = ({
  messageStrategies,
  nextStep,
  createDefaultMessage,
}) => {
  return (
    <div className="mt-4 overflow-x-auto max-w-full w-full flex justify-center">
      <div className="w-full min-w-[600px] md:max-w-none">
        <RiskPortfolio
          buildPortfolio={() =>
            nextStep("Build portfolio", createDefaultMessage("Build Portfolio"))
          }
          changePercent={() =>
            nextStep("Change percentage", createDefaultMessage("Edit"))
          }
          riskPortfolioStrategies={messageStrategies}
        />
      </div>
    </div>
  );
};

export default ReviewPortfolioChatWrapper;
