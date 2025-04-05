import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";
import {
  createWalletClient,
  http,
  encodeFunctionData,
  parseSignature,
} from "viem";
import type { Address, Hex } from "viem";
import { celo } from "viem/chains";
import {
  ERC20_PERMIT_ABI,
  EXECUTOR_ABI,
  ERC20_ABI,
  AAVE_V3_ABI,
} from "@/app/abis";

import { ALCHEMY_API_KEY } from "@/providers/config";

// TODO: store address by chain config
const EXECUTOR_ADDRESS = "0x2A386Fb9e19D201A1dAF875fcD5c934c06265b65";
const cEUR = "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73";
const POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";

// TODO: update types
interface RequestParams {
  user: Address;
  amount: string;
  deadline: string;
  signature: Hex;
}

interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  message?: string;
}

interface Call {
  target: Address;
  callData: Hex;
}

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestParams;

  const calls = await createAaveCalls(
    body.user,
    BigInt(body.amount),
    BigInt(body.deadline),
    body.signature
  );

  console.log(body);
  console.log(calls);

  const result = await multiCall(body.user, calls);

  return NextResponse.json(result);
}

function getAdminWallet() {
  const account = privateKeyToAccount(
    process.env.ADMIN_PRIVATE_KEY as `0x${string}`
  );

  return createWalletClient({
    chain: celo, // TODO: replace with dynamic chain
    transport: http(`https://celo-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    account,
  });
}

async function multiCall(
  user: Address,
  calls: Call[]
): Promise<ExecutionResult> {
  const adminWallet = getAdminWallet();

  const tx = await adminWallet.writeContract({
    abi: EXECUTOR_ABI,
    address: EXECUTOR_ADDRESS,
    functionName: "execute",
    args: [calls, user],
  });

  return {
    success: true,
    message: `Success!! Transaction Hash: ${tx}`,
  };
}

async function createAaveCalls(
  user: Address,
  amount: bigint,
  deadline: bigint,
  signature: Hex
) {
  const calls: Call[] = [];

  const { r, s, v } = parseSignature(signature);

  //* Step 1 Permit
  {
    const data = encodeFunctionData({
      abi: ERC20_PERMIT_ABI,
      functionName: "permit",
      args: [user, EXECUTOR_ADDRESS, amount, deadline, Number(v), r, s],
    });
    calls.push({
      target: cEUR,
      callData: data,
    });
  }

  console.log(amount);

  //* Step 2  Transfer asset to Executor
  {
    const data = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "transferFrom",
      args: [user, EXECUTOR_ADDRESS, BigInt(1)],
    });
    calls.push({
      target: cEUR,
      callData: data,
    });
  }

  //* Step 3 Approve to morpho blue
  {
    const data = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "approve",
      args: [POOL, amount],
    });
    calls.push({
      target: cEUR,
      callData: data,
    });
  }

  //* Step 4  Supply USDC to morpho blue
  const data = encodeFunctionData({
    abi: AAVE_V3_ABI,
    functionName: "supply",
    args: [cEUR, amount, user, 0],
  });
  calls.push({
    target: POOL,
    callData: data,
  });

  return calls;
}
