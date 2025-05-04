import { useEffect, useState } from "react";

import type {
  RiskLevel,
  StrategiesSet,
  RiskPortfolioStrategies,
} from "@/app/utils/types";
import { arbitrum } from "viem/chains";

export const useStrategiesSet = (initialStrategiesSet: StrategiesSet) => {
  const [strategiesSet, setStrategiesSet] =
    useState<StrategiesSet>(initialStrategiesSet);
  const [selectedRiskLevel, setSelectedRiskLevel] =
    useState<RiskLevel>("Balanced Risk");
  const [selectedStrategies, setSelectedStrategies] = useState<
    RiskPortfolioStrategies[]
  >(strategiesSet[selectedRiskLevel]);
  const [selectedChains, setSelectedChains] = useState<number[]>([arbitrum.id]);

  useEffect(() => {
    setSelectedStrategies(strategiesSet[selectedRiskLevel]);
  }, [selectedRiskLevel, strategiesSet]);

  return {
    strategiesSet,
    selectedChains,
    setSelectedChains,
    setStrategiesSet,
    selectedRiskLevel,
    setSelectedRiskLevel,
    selectedStrategies,
    setSelectedStrategies,
  };
};
