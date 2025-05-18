import { useCallback, useState } from "react";
import { getBalance } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSuiClient } from "@mysten/dapp-kit";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

import { Token } from "@/types";
import { COINGECKO_IDS } from "@/constants/coins";
import { wagmiConfig as config } from "@/providers/config";
import { useStatus } from "@/contexts/StatusContext";

export default function useCurrency(token: Token) {
  const { ecosystem, user, chainId } = useStatus();
  const { client } = useSmartWallets();

  const [currency, setCurrency] = useState<Token>(token);

  const suiClient = useSuiClient();

  const fetchEVMTokenBalance = useCallback(async () => {
    if (!client) return BigInt(0);

    await client.switchChain({ id: chainId });
    const address = client.account.address;

    if (!address) return BigInt(0);

    const params = {
      address: address,
      ...(currency.isNativeToken ? {} : { token: currency.chains?.[chainId] }),
    };

    const { value } = await getBalance(config, params);
    return value;
  }, [client, currency, chainId]);

  const fetchSuiTokenBalance = useCallback(async () => {
    if (!user || !("address" in user)) {
      console.warn("Failed to fetch SUI token balance: No SUI account");
      return BigInt(0);
    }

    const balance = await suiClient.getBalance({
      owner: user.address,
      coinType: token.chains?.[chainId],
    });

    return BigInt(balance.totalBalance);
  }, [user, suiClient, token, chainId]);

  // Fetch balance function to be used with useQuery
  const fetchTokenBalance = useCallback(async () => {
    if (ecosystem === "SUI") {
      return fetchSuiTokenBalance();
    } else {
      return fetchEVMTokenBalance();
    }
  }, [fetchEVMTokenBalance, fetchSuiTokenBalance, ecosystem]);

  const fetchTokenPrice = useCallback(async () => {
    const id = COINGECKO_IDS[currency.name];

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: id,
          vs_currencies: "usd",
        },
      }
    );

    return response.data[id].usd;
  }, [currency.name]);

  // Use React Query for fetching and caching the balance
  const {
    data: balance = BigInt(0),
    isLoading,
    refetch: fetchBalance,
    isError,
    isLoadingError,
    error,
  } = useQuery<bigint>({
    queryKey: [
      "tokenBalance",
      chainId,
      currency.name,
      currency.chains?.[chainId],
      user,
    ],
    queryFn: fetchTokenBalance,
    enabled: !!client || !!suiClient,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true,
  });

  return {
    currency,
    setCurrency,
    balance,
    fetchBalance,
    fetchTokenPrice,
    isError,
    isLoadingError,
    error,
    isLoading,
  };
}
