import React, { useState } from "react";
import type { RiskPortfolioStrategies } from "@/app/utils/types";
import type { Message } from "@/app/types";

export type ChangePercentStrategy = {
  name: string;
  percentage: number;
};

type ChangePercentListProps = {
  riskPortfolioStrategies: RiskPortfolioStrategies[];
  setRiskPortfolioStrategies: (strategies: RiskPortfolioStrategies[]) => void;
  message: Message;
  settleMessage: (message: Message) => void;
  handleReview: () => void;
};

const createChangePercentStrategy = (
  strategies: RiskPortfolioStrategies[]
): ChangePercentStrategy[] => {
  return strategies.map((strategy) => ({
    name: strategy.title,
    percentage: strategy.allocation,
  }));
};

const ChangePercentList = ({
  riskPortfolioStrategies,
  setRiskPortfolioStrategies,
  message,
  settleMessage,
  handleReview,
}: ChangePercentListProps) => {
  const [strategies, setStrategies] = useState(
    createChangePercentStrategy(riskPortfolioStrategies)
  );

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!message.isActive) return;

    if (!/^\d*$/.test(value)) return;

    // Convert to number and limit to 0-100
    const numValue = value === "" ? 0 : Math.min(100, parseInt(value));

    // Update the specific strategy's percentage
    const updatedStrategies = [...strategies];
    updatedStrategies[index] = {
      ...updatedStrategies[index],
      percentage: numValue,
    };

    setStrategies(updatedStrategies);

    // Update parent component's strategy state
    const updatedRiskStrategies = [...riskPortfolioStrategies];
    updatedRiskStrategies[index] = {
      ...updatedRiskStrategies[index],
      allocation: numValue,
    };

    setRiskPortfolioStrategies(updatedRiskStrategies);
  };

  return (
    <div className="w-full flex flex-col items-start gap-7">
      <div className="flex flex-col w-full gap-2">
        {strategies.map((strategy, index) => (
          <React.Fragment key={index}>
            <div className="flex justify-between items-center w-full p-1 gap-5">
              <span className="text-[rgba(0,0,0,0.7)] font-[Manrope] font-medium text-sm">
                {strategy.name}
              </span>

              <input
                className="bg-white text-center border border-[#CBD5E1] rounded-md py-1.5 px-4.5 w-[72px] text-[#17181C] font-[Inter] text-sm"
                value={strategy.percentage}
                onChange={(e) => handleInputChange(index, e.target.value)}
                type="text"
                inputMode="numeric"
              />
            </div>
            {index < strategies.length - 1 && (
              <div className="w-full h-[1px] bg-[#CAC4D0]"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={() => {
          settleMessage(message);
          handleReview();
        }}
        className="bg-[#5F79F1] text-white font-[Manrope] font-semibold text-sm rounded-lg py-3.5 px-5 flex gap-2.5"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Review Percentage
      </button>
    </div>
  );
};

export default ChangePercentList;
