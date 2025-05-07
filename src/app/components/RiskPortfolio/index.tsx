"use client";

import React from "react";

import { PortfolioPieChart } from "./PieChart";
import type { RiskPortfolioStrategies, RiskLevel } from "@/app/utils/types";
import { createPieChartStrategies } from "@/app/utils/pie";

interface RiskPortfolioProps {
  buildPortfolio: () => void;
  changePercent: () => void;
  riskPortfolioStrategies: RiskPortfolioStrategies[];
}

export const RiskBadge = ({
  label,
  isSelected,
  setSelectedRiskLevel,
  isEditable,
}: {
  label: string;
  isSelected: boolean;
  setSelectedRiskLevel: (risk: RiskLevel) => void;
  isEditable: boolean;
}) => {
  const handleClick = () => {
    if (isEditable) setSelectedRiskLevel(label as RiskLevel);
  };

  return (
    <div
      className={`rounded-lg px-3 py-3 cursor-pointer ${
        isSelected
          ? "bg-[#5F79F1] text-white"
          : "border border-[#5F79F1] text-[#5F79F1]"
      }`}
      onClick={handleClick}
    >
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const getRiskDescription = (selectedRisk: RiskLevel) => {
  switch (selectedRisk) {
    case "low":
      return "This portfolio focuses on lower-risk yield protocols prioritizing capital preservation.";
    case "medium":
      return "This portfolio balances moderate risk with potentially higher returns.";
    case "high":
      return "This portfolio focuses on high-risk, high-reward yield protocols.";
    // case "High Airdrop Potential":
    //   return "This portfolio prioritizes protocols with potential future token airdrops.";
    default:
      return "This portfolio will diversify equally in yield protocols of three risk levels.";
  }
};

// Portfolio legend item component

const RiskPortfolio = ({
  buildPortfolio,
  changePercent,
  riskPortfolioStrategies,
}: RiskPortfolioProps) => {
  return (
    <div className="my-4 flex flex-col gap-6 w-full max-w-[805px]">
      {/* Portfolio visualization */}
      <div className="flex items-center w-full px-[10px] gap-[10px]">
        {/* Pie chart */}
        <div className="w-full">
          <PortfolioPieChart
            pieStrategies={createPieChartStrategies(riskPortfolioStrategies)}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-5 md:flex-row">
        <button
          onClick={buildPortfolio}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5"
        >
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
          onClick={changePercent}
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
