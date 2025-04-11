import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useChainId } from "wagmi";

export default function useSwitchChain(targetChainId: number) {
  const { wallets, ready } = useWallets();
  const chainId = useChainId();
  const [isSupportedChain, setIsSupportedChain] = useState<boolean>(false);

  const handleSwitchChain = async () => {
    try {
      const wallet = wallets[0];
      await wallet.switchChain(targetChainId);

      toast.success(`Switched chain to ${targetChainId}`);
    } catch (error: unknown) {
      console.error("Failed to switch chain:", error);
    }
  };

  useEffect(() => {
    if (chainId === targetChainId) {
      setIsSupportedChain(true);
    } else {
      setIsSupportedChain(false);
    }
  }, [chainId, targetChainId, ready]);

  return { handleSwitchChain, isSupportedChain, ready };
}
