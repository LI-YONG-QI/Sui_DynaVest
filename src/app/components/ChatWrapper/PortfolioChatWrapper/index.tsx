import React, { Dispatch, SetStateAction } from "react";

import { RiskLevel, RiskPortfolioStrategies } from "@/app/utils/types";
import { RiskBadgeList } from "../../RiskBadgeList";
import { RISK_OPTIONS } from "@/app/utils/constants/risk";
import { getRiskDescription } from "../../RiskPortfolio";
import RiskPortfolio from "../../RiskPortfolio";

import type { Message, MessageType } from "@/app/types";

interface PortfolioDisplayProps {
  messageRisk: RiskLevel;
  isEditable: boolean;
  setSelectedRiskLevel: Dispatch<SetStateAction<RiskLevel>>;
  messageStrategies: RiskPortfolioStrategies[];
  nextStep: (userInput: string, getNextMessage: () => Message) => void;
  createDefaultMessage: (type: MessageType) => () => Message;
}

const PortfolioChatWrapper: React.FC<PortfolioDisplayProps> = ({
  messageRisk,
  isEditable,
  setSelectedRiskLevel,
  messageStrategies,
  nextStep,
  createDefaultMessage,
}) => {
  return (
    <div className="mt-4 overflow-x-auto max-w-full w-full flex justify-center">
      <div className="w-full max-w-[320px] md:max-w-none">
        <div className="flex flex-col gap-3">
          <div className="rounded-[0px_10px_10px_10px] p-4 flex flex-col gap-6">
            {/* Risk preference selection */}
            <RiskBadgeList
              selectedRisk={messageRisk}
              isEditable={isEditable}
              setSelectedRiskLevel={setSelectedRiskLevel}
              options={RISK_OPTIONS}
            />

            <div className="flex items-center">
              <p className="text-gray text-xs md:text-sm font-normal px-1">
                {getRiskDescription(messageRisk)}
              </p>
            </div>
          </div>
        </div>

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

export default PortfolioChatWrapper;
