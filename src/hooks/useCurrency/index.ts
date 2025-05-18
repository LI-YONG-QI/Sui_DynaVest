import { useCallback, useState } from "react";
import { getBalance } from "@wagmi/core";
import { useChainId } from "wagmi";
import { formatUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

import { Token } from "@/types";
import { COINGECKO_IDS } from "@/constants/coins";
import { wagmiConfig as config } from "@/providers/config";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

export default function useCurrency(token: Token) {
  const { client } = useSmartWallets();

  const [currency, setCurrency] = useState<Token>(token);
  const chainId = useChainId();

  // Fetch balance function to be used with useQuery
  const fetchTokenBalance = useCallback(async () => {
    console.log("Fetch EVM");
    if (!client) return 0;

    await client.switchChain({ id: chainId });
    const user = client.account.address;

    if (!user) return 0;

    const params = {
      address: user,
      ...(currency.isNativeToken ? {} : { token: currency.chains?.[chainId] }),
    };

    const { value, decimals } = await getBalance(config, params);
    return Number(formatUnits(value, decimals));
  }, [client, currency, chainId]);

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
    data: balance = 0,
    isLoading: isEvmLoadingBalance,
    refetch: fetchBalance,
    isError: isEvmError,
    isLoadingError: isEvmLoadingError,
    error: evmError,
  } = useQuery({
    queryKey: [
      "tokenBalance",
      chainId,
      currency.name,
      currency.chains?.[chainId],
    ],
    queryFn: fetchTokenBalance,
    enabled: !!client && currency.ecosystem === "EVM",
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true,
  });

  const account = useCurrentAccount();
  const {
    data: suiBalance = 0,
    refetch: refetchSuiBalance,
    isLoading: isSuiLoadingBalance,
    isLoadingError: isSuiLoadingError,
    isError: isSuiError,
    error: suiError,
  } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address ?? "" },
    {
      enabled: token.ecosystem === "SUI",
      gcTime: 10000,
    }
  );

  if (token.ecosystem === "SUI") {
    return {
      currency,
      setCurrency,
      balance: suiBalance,
      fetchBalance: refetchSuiBalance,
      fetchTokenPrice,
      isError: isSuiError,
      error: suiError,
      isLoadingBalance: isSuiLoadingBalance,
      isLoadingError: isSuiLoadingError,
    };
  } else {
    return {
      currency,
      setCurrency,
      balance,
      fetchBalance,
      fetchTokenPrice,
      isError: isEvmError,
      error: evmError,
      isLoadingBalance: isEvmLoadingBalance,
      isLoadingError: isEvmLoadingError,
    };
  }
}
