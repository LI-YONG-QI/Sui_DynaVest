export * from "./aave";

import type { AaveSupportedChains } from "./aave";
import { AaveV3Strategy } from "./aave";
import { StCeloStrategy } from "./stCelo";

export function getStrategy(protocol: string, chainId: number) {
  switch (protocol) {
    case "AAVE":
      // TODO: can't infer type of chainId
      return new AaveV3Strategy(chainId as AaveSupportedChains);
    case "stCelo":
      return new StCeloStrategy(chainId);
    default:
      throw new Error("Unsupported protocol");
  }
}
