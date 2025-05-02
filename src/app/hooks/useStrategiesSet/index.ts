import { useEffect, useState } from "react";

import type {
  RiskLevel,
  StrategiesSet,
  RiskPortfolioStrategies,
} from "@/app/utils/types";

export const useStrategiesSet = (initialStrategiesSet: StrategiesSet) => {
  const [strategiesSet, setStrategiesSet] =
    useState<StrategiesSet>(initialStrategiesSet);
  const [selectedRiskLevel, setSelectedRiskLevel] =
    useState<RiskLevel>("Balanced Risk");
  const [selectedStrategies, setSelectedStrategies] = useState<
    RiskPortfolioStrategies[]
  >(strategiesSet[selectedRiskLevel]);

  useEffect(() => {
    setSelectedStrategies(strategiesSet[selectedRiskLevel]);
  }, [selectedRiskLevel, strategiesSet]);

  return {
    strategiesSet,
    setStrategiesSet,
    selectedRiskLevel,
    setSelectedRiskLevel,
    selectedStrategies,
    setSelectedStrategies,
  };
};
