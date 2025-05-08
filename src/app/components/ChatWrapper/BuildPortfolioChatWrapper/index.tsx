import React from "react";
import { FileCheck, MoveUpRight } from "lucide-react";

import { BuildPortfolioMessage } from "@/app/classes/message";

interface BuildPortfolioChatWrapperProps {
  message: BuildPortfolioMessage;
}

const BuildPortfolioChatWrapper: React.FC<BuildPortfolioChatWrapperProps> = ({
  message,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="mt-4 text-lg font-bold">
        ${message.amount} USDC Portfolio complete!
      </p>
      <div className="flex flex-col gap-2">
        {message.strategies.map((strategy, index) => (
          <p className="text-sm text-gray-400" key={index}>
            {strategy.title} {strategy.allocation}% $
            {(strategy.allocation * Number(message.amount)) / 100}
          </p>
        ))}
      </div>
      <div className="flex gap-5">
        <button className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5">
          <FileCheck />
          <span className="text-sm font-semibold">Check my portfolio</span>
        </button>
        <button className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5">
          <MoveUpRight />
          <span className="text-sm font-semibold">
            Explore more DeFi Investment
          </span>
        </button>
      </div>
    </div>
  );
};

export default BuildPortfolioChatWrapper;
