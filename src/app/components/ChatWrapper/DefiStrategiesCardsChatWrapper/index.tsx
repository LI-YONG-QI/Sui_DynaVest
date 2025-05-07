import React from "react";

import type { RiskLevel } from "@/app/utils/types";
import StrategyListChatWrapper from "../StrategyListChatWrapper";

interface DefiStrategiesCardsChatWrapperProps {
  selectedChains: number[];
  selectedRiskLevel: RiskLevel;
}

const DefiStrategiesCardsChatWrapper: React.FC<
  DefiStrategiesCardsChatWrapperProps
> = ({ selectedChains, selectedRiskLevel }) => {
  return (
    <StrategyListChatWrapper
      selectedChains={selectedChains}
      selectedRiskLevel={selectedRiskLevel}
    />
  );
};

export default DefiStrategiesCardsChatWrapper;
