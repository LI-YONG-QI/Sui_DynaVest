import React, { createContext, useContext, ReactNode } from "react";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { toast } from "react-toastify";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

import useCurrencies, { TokenData } from "@/hooks/useCurrencies";
import { Token } from "@/types";
import { ERC20_ABI } from "@/constants";
import { SUPPORTED_TOKENS } from "@/constants/profile";
import { useStatus } from "@/contexts/StatusContext";
import { SupportedChainIds } from "@/providers/config";

interface AssetsContextType {
  tokensData: TokenData[];
  isLoading: boolean;
  isError: boolean;
  isLoadingError: boolean;
  error: Error | null;
  refreshData: () => void;
  handleWithdraw: (asset: Token, amount: string, to: Address) => Promise<void>;
  getTokenBalance: (name: string) => number;
  getTokenPrice: (name: string) => number | undefined;
  getTokenValue: (name: string) => number;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export function useAssets() {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetsProvider");
  }
  return context;
}

interface AssetsProviderProps {
  children: ReactNode;
  tokens?: Token[];
}

export function AssetsProvider({ children }: AssetsProviderProps) {
  const { chainId } = useStatus();
  const tokensWithChain = SUPPORTED_TOKENS[chainId as SupportedChainIds];
  console.log("Tokens with chain", tokensWithChain);

  const {
    tokensData,
    isLoading,
    isError,
    error,
    isLoadingError,
    refreshData,
    getTokenBalance,
    getTokenPrice,
    getTokenValue,
  } = useCurrencies(tokensWithChain);

  const { client } = useSmartWallets();

  const handleWithdraw = async (asset: Token, amount: string, to: Address) => {
    if (!client) {
      toast.error("Client not found");
      return;
    }

    await client.switchChain({ id: chainId });
    try {
      const decimals = asset.decimals || 6;
      const amountInBaseUnits = parseUnits(amount, decimals);

      let tx;
      if (asset.isNativeToken) {
        tx = await client.sendTransaction({
          to,
          value: amountInBaseUnits,
        });
      } else {
        tx = await client.sendTransaction({
          to: asset.chains?.[chainId],
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [to, amountInBaseUnits],
          }),
        });
      }

      toast.success(
        `${asset.name} withdrawal submitted successfully, tx hash: ${tx}`
      );

      // Refresh data after successful transaction
      refreshData();
    } catch (error) {
      console.log("Error processing withdrawal:", error);
      toast.error("Something went wrong");
    }
  };

  const value = {
    tokensData,
    isLoading,
    isError,
    isLoadingError,
    error,
    refreshData,
    handleWithdraw,
    getTokenBalance,
    getTokenPrice,
    getTokenValue,
  };

  return (
    <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
  );
}
