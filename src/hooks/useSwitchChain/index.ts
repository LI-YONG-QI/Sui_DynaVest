import { useWallets } from "@privy-io/react-auth";
import {
  useConnectWallet as useSuiConnectWallet,
  useCurrentWallet as useSuiCurrentWallet,
  useWallets as useSuiWallets,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useChainId, useSwitchChain as useWagmiSwitchChain } from "wagmi";
import { sui } from "@/constants/chains";

export default function useSwitchChain(targetChainId: number) {
  const { ready } = useWallets();
  const chainId = useChainId();
  const [isSupportedChain, setIsSupportedChain] = useState<boolean>(false);

  const { switchChainAsync } = useWagmiSwitchChain();
  const { mutateAsync: connect } = useSuiConnectWallet();
  const wallets = useSuiWallets();
  const { connectionStatus } = useSuiCurrentWallet();

  const switchChain = async () => {
    if (targetChainId === sui.id) {
      await connect({ wallet: wallets[0] }); // Slush by default
    } else {
      // EVM chain
      await switchChainAsync({ chainId: targetChainId });
    }
  };

  useEffect(() => {
    if (targetChainId === sui.id) {
      setIsSupportedChain(connectionStatus === "connected");
    } else {
      // EVM chain
      setIsSupportedChain(chainId === targetChainId);
    }
  }, [chainId, targetChainId, ready, connectionStatus]);

  return { switchChain, isSupportedChain, ready };
}
