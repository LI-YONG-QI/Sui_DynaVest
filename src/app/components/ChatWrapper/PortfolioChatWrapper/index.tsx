import React, { useEffect, useState } from "react";

import { RiskLevel, RiskPortfolioStrategies } from "@/app/utils/types";
import { RiskBadgeList } from "../../RiskBadgeList";
import { RISK_OPTIONS } from "@/app/utils/constants/risk";
import { getRiskDescription } from "../../RiskPortfolio";

import type { Message } from "@/app/classes/message";
import { PortfolioMessage } from "@/app/classes/message";
import { createPieChartStrategies } from "@/app/utils/pie";
import { PortfolioPieChart } from "../../RiskPortfolio/PieChart";

interface PortfolioChatWrapperProps {
  message: PortfolioMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const PortfolioChatWrapper: React.FC<PortfolioChatWrapperProps> = ({
  message,
  addBotMessage,
}) => {
  const [risk, setRisk] = useState<RiskLevel>(message.risk);
  const [strategies, setStrategies] = useState<RiskPortfolioStrategies[]>(
    message.strategies
  );

  const nextMessage = async (action: "build" | "edit") => {
    // Settle message attributes
    message.risk = risk;
    message.strategies = strategies;

    if (action === "build") {
      // 判斷金額
      if (Number(message.amount) < 100) {
        await addBotMessage(message.next("deposit"));
      } else {
        await addBotMessage(message.next("build"));
      }
    } else {
      await addBotMessage(message.next(action));
    }
  };

  useEffect(() => {
    setStrategies(message.strategiesSet[risk]);
  }, [risk]);

  return (
    <div className="mt-4 overflow-x-auto max-w-full w-full flex justify-center">
      <div className="w-full max-w-[320px] md:max-w-none">
        <div className="flex flex-col gap-3">
          <div className="rounded-[0px_10px_10px_10px] p-4 flex flex-col gap-6">
            {/* Risk preference selection */}
            <RiskBadgeList
              selectedRisk={risk}
              isEditable={true} // TODO: mock true
              setSelectedRiskLevel={setRisk}
              options={RISK_OPTIONS}
            />

            <div className="flex items-center">
              <p className="text-gray text-xs md:text-sm font-normal px-1">
                {getRiskDescription(message.risk)}
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 flex flex-col gap-6 w-full max-w-[805px]">
          {/* Portfolio visualization */}
          <div className="flex items-center w-full px-[10px] gap-[10px]">
            {/* Pie chart */}
            <div className="w-full">
              <PortfolioPieChart
                pieStrategies={createPieChartStrategies(strategies)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-5 md:flex-row">
            <button
              onClick={() => nextMessage("build")}
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
              onClick={() => nextMessage("edit")}
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
      </div>
    </div>
  );
};

export default PortfolioChatWrapper;
