import { NextRequest, NextResponse } from "next/server";
import type { Address, Hex } from "viem";
import { celo } from "viem/chains";

import { AaveV3Strategy } from "@/app/server/aave";

// TODO: update types
interface RequestParams {
  user: Address;
  amount: string;
  deadline: string;
  signature: Hex;
}

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestParams;

  const aave = new AaveV3Strategy(celo.id);

  const calls = await aave.buildCalls(
    body.user,
    BigInt(body.amount),
    BigInt(body.deadline),
    body.signature
  );

  const result = await aave.multiCall(body.user, calls);

  return NextResponse.json(result);
}

// async function multiCall(
//   user: Address,
//   calls: Call[]
// ): Promise<ExecutionResult> {
//   const adminWallet = getAdminWallet();

//   const tx = await adminWallet.writeContract({
//     abi: EXECUTOR_ABI,
//     address: EXECUTOR_ADDRESS,
//     functionName: "execute",
//     args: [calls, user],
//   });

//   return {
//     success: true,
//     message: `Success!! Transaction Hash: ${tx}`,
//   };
// }

// async function createAaveCalls(
//   user: Address,
//   amount: bigint,
//   deadline: bigint,
//   signature: Hex
// ) {
//   const calls: Call[] = [];

//   const { r, s, v } = parseSignature(signature);

//   //* Step 1 Permit
//   {
//     const data = encodeFunctionData({
//       abi: ERC20_PERMIT_ABI,
//       functionName: "permit",
//       args: [user, EXECUTOR_ADDRESS, amount, deadline, Number(v), r, s],
//     });
//     calls.push({
//       target: cEUR,
//       callData: data,
//     });
//   }

//   //* Step 2  Transfer asset to Executor
//   {
//     const data = encodeFunctionData({
//       abi: ERC20_ABI,
//       functionName: "transferFrom",
//       args: [user, EXECUTOR_ADDRESS, BigInt(1)],
//     });
//     calls.push({
//       target: cEUR,
//       callData: data,
//     });
//   }

//   //* Step 3 Approve to morpho blue
//   {
//     const data = encodeFunctionData({
//       abi: ERC20_ABI,
//       functionName: "approve",
//       args: [POOL, amount],
//     });
//     calls.push({
//       target: cEUR,
//       callData: data,
//     });
//   }

//   //* Step 4  Supply USDC to morpho blue
//   const data = encodeFunctionData({
//     abi: AAVE_V3_ABI,
//     functionName: "supply",
//     args: [cEUR, amount, user, 0],
//   });
//   calls.push({
//     target: POOL,
//     callData: data,
//   });

//   return calls;
// }
