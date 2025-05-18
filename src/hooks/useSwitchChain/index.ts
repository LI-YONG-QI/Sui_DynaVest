import { useWallets } from "@privy-io/react-auth";
import {
  useConnectWallet as useSuiConnectWallet,
  useCurrentWallet as useSuiCurrentWallet,
  useWallets as useSuiWallets,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useChainId, useSwitchChain as useWagmiSwitchChain } from "wagmi";

export default function useSwitchChain(targetChainId: number) {
  const { ready } = useWallets();
  const chainId = useChainId();
  const [isSupportedChain, setIsSupportedChain] = useState<boolean>(false);

  const { switchChainAsync } = useWagmiSwitchChain();
  const { mutateAsync: connect } = useSuiConnectWallet();
  const wallets = useSuiWallets();
  const { connectionStatus } = useSuiCurrentWallet();

  const switchChain = async () => {
    if (targetChainId === -1) {
      await connect({ wallet: wallets[0] });
    } else {
      // EVM chain
      await switchChainAsync({ chainId: targetChainId });
    }
  };

  useEffect(() => {
    if (targetChainId === -1) {
      setIsSupportedChain(connectionStatus === "connected");
    } else {
      // EVM chain
      setIsSupportedChain(chainId === targetChainId);
    }
  }, [chainId, targetChainId, ready, connectionStatus]);

  return { switchChain, isSupportedChain, ready };
}
