import { useEffect, useState } from "react";

import { BOT_STRATEGY } from "@/constants/strategies";
import type { StrategyMetadata } from "@/types";
import ChainFilter from "@/components/StrategyList/ChainFilter";
import InvestmentForm from "@/components/StrategyList/StrategyCard/InvestModal/InvestmentForm";
import { InvestMessage } from "@/classes/message";

import type { Message } from "@/classes/message";
import { sui } from "@/constants/chains";
import { SUI, USDC } from "@/constants/coins";
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

  const [chain, setChain] = useState<number>(sui.id);

  useEffect(() => {
    setBotStrategy({
      ...BOT_STRATEGY,
      chainId: chain,
      tokens: [SUI],
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
