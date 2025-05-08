import "server-only";

import { createWalletClient } from "viem";
import type { Address, Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "wagmi";

import { EXECUTOR_ABI } from "@/constants/abis";
import type { ExecutionResult, Call } from "./types";

export function getAdminWallet(chain: Chain) {
  const account = privateKeyToAccount(
    process.env.ADMIN_PRIVATE_KEY as `0x${string}`
  );

  return createWalletClient({
    chain: chain,
    transport: http(),
    account,
  });
}

export async function multiCall(
  user: Address,
  executor: Address,
  calls: Call[],
  chain: Chain
): Promise<ExecutionResult> {
  const adminWallet = getAdminWallet(chain);

  const tx = await adminWallet.writeContract({
    abi: EXECUTOR_ABI,
    address: executor,
    functionName: "execute",
    args: [calls, user],
  });

  return {
    success: true,
    message: `Success!! Transaction Hash: ${tx}`,
  };
}
