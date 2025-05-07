import React, { Dispatch, SetStateAction } from "react";

import type { Message, MessageType } from "@/app/types";
import type { RiskPortfolioStrategies } from "@/app/utils/types";

import ChangePercentList from "../../ChangePercentList";

interface EditChatWrapperProps {
  strategies: RiskPortfolioStrategies[];
  isEditable: boolean;
  setStrategies: Dispatch<SetStateAction<RiskPortfolioStrategies[]>>;
  nextStep: (userInput: string, getNextMessage: () => Message) => void;
  createDefaultMessage: (type: MessageType) => () => Message;
}

const EditChatWrapper: React.FC<EditChatWrapperProps> = ({
  strategies,
  isEditable,
  setStrategies,
  nextStep,
  createDefaultMessage,
}) => {
  return (
    <div className="overflow-x-auto max-w-full">
      <ChangePercentList
        riskPortfolioStrategies={strategies}
        setRiskPortfolioStrategies={setStrategies}
        isEditable={isEditable}
        nextStep={() => nextStep("", createDefaultMessage("Review Portfolio"))}
      />
    </div>
  );
};

export default EditChatWrapper;
