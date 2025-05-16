"use client";

import React, { useEffect } from "react";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { toast } from "react-toastify";

import { CELO, ERC20_ABI, USDC } from "@/constants";
import useCurrency from "@/hooks/useCurrency";

const Dev = () => {
  const { client } = useSmartWallets();
  const { isError, error, isLoadingError } = useCurrency(CELO);

  console.log(isError, isLoadingError);

  useEffect(() => {
    if (isError && isLoadingError) {
      toast.error("Error fetching balance");
    }
  }, [isError, error, isLoadingError]);

  async function sendCalls() {
    await client!.sendTransaction({
      calls: [
        // Approve transaction
        {
          to: USDC.chains![base.id],
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: ["0x80dAdeBda19E5C010c4417985a4c05d0a8008A81", BigInt(1e6)],
          }),
        },
        // Transfer transaction
        {
          to: USDC.chains![base.id],
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: ["0x80dAdeBda19E5C010c4417985a4c05d0a8008A81", BigInt(1e6)],
          }),
        },
      ],
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={sendCalls}> Send Calls </button>
    </div>
  );
};

export default Dev;
