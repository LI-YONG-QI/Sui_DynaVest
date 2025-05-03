import React, { SetStateAction, Dispatch, useState } from "react";
import { useAccount } from "wagmi";
import { MoveUpRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import {
  sendMockBuildPortfolioMessage,
  sendMockPortfolioMessage,
} from "@/test/sendMock";
import { RiskBadge } from "../RiskPortfolio";
import type { NextStepFn, StrategyMetadata } from "@/app/utils/types";
import InvestmentForm from "../StrategyList/StrategyCard/InvestModal/InvestmentForm";
import CopyButton from "../CopyButton";

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
  const { address } = useAccount();
  const [selectedAction, setSelectedAction] = useState<string>("Deposit");
  const [isDeposit] = useState(true); // TODO: deal deposit logic

  const uri = `ethereum:${address}`;

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
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="p-4 bg-white rounded-lg flex flex-col items-center justify-center">
            <QRCodeSVG
              value={uri}
              size={100}
              // 以下屬性可自行調整
              level="H" // 容錯率：L, M, Q, H
            />
          </div>
          <div className="flex gap-2 items-center justify-center">
            <p>{address}</p>
            <CopyButton text={address!} />
          </div>
        </div>
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

      {isDeposit && (
        <div className="flex flex-col gap-4">
          <p>Deposit successfully</p>
          <button
            onClick={() =>
              nextStep("Build portfolio", sendMockBuildPortfolioMessage)
            }
            className="max-w-[250px] flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5"
          >
            <MoveUpRight />
            <span className="text-sm font-semibold">
              Start Building Portfolio
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DepositChatWrapper;
