import { useAccount, useChainId } from "wagmi";
import { useEffect, useState } from "react";
import { getBalance } from "@wagmi/core";
import { formatUnits } from "viem";

import { Token } from "@/app/utils/types";
import { wagmiConfig as config } from "@/providers/config";

export default function useCurrency(tokens: Token[]) {
  const { address: user } = useAccount();
  const chainId = useChainId();
  const [currency, setCurrency] = useState<Token>(tokens[0]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (user) {
        try {
          const params = {
            address: user,
            ...(currency.isNativeToken
              ? {}
              : { token: currency.chains?.[chainId] }),
          };

          const { value, decimals } = await getBalance(config, params);
          setBalance(Number(formatUnits(value, decimals)));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [user, chainId, currency]);

  return { currency, setCurrency, balance };
}
