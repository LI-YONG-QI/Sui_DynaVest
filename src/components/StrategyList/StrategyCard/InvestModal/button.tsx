import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useChainId,
  useSwitchChain as useWagmiSwitchChain,
} from "wagmi";
import { parseUnits } from "viem";

import { Token, InvestStrategy } from "@/types";
import { getStrategy } from "@/utils/strategies";
import useSwitchChain from "@/hooks/useSwitchChain";

import { useAccountProviderContext } from "@/contexts/AccountContext";
import { useStrategyExecutor } from "@/hooks/useStrategyExecutor";

enum ButtonState {
  Pending = "Processing...",
  Invest = "Invest",
  SwitchChain = "Switch Chain",
}

interface InvestModalButtonProps {
  currency: Token;
  strategy: InvestStrategy;
  amount: string;
  handleClose?: () => void;
  handlePortfolio?: (amount: string) => void;
}

export default function InvestModalButton({
  currency,
  amount,
  strategy,
  handleClose,
  handlePortfolio,
}: InvestModalButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.Pending
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { kernelAccountClient } = useAccountProviderContext();

  const { address: user } = useAccount();
  const chainId = useChainId();
  const {
    handleSwitchChain,
    isSupportedChain,
    ready: isWalletReady,
  } = useSwitchChain(strategy.chainId);

  const { execute } = useStrategyExecutor();
  const { switchChainAsync } = useWagmiSwitchChain();

  const AMOUNT_LIMIT = 0.01;

  useEffect(() => {
    setButtonState(
      isLoading
        ? ButtonState.Pending
        : !isWalletReady
        ? ButtonState.Pending
        : isSupportedChain
        ? ButtonState.Invest
        : ButtonState.SwitchChain
    );
    setIsDisabled(isLoading);
  }, [isWalletReady, isLoading, isSupportedChain]);

  const invest = async () => {
    if (Number(amount) < AMOUNT_LIMIT) {
      toast.error("Investment amount must be greater than 0.01");
      return;
    }

    if (handlePortfolio) {
      handlePortfolio(amount);
      setIsDisabled(false);
    } else {
      executeStrategy();
    }
  };

  const executeStrategy = async () => {
    setIsLoading(true);

    if (!user || !kernelAccountClient) {
      console.error("no user or kernel account client");
      toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }

    const strategyHandler = getStrategy(strategy.protocol, chainId);
    const parsedAmount = parseUnits(amount, currency.decimals);

    try {
      let result;
      if (currency.isNativeToken) {
        result = await execute(strategyHandler, parsedAmount);
      } else {
        result = await execute(
          strategyHandler,
          parsedAmount,
          currency.chains![chainId]
        );
      }

      toast.success(`Investment successful! ${result}`);

      if (handleClose) handleClose();
    } catch (error) {
      console.error(error);
      toast.error(`Investment failed! ${error}`);
    }
    setIsLoading(false);
  };

  const handler = () => {
    switch (buttonState) {
      case ButtonState.Invest:
        invest();
        break;
      case ButtonState.SwitchChain:
        switchChainAsync({ chainId: strategy.chainId });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handler}
        disabled={isDisabled}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-[#5F79F1] hover:bg-[#4A64DC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {buttonState}
      </button>
    </>
  );
}
