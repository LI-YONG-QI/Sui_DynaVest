import React, { SetStateAction, Dispatch, useState } from "react";
import { MoveUpRight } from "lucide-react";

import {
  sendMockBuildPortfolioMessage,
  sendMockPortfolioMessage,
} from "@/test/sendMock";
import { RiskBadge } from "../RiskPortfolio";
import type { NextStepFn, StrategyMetadata } from "@/app/utils/types";
import InvestmentForm from "../StrategyList/StrategyCard/InvestModal/InvestmentForm";

const DEPOSIT_ACTIONS = ["Deposit", "Change Amount"];

type DepositChatWrapperProps = {
  isEditable: boolean;
  nextStep: NextStepFn;
  setDepositAmount: Dispatch<SetStateAction<string>>;
  strategy: StrategyMetadata;
};

const DepositChatWrapper = ({
  isEditable,
  nextStep,
  setDepositAmount,
  strategy,
}: DepositChatWrapperProps) => {
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

      {selectedAction === "Deposit" ? (
        <p>QRCODE !!!!</p>
      ) : (
        <div className="w-[80%]">
          <InvestmentForm
            strategy={strategy}
            handlePortfolio={(amount: string) => {
              setDepositAmount(amount);
              nextStep(amount + " USDT", sendMockPortfolioMessage);
            }}
          />
        </div>
      )}

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
