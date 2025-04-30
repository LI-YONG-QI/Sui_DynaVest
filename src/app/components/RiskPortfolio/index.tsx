"use client";

import React, { useState, useMemo } from "react";

import { PortfolioPieChart } from "./PieChart";
import type { StrategyMetadata } from "@/app/utils/types";
import { createPieChartStrategies } from "@/app/utils/pie";

const RISK_OPTIONS = [
  "Balanced Risk",
  "Low Risk",
  "Medium Risk",
  "High Risk",
  "High Airdrop Potential",
] as const;

export type RiskLevel = (typeof RISK_OPTIONS)[number];

export type RiskPortfolioStrategies = StrategyMetadata & {
  allocation: number;
};

interface RiskPortfolioProps {
  changePercentage: () => void;
  strategiesSet?: Record<RiskLevel, RiskPortfolioStrategies[]>;
}

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
  strategiesSet,
}: RiskPortfolioProps) => {
  // State for selected risk preference
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>("Balanced Risk");

  const filteredStrategies = useMemo(() => {
    return strategiesSet?.[selectedRisk] || [];
  }, [selectedRisk, strategiesSet]);

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
            pieStrategies={createPieChartStrategies(filteredStrategies)}
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
