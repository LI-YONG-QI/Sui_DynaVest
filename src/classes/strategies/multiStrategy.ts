import { Address } from "viem";
import { BaseStrategy, StrategyCall } from "./baseStrategy";
import { MorphoSupply } from "./morpho/supply";
import { AaveV3Supply } from "./aave/supply";
import { Protocols } from "@/types";

/**
 * MultiStrategy allows combining multiple strategies of different types
 * that all implement the StrategyInterface
 */
export class MultiStrategy {
  constructor(public readonly strategies: BaseStrategy<Protocols>[]) {}

  async buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<StrategyCall[]> {
    const allCalls: StrategyCall[] = [];

    for (const strategy of this.strategies) {
      const calls = await strategy.buildCalls(amount, user, asset);
      allCalls.push(...calls);
    }

    return allCalls;
  }
}

/**
 * Create a multi-strategy with MorphoSupply and AaveV3Supply on Ethereum
 */
export const createMultiStrategy = (): MultiStrategy => {
  return new MultiStrategy([
    new MorphoSupply(1), // Ethereum
    new AaveV3Supply(1), // Ethereum
  ]);
};
