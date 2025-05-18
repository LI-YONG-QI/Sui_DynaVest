"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { usePrivy, User } from "@privy-io/react-auth";

import {
  useConnectWallet as useSuiConnectWallet,
  useCurrentAccount,
  useWallets as useSuiWallets,
} from "@mysten/dapp-kit";
import type { WalletAccount } from "@mysten/wallet-standard";

import { sui } from "@/constants/chains";

type Ecosystem = "SUI" | "EVM";

interface StatusContextType {
  ecosystem: Ecosystem;
  chainId: number;
  user: User | WalletAccount | null;
  switchEcosystem: (ecosystem: Ecosystem) => void;
  switchChain: (chainId: number) => Promise<void>;
  switchToEVM: () => void;
  switchToSUI: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export function StatusProvider({ children }: { children: ReactNode }) {
  const [ecosystem, setEcosystem] = useState<Ecosystem>("EVM");
  const [chainId, setChainId] = useState<number>(0);
  const [user, setUser] = useState<User | WalletAccount | null>(null);

  // EVM
  const { switchChainAsync: switchEVMChain } = useSwitchChain();
  const { user: privyUser } = usePrivy();
  const evmChainId = useChainId();

  // SUI
  const wallets = useSuiWallets();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connect } = useSuiConnectWallet();

  const switchToEVM = () => {
    console.log("switchToEVM");
    setEcosystem("EVM");
    setChainId(evmChainId);
    setUser(privyUser);
  };

  const switchToSUI = () => {
    console.log("switchToSUI");
    setEcosystem("SUI");
    setChainId(sui.id);
    setUser(currentAccount);
  };

  const switchEcosystem = (newEcosystem: Ecosystem) => {
    if (newEcosystem === "EVM") {
      switchToEVM();
    } else if (newEcosystem === "SUI") {
      switchToSUI();
    }
  };

  const switchChain = async (_newChain: number) => {
    if (_newChain === sui.id) {
      await connect(
        {
          wallet: wallets[0], // Slush wallet by default
        },
        {
          onSuccess: () => {
            switchToSUI();
          },
        }
      );
    } else {
      if (ecosystem !== "EVM") switchToEVM();
      await switchEVMChain({ chainId: _newChain });
    }

    setChainId(_newChain);
  };

  useEffect(() => {
    switch (ecosystem) {
      case "EVM":
        switchToEVM();
        break;
      case "SUI":
        switchToSUI();
        break;
      default:
        throw new Error(`Invalid ecosystem: ${ecosystem}`);
    }
  }, [ecosystem, privyUser, currentAccount, evmChainId]);

  return (
    <StatusContext.Provider
      value={{
        ecosystem,
        switchEcosystem,
        switchChain,
        chainId,
        user,
        switchToEVM,
        switchToSUI,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error("useStatus must be used within a StatusProvider");
  }
  return context;
}
