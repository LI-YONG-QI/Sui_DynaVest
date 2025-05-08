import React from "react";

import { Message, ReviewPortfolioMessage } from "@/app/classes/message";
import { PortfolioPieChart } from "../../RiskPortfolio/PieChart";
import { createPieChartStrategies } from "@/app/utils/pie";

interface ReviewPortfolioChatWrapperProps {
  message: ReviewPortfolioMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const ReviewPortfolioChatWrapper: React.FC<ReviewPortfolioChatWrapperProps> = ({
  message,
  addBotMessage,
}) => {
  const nextMessage = async (action: "build" | "edit") => {

    
    await addBotMessage(message.next(action));
  };

  return (
    <div className="my-4 flex flex-col gap-6 w-full max-w-[805px]">
      {/* Portfolio visualization */}
      <div className="flex items-center w-full px-[10px] gap-[10px]">
        {/* Pie chart */}
        <div className="w-full">
          <PortfolioPieChart
            pieStrategies={createPieChartStrategies(message.strategies)}
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
          onClick={() => nextMessage("build")}
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

export default ReviewPortfolioChatWrapper;
