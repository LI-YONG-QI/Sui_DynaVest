import React, { useEffect, useState } from "react";
import { MoveUpRight, Percent } from "lucide-react";
import { parseUnits } from "viem";

import {
  EVMProtocol,
  RiskLevel,
  RiskPortfolioStrategies,
  SuiProtocol,
} from "@/types";
import type { Message, PortfolioMessage } from "@/classes/message";
import { RISK_OPTIONS } from "@/constants/risk";
import { createPieChartStrategies } from "@/utils/pie";
import { getRiskDescription } from "../../RiskPortfolio";
import { PortfolioPieChart } from "../../RiskPortfolio/PieChart";
import { RiskBadgeList } from "../../RiskBadgeList";
import Button from "@/components/Button";
import { USDC } from "@/constants/coins";
import useCurrency from "@/hooks/useCurrency";
import { getEVMStrategy, getSuiStrategy } from "@/utils/strategies";
import { MultiStrategy } from "@/classes/strategies/multiStrategy";
import { useStrategyExecutor } from "@/hooks/useStrategyExecutor";
import { toast } from "react-toastify";
import { useStatus } from "@/contexts/StatusContext";
import { useSuiStrategyExecutor } from "@/hooks/useSuiStrategyExecutor";
import { sui } from "@/constants/chains";
import { MultiSuiStrategy } from "@/classes/strategies/multiSuiStrategy";

interface PortfolioChatWrapperProps {
  message: PortfolioMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const PortfolioChatWrapper: React.FC<PortfolioChatWrapperProps> = ({
  message,
  addBotMessage,
}) => {
  const [risk, setRisk] = useState<RiskLevel>(message.risk);
  const [strategies, setStrategies] = useState<RiskPortfolioStrategies[]>(
    message.strategies
  );
  const [isEdit, setIsEdit] = useState(true);
  const { balance, isLoading: isLoadingBalance } = useCurrency(USDC);
  const { execute } = useStrategyExecutor();
  const { execute: executeSuiStrategy } = useSuiStrategyExecutor();
  const { chainId } = useStatus();

  const nextMessage = async (action: "build" | "edit") => {
    if (isLoadingBalance) return;

    message.risk = risk;
    message.strategies = strategies;

    setIsEdit(false);

    if (action === "build") {
      if (
        parseUnits(message.amount, USDC.decimals) >
        parseUnits(balance.toString(), USDC.decimals)
      ) {
        await addBotMessage(message.next("deposit"));
      } else {
        await executeMultiStrategy();
        await addBotMessage(message.next("build"));
      }
    } else {
      await addBotMessage(message.next(action));
    }
  };

  async function executeMultiStrategy() {
    try {
      if (chainId === sui.id) {
        const strategiesHandler = strategies.map((strategy) => ({
          strategy: getSuiStrategy(strategy.protocol as SuiProtocol, chainId),
          allocation: strategy.allocation,
        }));

        const multiStrategy = new MultiSuiStrategy(strategiesHandler);
        const tx = await executeSuiStrategy(
          multiStrategy,
          parseUnits(message.amount, USDC.decimals)
        );

        toast.success(`Portfolio built successfully, ${tx}`);
      } else {
        const strategiesHandler = strategies.map((strategy) => ({
          strategy: getEVMStrategy(
            //! not type safe
            strategy.protocol as EVMProtocol,
            strategy.chainId
          ),
          allocation: strategy.allocation,
        }));

        const multiStrategy = new MultiStrategy(strategiesHandler);
        const tx = await execute(
          multiStrategy,
          parseUnits(message.amount, USDC.decimals),
          USDC.chains![message.chain]
        );

        toast.success(`Portfolio built successfully, ${tx}`);
      }
    } catch (error) {
      toast.error(`Error building portfolio, ${error}`);
    }
  }

  useEffect(() => {
    setStrategies(message.strategiesSet[risk]);
  }, [risk]);

  return (
    <div className="mt-4 overflow-x-auto max-w-full w-full flex justify-center">
      <div className="w-full max-w-[320px] md:max-w-none">
        <div className="flex flex-col gap-3">
          <div className="rounded-[0px_10px_10px_10px] p-4 flex flex-col gap-6">
            {/* Risk preference selection */}
            <RiskBadgeList
              selectedRisk={risk}
              isEditable={isEdit}
              setSelectedRiskLevel={setRisk}
              options={RISK_OPTIONS}
            />

            <div className="flex items-center">
              <p className="text-gray text-xs md:text-sm font-normal px-1">
                {getRiskDescription(message.risk)}
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 flex flex-col gap-6 w-full max-w-[805px]">
          {/* Portfolio visualization */}
          <div className="flex items-center w-full px-[10px] gap-[10px]">
            {/* Pie chart */}
            <div className="w-full">
              <PortfolioPieChart
                pieStrategies={createPieChartStrategies(strategies)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-5 md:flex-row">
            <Button
              onClick={() => nextMessage("edit")}
              text="Change Percentage"
              disabled={!isEdit}
              icon={<Percent />}
            />

            <Button
              onClick={() => nextMessage("build")}
              text="Start Building Portfolio"
              disabled={!isEdit}
              icon={<MoveUpRight />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChatWrapper;
