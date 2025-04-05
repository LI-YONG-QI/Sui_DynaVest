export * from "./aave";

import type { AaveSupportedChains } from "./aave";
import { AaveV3Strategy } from "./aave";

export function getStrategy(protocol: string, chainId: number) {
  switch (protocol) {
    case "AAVE":
      // TODO: can't infer type of chainId
      return new AaveV3Strategy(chainId as AaveSupportedChains);
    default:
      throw new Error("Unsupported protocol");
  }
}
