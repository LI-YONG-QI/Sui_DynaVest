"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";
import { ERC20_ABI, USDC } from "@/constants";
import { base } from "viem/chains";
import useCurrency from "@/hooks/useCurrency";

const Dev = () => {
  const { client } = useSmartWallets();
  const { user, authenticated } = usePrivy();
  const { balance } = useCurrency([USDC]);

  console.log(user);
  console.log(authenticated);

  console.log(balance);

  async function sendCalls() {
    console.log(client);
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
