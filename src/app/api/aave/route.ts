import { NextRequest, NextResponse } from "next/server";

import { AaveV3Strategy } from "@/server/aave";
import type { AaveParams } from "@/classes/strategies/aave";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AaveParams;

  const aave = new AaveV3Strategy(body.chainId);

  const calls = await aave.buildCalls(
    body.user,
    body.asset,
    BigInt(body.amount),
    BigInt(body.deadline),
    body.signature
  );

  const result = await aave.multiCall(body.user, calls);

  return NextResponse.json(result);
}
