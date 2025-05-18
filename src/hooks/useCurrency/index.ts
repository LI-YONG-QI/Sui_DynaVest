import { useCallback, useState } from "react";
import { getBalance } from "@wagmi/core";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

import { Token } from "@/types";
import { COINGECKO_IDS } from "@/constants/coins";
import { wagmiConfig as config } from "@/providers/config";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { sui } from "@/constants/chains";

export default function useCurrency(token: Token) {
  const { client } = useSmartWallets();

  const [currency, setCurrency] = useState<Token>(token);
  const chainId = useChainId();

  const suiClient = useSuiClient();
  const suiAccount = useCurrentAccount();

  const fetchEVMTokenBalance = useCallback(async () => {
    if (!client) return BigInt(0);

    await client.switchChain({ id: chainId });
    const user = client.account.address;

    if (!user) return BigInt(0);

    const params = {
      address: user,
      ...(currency.isNativeToken ? {} : { token: currency.chains?.[chainId] }),
    };

    const { value } = await getBalance(config, params);
    return value;
  }, [client, currency, chainId]);

  const fetchSuiTokenBalance = useCallback(async () => {
    if (!suiAccount) {
      console.warn("No account");
      return BigInt(0);
    }

    const balance = await suiClient.getBalance({
      owner: suiAccount?.address ?? "",
      coinType: token.chains?.[sui.id],
    });

    return BigInt(balance.totalBalance);
  }, [suiAccount, suiClient, token]);

  // Fetch balance function to be used with useQuery
  const fetchTokenBalance = useCallback(async () => {
    if (token.ecosystem === "SUI") {
      return fetchSuiTokenBalance();
    } else {
      return fetchEVMTokenBalance();
    }
  }, [fetchEVMTokenBalance, fetchSuiTokenBalance, token.ecosystem]);

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
      suiAccount?.address,
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
