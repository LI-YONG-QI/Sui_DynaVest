import React, { Dispatch, SetStateAction } from "react";

import { RiskLevel } from "@/app/utils/types";
import ChainFilter from "../../StrategyList/ChainFilter";
import { RiskBadgeList } from "../../RiskBadgeList";
import { RISK_OPTIONS } from "@/app/utils/constants/risk";
import { MoveUpRight } from "lucide-react";
import Button from "../../Button";
import { Message, MessageType } from "@/app/types";

interface FindDefiStrategiesChatWrapperProps {
  selectedChains: number[];
  setSelectedChains: Dispatch<SetStateAction<number[]>>;
  selectedRiskLevel: RiskLevel;
  setSelectedRiskLevel: Dispatch<SetStateAction<RiskLevel>>;
  isEditable: boolean;
  nextStep: (userInput: string, getNextMessage: () => Message) => void;
  createDefaultMessage: (type: MessageType) => () => Message;
  chainsName: string;
}

const FindDefiStrategiesChatWrapper: React.FC<
  FindDefiStrategiesChatWrapperProps
> = ({
  selectedChains,
  setSelectedChains,
  selectedRiskLevel,
  setSelectedRiskLevel,
  isEditable,
  nextStep,
  createDefaultMessage,
  chainsName,
}) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="font-[Manrope] font-medium text-sm">Select Chains</p>
        <ChainFilter
          selectedChains={selectedChains}
          setSelectedChains={setSelectedChains}
        />
      </div>
      <div className="flex items-center gap-2">
        <p className="font-[Manrope] font-medium text-sm">Select Risk</p>
        <RiskBadgeList
          selectedRisk={selectedRiskLevel}
          setSelectedRiskLevel={setSelectedRiskLevel}
          options={RISK_OPTIONS.filter(
            (option) =>
              option !== "balanced" && option !== "High Airdrop Potential"
          )}
          isEditable={isEditable}
        />
      </div>
      <Button
        onClick={() =>
          nextStep(
            `Find ${selectedRiskLevel} risk DeFi strategies on ${chainsName}`,
            createDefaultMessage("DeFi Strategies Cards")
          )
        }
        text="Find DeFi Strategies"
        icon={<MoveUpRight />}
      />
    </div>
  );
};

export default FindDefiStrategiesChatWrapper;
