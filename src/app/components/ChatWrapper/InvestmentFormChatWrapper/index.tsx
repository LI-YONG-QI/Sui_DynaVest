import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { BOT_STRATEGY } from "@/app/utils/constants/strategies";
import type { NextStepFn, StrategyMetadata } from "@/app/utils/types";
import ChainFilter from "@/app/components/StrategyList/ChainFilter";
import InvestmentForm from "@/app/components/StrategyList/StrategyCard/InvestModal/InvestmentForm";
import type { Message, MessagePortfolioData } from "@/app/types";
import { MessageType } from "@/app/types";

export const createDefaultMessage = (type: MessageType) => {
  return () => {
    let text = "";
    let data: MessagePortfolioData | undefined;

    switch (type) {
      case "Portfolio":
        text = "What's your Risk/Yield and Airdrop portfolio preference?";
        type = "Portfolio";
        break;
      default:
        text = "";
    }

    const res: Message = {
      id: (Date.now() + 1).toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      type,
      data,
    };

    return res;
  };
};

interface InvestmentFormChatWrapperProps {
  nextStep: NextStepFn;
  setDepositAmount: (amount: string) => void;
  selectedChains: number[];
  setSelectedChains: Dispatch<SetStateAction<number[]>>;
}

const InvestmentFormChatWrapper = ({
  nextStep,
  setDepositAmount,
  selectedChains,
  setSelectedChains,
}: InvestmentFormChatWrapperProps) => {
  const [botStrategy, setBotStrategy] =
    useState<StrategyMetadata>(BOT_STRATEGY);

  useEffect(() => {
    setBotStrategy({
      ...BOT_STRATEGY,
      chainId: selectedChains[0],
    });
  }, [selectedChains]);

  return (
    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-300 w-[80%]">
      <div className="flex items-center gap-2">
        <p className="font-[Manrope] font-medium text-sm"> Select Chains </p>
        <ChainFilter
          selectedChains={selectedChains}
          setSelectedChains={setSelectedChains}
          selectionMode="single"
        />
      </div>
      <InvestmentForm
        strategy={botStrategy}
        handlePortfolio={(amount: string) => {
          setDepositAmount(amount);
          nextStep(amount + " USDT", createDefaultMessage("Portfolio"));
        }}
      />
    </div>
  );
};

export default InvestmentFormChatWrapper;
