import { useEffect, useState } from "react";
import { arbitrum } from "viem/chains";

import type {
  RiskLevel,
  StrategiesSet,
  RiskPortfolioStrategies,
} from "@/app/utils/types";

export const usePortfolio = (initialStrategiesSet: StrategiesSet) => {
  const [strategiesSet, setStrategiesSet] =
    useState<StrategiesSet>(initialStrategiesSet);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [strategies, setStrategies] = useState<RiskPortfolioStrategies[]>(
    strategiesSet[riskLevel]
  );
  const [chains, setChains] = useState<number[]>([arbitrum.id]);

  useEffect(() => {
    setStrategies(strategiesSet[riskLevel]);
  }, [riskLevel, strategiesSet]);

  return {
    strategiesSet,
    chains,
    setChains,
    setStrategiesSet,
    riskLevel,
    setRiskLevel,
    strategies,
    setStrategies,
  };
};
