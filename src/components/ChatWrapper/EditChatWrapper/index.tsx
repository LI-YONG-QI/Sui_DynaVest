import React, { useState } from "react";

import type { RiskPortfolioStrategies } from "@/types";

import ChangePercentList from "../../ChangePercentList";
import { EditMessage } from "@/classes/message";
import { Message } from "@/classes/message";

interface EditChatWrapperProps {
  message: EditMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const EditChatWrapper: React.FC<EditChatWrapperProps> = ({
  message,
  addBotMessage,
}) => {
  const [strategies, setStrategies] = useState<RiskPortfolioStrategies[]>(
    message.strategies
  );

  const nextMessage = async () => {
    // Settle message attributes
    message.strategies = strategies;
    await addBotMessage(message.next());
  };

  return (
    <div className="overflow-x-auto max-w-full">
      <ChangePercentList
        riskPortfolioStrategies={strategies}
        setRiskPortfolioStrategies={setStrategies}
        isEditable={true} // TODO: mock true
        nextStep={nextMessage}
      />
    </div>
  );
};

export default EditChatWrapper;
