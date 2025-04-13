import { NextRequest, NextResponse } from "next/server";

import type { MorphoParams } from "@/app/utils/strategies/morpho";
import { MorphoSupplyingStrategy } from "@/app/server/morpho";
import { MorphoSupportedChains } from "@/app/utils/constants/protocols/morpho";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as MorphoParams;

  const { user, amount, deadline, signature, asset, chainId } = body;
  const morpho = new MorphoSupplyingStrategy(chainId as MorphoSupportedChains);

  const calls = await morpho.buildCalls(
    user,
    asset,
    BigInt(amount),
    BigInt(deadline),
    signature
  );
  const result = await morpho.multiCall(user, calls);

  return NextResponse.json(result);
}
