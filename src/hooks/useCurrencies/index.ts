import { useState, useEffect, useCallback } from "react";
import { formatUnits } from "viem";
import { getBalance } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

import { Token } from "@/types";
import { COINGECKO_IDS } from "@/constants/coins";
import { wagmiConfig as config } from "@/providers/config";
import { useStatus } from "@/contexts/StatusContext";
import { sui } from "@/constants/chains";
export interface TokenData {
  token: Token;
  balance: number;
  value: number;
  price: number;
}

export default function useCurrencies(tokens: Token[]) {
  const { ecosystem, chainId } = useStatus();
  const { client } = useSmartWallets();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();

  // Initialize with empty data
  const [initialTokensData, setInitialTokensData] = useState<TokenData[]>([]);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const emptyTokensData = tokens.map((token) => ({
        token,
        balance: 0,
        price: 0,
        value: 0,
      }));
      setInitialTokensData(emptyTokensData);
    }
  }, [tokens]);

  // Function to fetch token prices
  const fetchTokenPrices = useCallback(
    async (tokensDataInput: TokenData[]): Promise<TokenData[]> => {
      if (!tokens || tokens.length === 0) return tokensDataInput;

      const tokenIds = tokens
        .map((token) => COINGECKO_IDS[token.name])
        .filter((id) => !!id);

      if (tokenIds.length === 0) {
        return tokensDataInput;
      }

      try {
        const priceResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            params: {
              ids: tokenIds.join(","),
              vs_currencies: "usd",
            },
          }
        );

        // Create a new array with updated prices
        const updatedTokensData = tokensDataInput.map((tokenData) => {
          const id = COINGECKO_IDS[tokenData.token.name];
          if (id && priceResponse.data[id]) {
            return {
              ...tokenData,
              price: priceResponse.data[id].usd,
            };
          }
          return tokenData;
        });

        return updatedTokensData;
      } catch (error) {
        console.error("Error fetching token prices:", error);
        return tokensDataInput;
      }
    },
    [tokens]
  );

  // Function to fetch EVM token balances
  const fetchEVMTokenBalances = useCallback(
    async (tokensDataInput: TokenData[]): Promise<TokenData[]> => {
      if (!client || !tokens || tokens.length === 0) {
        return tokensDataInput;
      }

      try {
        await client.switchChain({ id: chainId });
        const address = client.account.address;

        if (!address) {
          return tokensDataInput;
        }

        // Create a copy of tokensData to update
        const updatedTokensData = [...tokensDataInput];

        // Fetch balances in parallel - use tokensData to match tokens with their TokenData objects
        const balancePromises = updatedTokensData.map(
          async (tokenData, index) => {
            const token = tokenData.token;
            const params = {
              address,
              ...(token.isNativeToken
                ? {}
                : { token: token.chains?.[chainId] }),
            };

            try {
              const { value, decimals } = await getBalance(config, params);
              updatedTokensData[index].balance = Number(
                formatUnits(value, decimals)
              );

              // Calculate value if price exists
              if (updatedTokensData[index].price) {
                updatedTokensData[index].value =
                  updatedTokensData[index].balance *
                  updatedTokensData[index].price!;
              }
            } catch (error) {
              console.error(`Error fetching balance for ${token.name}:`, error);
            }
          }
        );

        await Promise.all(balancePromises);

        return updatedTokensData;
      } catch (error) {
        console.error("Error in fetchEVMTokenBalances:", error);
        return tokensDataInput;
      }
    },
    [client, tokens, chainId]
  );

  // Function to fetch SUI token balances
  const fetchSuiTokenBalances = useCallback(
    async (tokensDataInput: TokenData[]): Promise<TokenData[]> => {
      if (!account || !tokens || tokens.length === 0 || !suiClient) {
        return tokensDataInput;
      }

      try {
        const address = account.address;
        // Create a copy of tokensData to update
        const updatedTokensData = [...tokensDataInput];

        const balancePromises = updatedTokensData.map(
          async (tokenData, index) => {
            const token = tokenData.token;
            const coinType = token.chains?.[chainId];
            if (!coinType) {
              updatedTokensData[index].balance = 0;
              updatedTokensData[index].value = 0;
              return;
            }

            try {
              const balance = await suiClient.getBalance({
                owner: address,
                coinType,
              });
              updatedTokensData[index].balance =
                Number(balance.totalBalance) / 10 ** token.decimals;
              if (updatedTokensData[index].price) {
                updatedTokensData[index].value =
                  updatedTokensData[index].balance *
                  updatedTokensData[index].price!;
              }
            } catch (error) {
              console.error(
                `Error fetching SUI balance for ${token.name}:`,
                error
              );
            }
          }
        );

        await Promise.all(balancePromises);
        return updatedTokensData;
      } catch (error) {
        console.error("Error in fetchSuiTokenBalances:", error);
        return tokensDataInput;
      }
    },
    [account, tokens, chainId, suiClient]
  );

  // Main function that handles fetching both balances and prices
  const fetchTokenData = useCallback(async () => {
    if (!tokens || tokens.length === 0) {
      return [] as TokenData[];
    }

    // Step 1: Create initial tokens data
    const initialData: TokenData[] = tokens.map((token) => ({
      token,
      balance: 0,
      price: 0,
      value: 0,
    }));

    // Step 2: Fetch prices
    const tokensWithPrices = await fetchTokenPrices(initialData);

    // Step 3: Fetch balances and calculate values
    let tokensWithBalancesAndPrices: TokenData[] = [];
    if (chainId === sui.id) {
      tokensWithBalancesAndPrices = await fetchSuiTokenBalances(
        tokensWithPrices
      );
    } else {
      tokensWithBalancesAndPrices = await fetchEVMTokenBalances(
        tokensWithPrices
      );
    }

    return tokensWithBalancesAndPrices;
  }, [
    tokens,
    fetchTokenPrices,
    fetchEVMTokenBalances,
    fetchSuiTokenBalances,
    chainId,
  ]);

  // Determine if query should be enabled
  const isQueryEnabled = Boolean(
    tokens.length > 0 &&
      ((chainId === sui.id && account) ||
        (chainId !== sui.id && client?.account.address))
  );

  // Force refetch when wallet connection changes
  const walletConnectionKey =
    chainId === sui.id ? account?.address : client?.account.address;

  // Use a single React Query for fetching and caching all token data
  const {
    data: tokensData = initialTokensData,
    isLoading,
    isLoadingError,
    isError,
    error,
    refetch: refreshData,
  } = useQuery({
    queryKey: [
      "tokenData",
      ecosystem,
      chainId,
      walletConnectionKey, // Use specific wallet address to trigger refetch when connected
      tokens.map((t) => t.name).join(","),
    ],
    queryFn: fetchTokenData,
    enabled: isQueryEnabled,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 2 * 60 * 1000, // Refresh data every 2 minutes
    placeholderData: initialTokensData,
    refetchOnMount: "always", // Always refetch on mount
    retry: 2,
  });

  // Force refetch when wallet connection changes
  useEffect(() => {
    if (isQueryEnabled) {
      refreshData();
    }
  }, [walletConnectionKey, isQueryEnabled, refreshData]);

  return {
    tokensData,
    isLoading,
    isLoadingError,
    isError,
    error,
    refreshData,
    // Helper methods
    getTokenBalance: (name: string) =>
      tokensData.find((t) => t.token.name === name)?.balance || 0,
    getTokenPrice: (name: string) =>
      tokensData.find((t) => t.token.name === name)?.price,
    getTokenValue: (name: string) =>
      tokensData.find((t) => t.token.name === name)?.value || 0,
  };
}
