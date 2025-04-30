"use client";

import React, { useState, useMemo } from "react";

import { PortfolioPieChart } from "./PieChart";
import type { StrategyMetadata } from "@/app/utils/types";
import { STRATEGIES_METADATA } from "@/app/utils/constants/strategies";
import { createPieChartStrategies } from "@/app/utils/pie";

interface RiskPortfolioProps {
  changePercentage: () => void;
  strategiesMetadata?: StrategyMetadata[];
}

const RISK_OPTIONS = [
  "Balanced Risk",
  "Low Risk",
  "Medium Risk",
  "High Risk",
  "High Airdrop Potential",
];

// Component for risk preference badges
const RiskBadge = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`rounded-lg px-3 py-3 cursor-pointer ${
        isSelected
          ? "bg-[#5F79F1] text-white"
          : "border border-[#5F79F1] text-[#5F79F1]"
      }`}
      onClick={onClick}
    >
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

// Portfolio legend item component

const RiskPortfolio = ({
  changePercentage,
  strategiesMetadata = STRATEGIES_METADATA,
}: RiskPortfolioProps) => {
  // State for selected risk preference
  const [selectedRisk, setSelectedRisk] = useState("Balanced Risk");

  // TODO: filter function need to be refactored, and length of strategies and allocations matched
  // Filter strategies based on selected risk
  const filteredStrategies = useMemo(() => {
    let riskLevel: "Low" | "Medium" | "High" | null = null;

    // Map selected risk to risk level
    switch (selectedRisk) {
      case "Low Risk":
        riskLevel = "Low";
        break;
      case "Medium Risk":
        riskLevel = "Medium";
        break;
      case "High Risk":
        riskLevel = "High";
        break;
      case "Balanced Risk":
        // For balanced risk, we'll get mix of strategies
        return strategiesMetadata.slice(0, 5);
      case "High Airdrop Potential":
        // For airdrop potential, we could select specific strategies
        // This is a placeholder - you might want to tag which strategies have airdrop potential
        return strategiesMetadata
          .filter((_, index) => index % 3 === 0)
          .slice(0, 5);
      default:
        return strategiesMetadata.slice(0, 5);
    }

    // If specific risk level selected, filter by that level
    if (riskLevel) {
      const filtered = strategiesMetadata.filter(
        (strategy) => strategy.risk.level === riskLevel
      );
      // Return at least 5 strategies or pad with others if needed
      return filtered.length >= 5
        ? filtered.slice(0, 5)
        : [
            ...filtered,
            ...strategiesMetadata
              .filter((strategy) => strategy.risk.level !== riskLevel)
              .slice(0, 5 - filtered.length),
          ];
    }

    return strategiesMetadata.slice(0, 5);
  }, [selectedRisk, strategiesMetadata]);

  // Create mock allocations based on selected risk
  const allocations = useMemo(() => {
    switch (selectedRisk) {
      case "Low Risk":
        // Conservative allocation - more weight on low-risk strategies
        return [30, 25, 20, 15, 10];
      case "Medium Risk":
        // Balanced allocation
        return [20, 25, 30, 15, 10];
      case "High Risk":
        // Aggressive allocation - more weight on high-risk strategies
        return [10, 15, 20, 25, 30];
      case "High Airdrop Potential":
        // Focus on potential airdrop strategies
        return [80, 20];
      case "Balanced Risk":
      default:
        // Equal allocation
        return [20, 20, 20, 20, 20];
    }
  }, [selectedRisk]);

  // Description text based on selected risk
  const getRiskDescription = () => {
    switch (selectedRisk) {
      case "Low Risk":
        return "This portfolio focuses on lower-risk yield protocols prioritizing capital preservation.";
      case "Medium Risk":
        return "This portfolio balances moderate risk with potentially higher returns.";
      case "High Risk":
        return "This portfolio focuses on high-risk, high-reward yield protocols.";
      case "High Airdrop Potential":
        return "This portfolio prioritizes protocols with potential future token airdrops.";
      default:
        return "This portfolio will diversify equally in yield protocols of three risk levels.";
    }
  };

  return (
    <div className="my-4 flex flex-col gap-6 w-full max-w-[805px]">
      {/* System message with risk preferences */}
      <div className="flex flex-col gap-3">
        <div className="rounded-[0px_10px_10px_10px] p-ˋ flex flex-col gap-6">
          {/* Risk preference selection */}
          <div className="flex flex-wrap gap-[18px] items-center md:justify-start">
            {RISK_OPTIONS.map((risk) => (
              <RiskBadge
                key={risk}
                label={risk}
                isSelected={selectedRisk === risk}
                onClick={() => setSelectedRisk(risk)}
              />
            ))}
          </div>

          <div className="flex items-center">
            <p className="text-gray text-xs md:text-sm font-normal px-1">
              {getRiskDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio visualization */}
      <div className="flex items-center w-full px-[10px] gap-[10px]">
        {/* Pie chart */}
        <div className="w-full">
          <PortfolioPieChart
            pieStrategies={createPieChartStrategies(
              filteredStrategies,
              allocations
            )}
          />
        </div>

        {/* Legends */}
      </div>

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-5 md:flex-row">
        <button className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 19L16 12L9 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-semibold">
            Start Building Portfolio
          </span>
        </button>

        <button
          className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5"
          onClick={changePercentage}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 12H8M12 16V8M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-semibold">Change Percentage</span>
        </button>
      </div>
    </div>
  );
};

export default RiskPortfolio;
