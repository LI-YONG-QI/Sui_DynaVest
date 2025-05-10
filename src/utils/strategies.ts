import { KernelAccountClient } from "@zerodev/sdk";
import { Address } from "viem";

import { Protocol, Protocols } from "@/types";
import { PERMIT_EXPIRY } from "@/constants";
import {
  AaveV3Strategy,
  BaseStrategy,
  AnkrFlowStrategy,
  FlowStrategy,
  KittyStrategy,
  StCeloStrategy,
  MorphoSupplyingStrategy,
  UniswapV3Strategy,
  BscAaveV3Strategy,
  LSTStrategy,
  BscLstStrategy,
  CamelotStrategy,
  GMXStrategy,
  MorphoSupply,
} from "@/classes/strategies";

export function getDeadline(): bigint {
  const timestampInSeconds = Math.floor(Date.now() / 1000);
  return BigInt(timestampInSeconds) + BigInt(PERMIT_EXPIRY);
}

export function getStrategy(
  protocol: Protocol,
  chainId: number,
  kernelAccountClient: KernelAccountClient
): BaseStrategy<Protocols> {
  // The type casting here is safe because we've already verified the chainId is supported
  // for the specific protocol with isChainIdSupported
  switch (protocol) {
    case "MorphoSupply":
      return new MorphoSupply(chainId, kernelAccountClient);
    default:
      throw new Error("Unsupported protocol");
  }
}
