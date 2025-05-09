import React, { useState } from "react";

import { Message, ReviewPortfolioMessage } from "@/classes/message";
import { PortfolioPieChart } from "../../RiskPortfolio/PieChart";
import { createPieChartStrategies } from "@/utils/pie";
import { Percent } from "lucide-react";
import { MoveUpRight } from "lucide-react";
import Button from "@/components/Button";

interface ReviewPortfolioChatWrapperProps {
  message: ReviewPortfolioMessage;
  addBotMessage: (message: Message) => Promise<void>;
}

const ReviewPortfolioChatWrapper: React.FC<ReviewPortfolioChatWrapperProps> = ({
  message,
  addBotMessage,
}) => {
  const [isEdit, setIsEdit] = useState(true);

  const nextMessage = async (action: "build" | "edit") => {
    setIsEdit(false);

    if (action === "build") {
      // 判斷金額
      if (Number(message.amount) < 100) {
        await addBotMessage(message.next("deposit"));
      } else {
        await addBotMessage(message.next(action));
      }
    } else {
      await addBotMessage(message.next(action));
    }
  };

  return (
    <div className="my-4 flex flex-col gap-6 w-full max-w-[805px]">
      {/* Portfolio visualization */}
      <div className="flex items-center w-full px-[10px] gap-[10px]">
        {/* Pie chart */}
        <div className="w-full">
          <PortfolioPieChart
            pieStrategies={createPieChartStrategies(message.strategies)}
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
  );
};

export default ReviewPortfolioChatWrapper;
