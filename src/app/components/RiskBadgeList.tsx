import { RISK_OPTIONS } from "../utils/constants/risk";
import { RiskBadge } from "./RiskPortfolio";
import { RiskLevel } from "../utils/types";
import { Dispatch, SetStateAction } from "react";

interface RiskBadgeListProps {
  selectedRisk: RiskLevel;
  isEditable: boolean;
  setSelectedRiskLevel: Dispatch<SetStateAction<RiskLevel>>;
}

export const RiskBadgeList = ({
  selectedRisk,
  isEditable,
  setSelectedRiskLevel,
}: RiskBadgeListProps) => {
  return (
    <div className="flex flex-wrap gap-[18px] items-center md:justify-start">
      {RISK_OPTIONS.map((risk) => (
        <RiskBadge
          key={risk}
          label={risk}
          isSelected={risk === selectedRisk}
          isEditable={isEditable}
          setSelectedRiskLevel={setSelectedRiskLevel}
        />
      ))}
    </div>
  );
};
