import React, { SetStateAction, Dispatch, useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { MoveUpRight } from "lucide-react";
import { MoonLoader } from "react-spinners";
import { QRCodeSVG } from "qrcode.react";
import { parseUnits } from "viem";
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
  depositAmount: string;
  setDepositAmount: Dispatch<SetStateAction<string>>;
  strategy: StrategyMetadata;
};

const DepositChatWrapper = ({
  isEditable,
  nextStep,
  depositAmount,
  setDepositAmount,
  strategy,
}: DepositChatWrapperProps) => {
  const { address } = useAccount();
  const [selectedAction, setSelectedAction] = useState<string>("Deposit");
  const [isDeposit, setIsDeposit] = useState(false); // TODO: deal deposit logic

  const chainId = strategy.chainId;
  const usdc = strategy.tokens[0].chains![chainId];
  const { data: balance, dataUpdatedAt } = useBalance({
    address,
    token: usdc,
    chainId,
    query: {
      enabled: !isDeposit,
      refetchInterval: 3 * 1000,
    },
  });

  const uri = `ethereum:${address}`;

  console.log(balance);
  console.log(dataUpdatedAt);

  useEffect(() => {
    if (balance?.value) {
      setIsDeposit(balance.value > BigInt(parseUnits(depositAmount, 6)));
    }
  }, [balance, depositAmount]);

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

          <div className="pt-8 flex flex-col gap-4 self-start">
            {isDeposit ? (
              <>
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
              </>
            ) : (
              <div className="flex gap-4 self-start">
                <p>Waiting for deposit...</p>
                <MoonLoader color="#5F79F1" size={20} />
              </div>
            )}
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
    </div>
  );
};

export default DepositChatWrapper;
