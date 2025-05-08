import { useEffect, useState } from "react";

import { BOT_STRATEGY } from "@/app/utils/constants/strategies";
import type { StrategyMetadata } from "@/app/utils/types";
import ChainFilter from "@/app/components/StrategyList/ChainFilter";
import InvestmentForm from "@/app/components/StrategyList/StrategyCard/InvestModal/InvestmentForm";
import { InvestMessage } from "@/app/classes/message";

import type { Message } from "@/app/classes/message";
interface InvestmentFormChatWrapperProps {
  message: InvestMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const InvestmentFormChatWrapper = ({
  message,
  addBotMessage,
}: InvestmentFormChatWrapperProps) => {
  const [botStrategy, setBotStrategy] =
    useState<StrategyMetadata>(BOT_STRATEGY);

  const [chain, setChain] = useState<number>(message.chain);

  useEffect(() => {
    setBotStrategy({
      ...BOT_STRATEGY,
      chainId: chain,
    });
  }, [chain]);

  const handlePortfolio = async (amount: string) => {
    message.amount = amount;
    message.chain = chain;
    await addBotMessage(message.next());
  };

  return (
    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-300 w-[80%]">
      <div className="flex items-center gap-2">
        <p className="font-[Manrope] font-medium text-sm"> Select Chains </p>
        <ChainFilter
          selectedChains={[chain]}
          setSelectedChain={setChain}
          selectionMode="single"
        />
      </div>
      <InvestmentForm
        strategy={botStrategy}
        handlePortfolio={handlePortfolio}
      />
    </div>
  );
};

export default InvestmentFormChatWrapper;
