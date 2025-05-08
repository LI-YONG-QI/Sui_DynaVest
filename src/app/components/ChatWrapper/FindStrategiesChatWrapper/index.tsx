import React, { FC, useState } from "react";

import { RiskLevel } from "@/app/utils/types";
import ChainFilter from "../../StrategyList/ChainFilter";
import { RiskBadgeList } from "../../RiskBadgeList";
import { RISK_OPTIONS } from "@/app/utils/constants/risk";
import { MoveUpRight } from "lucide-react";
import Button from "../../Button";
import { FindStrategiesMessage, Message } from "@/app/classes/message";

interface FindStrategiesChatWrapperProps {
  message: FindStrategiesMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const FindStrategiesChatWrapper: FC<FindStrategiesChatWrapperProps> = ({
  message,
  addBotMessage,
}) => {
  const [chains, setChains] = useState<number[]>(message.chains);
  const [risk, setRisk] = useState<RiskLevel>(message.risk);

  const nextMessage = async () => {
    message.chains = chains;
    message.risk = risk;

    await addBotMessage(message.next());
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="font-[Manrope] font-medium text-sm">Select Chains</p>
        <ChainFilter selectedChains={chains} setSelectedChains={setChains} />
      </div>
      <div className="flex items-center gap-2">
        <p className="font-[Manrope] font-medium text-sm">Select Risk</p>
        <RiskBadgeList
          selectedRisk={risk}
          setSelectedRiskLevel={setRisk}
          options={RISK_OPTIONS}
          isEditable={true}
        />
      </div>
      <Button
        onClick={nextMessage}
        text="Find DeFi Strategies"
        icon={<MoveUpRight />}
      />
    </div>
  );
};

export default FindStrategiesChatWrapper;
