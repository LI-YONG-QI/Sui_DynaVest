import { useEffect, useState } from "react";
import { getBalance } from "@wagmi/core";
import { formatUnits } from "viem";

import { Token } from "@/types";
import { wagmiConfig as config } from "@/providers/config";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useChainId } from "wagmi";

export default function useCurrency(tokens: Token[]) {
  const { getClientForChain } = useSmartWallets();
  const [currency, setCurrency] = useState<Token>(tokens[0]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const chainId = useChainId();

  const fetchBalance = async () => {
    setIsLoadingBalance(true);

    try {
      const client = await getClientForChain({ id: chainId });
      const user = client?.account.address;

      setBalance(0);

      const params = {
        address: user!,
        ...(currency.isNativeToken
          ? {}
          : { token: currency.chains?.[chainId] }),
      };

      const { value, decimals } = await getBalance(config, params);
      setBalance(Number(formatUnits(value, decimals)));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [chainId, currency]);

  return { currency, setCurrency, balance, fetchBalance, isLoadingBalance };
}
