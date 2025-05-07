import { useEffect, useState } from "react";

import type {
  RiskLevel,
  StrategiesSet,
  RiskPortfolioStrategies,
} from "@/app/utils/types";
import { arbitrum } from "viem/chains";

export const usePortfolio = (initialStrategiesSet: StrategiesSet) => {
  const [strategiesSet, setStrategiesSet] =
    useState<StrategiesSet>(initialStrategiesSet);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("Balanced");
  const [strategies, setStrategies] = useState<RiskPortfolioStrategies[]>(
    strategiesSet[riskLevel]
  );
  const [selectedChains, setSelectedChains] = useState<number[]>([arbitrum.id]);

  useEffect(() => {
    setStrategies(strategiesSet[riskLevel]);
  }, [riskLevel, strategiesSet]);

  return {
    strategiesSet,
    selectedChains,
    setSelectedChains,
    setStrategiesSet,
    riskLevel,
    setRiskLevel,
    strategies,
    setStrategies,
  };
};
