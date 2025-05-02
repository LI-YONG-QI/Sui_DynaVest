import { sendMockBuildPortfolioMessage } from "@/test/sendMock";

import { MoveUpRight } from "lucide-react";
import React, { useState } from "react";
import { RiskBadge } from "../RiskPortfolio";

const DEPOSIT_ACTIONS = ["Deposit", "Change Amount"];

const DepositChatWrapper = ({
  isEditable,
  nextStep,
}: {
  isEditable: boolean;
  nextStep: (
    userInput: string,
    sendMsg: (message: string) => Promise<{
      result: string;
    }>
  ) => void;
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("Deposit");

  return (
    <div className="flex flex-col gap-4">
      <p className="mt-4 text-lg font-bold">Deposit funds to your wallet</p>

      <div className="flex flex-wrap gap-[18px] items-center md:justify-start">
        {DEPOSIT_ACTIONS.map((action) => (
          <RiskBadge
            key={action}
            label={action}
            isSelected={action === selectedAction}
            isEditable={isEditable}
            setSelectedRiskLevel={setSelectedAction}
          />
        ))}
      </div>

      {selectedAction === "Deposit" ? <p>QRCODE !!!!</p> : <p>Change Amount</p>}

      <button
        onClick={() =>
          nextStep("Build portfolio", sendMockBuildPortfolioMessage)
        }
        className="max-w-[250px] flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5"
      >
        <MoveUpRight />
        <span className="text-sm font-semibold">Start Building Portfolio</span>
      </button>
    </div>
  );
};

export default DepositChatWrapper;
