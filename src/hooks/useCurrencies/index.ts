import { useState, useEffect, useCallback } from "react";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";
import { getBalance } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";

import { wagmiConfig as config } from "@/providers/config";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { Token } from "@/types";

export interface TokenWithBalance extends Token {
  balance: number;
}

export default function useCurrencies(tokens: Token[]) {
  const { client, getClientForChain } = useSmartWallets();
  const chainId = useChainId();

  // Fetch balances function to be used with useQuery
  const fetchTokenBalances = useCallback(async () => {
    if (!client || !tokens || tokens.length === 0) {
      return [] as TokenWithBalance[];
    }

    const chainClient = await getClientForChain({ id: chainId });
    const user = chainClient?.account.address;

    if (!user) {
      return [] as TokenWithBalance[];
    }

    // Create a fresh array based on current tokens
    const tokensWithBalances: TokenWithBalance[] = tokens.map((token) => ({
      ...token,
      balance: 0,
    }));

    // Fetch balances in parallel
    const balancePromises = tokens.map(async (token, index) => {
      try {
        const params = {
          address: user,
          ...(token.isNativeToken ? {} : { token: token.chains?.[chainId] }),
        };

        const { value, decimals } = await getBalance(config, params);
        tokensWithBalances[index].balance = Number(
          formatUnits(value, decimals)
        );
      } catch (error) {
        console.error(`Error fetching balance for ${token.name}:`, error);
        // Balance remains 0 for failed fetches
      }
    });

    await Promise.all(balancePromises);
    return tokensWithBalances;
  }, [client, tokens, chainId, getClientForChain]);

  // Initialize with empty balances when tokens change
  const [initialCurrencies, setInitialCurrencies] = useState<
    TokenWithBalance[]
  >([]);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const emptyBalanceTokens = tokens.map((token) => ({
        ...token,
        balance: 0,
      }));
      setInitialCurrencies(emptyBalanceTokens);
    }
  }, [tokens]);

  // Use React Query for fetching and caching balances
  const {
    data: currencies = initialCurrencies,
    isLoading: isLoadingBalances,
    isError,
    error,
    refetch: fetchBalances,
  } = useQuery({
    queryKey: ["tokenBalances", chainId, tokens.map((t) => t.name).join(",")],
    queryFn: fetchTokenBalances,
    enabled: !!client && tokens.length > 0,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true,
    placeholderData: initialCurrencies,
  });

  // Log errors if any
  useEffect(() => {
    if (isError) {
      console.error("Error fetching token balances:", error);
    }
  }, [isError, error]);

  return {
    currencies,
    fetchBalances,
    isLoadingBalances,
    // Helper to get a specific token's balance by name
    getTokenBalance: (name: string) =>
      currencies.find((c) => c.name === name)?.balance || 0,
  };
}
