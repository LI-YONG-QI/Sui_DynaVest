import { useEffect, useState } from "react";

import { BOT_STRATEGY } from "@/app/utils/constants/strategies";
import { StrategyMetadata } from "@/app/utils/types";
import ChainFilter from "@/app/components/StrategyList/ChainFilter";
import InvestmentForm from "@/app/components/StrategyList/StrategyCard/InvestModal/InvestmentForm";
import { sendMockPortfolioMessage } from "@/test/sendMock";
import { arbitrum } from "viem/chains";

export const InvestmentFormChatWrapper = ({
  handleMessage,
  setDepositAmount,
}: {
  handleMessage: (
    message: string,
    sendMsg: (message: string) => Promise<{
      result: string;
    }>
  ) => Promise<void>;
  setDepositAmount: (amount: string) => void;
}) => {
  const [selectedChains, setSelectedChains] = useState<number[]>([arbitrum.id]);
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
          handleMessage(amount + " USDT", sendMockPortfolioMessage);
        }}
      />
    </div>
  );
};
