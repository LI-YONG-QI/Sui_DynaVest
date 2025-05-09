import React, { useState } from "react";
import { FileCheck, MoveUpRight } from "lucide-react";

import { BuildPortfolioMessage } from "@/classes/message";
import Button from "@/components/Button";

interface BuildPortfolioChatWrapperProps {
  message: BuildPortfolioMessage;
}

const BuildPortfolioChatWrapper: React.FC<BuildPortfolioChatWrapperProps> = ({
  message,
}) => {
  const [isEdit, setIsEdit] = useState(true);

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
        <Button
          onClick={() => setIsEdit(false)}
          text="Check my portfolio"
          disabled={!isEdit}
          icon={<FileCheck />}
        />
        <Button
          onClick={() => setIsEdit(false)}
          text="Explore more DeFi Investment"
          disabled={!isEdit}
          icon={<MoveUpRight />}
        />
      </div>
    </div>
  );
};

export default BuildPortfolioChatWrapper;
