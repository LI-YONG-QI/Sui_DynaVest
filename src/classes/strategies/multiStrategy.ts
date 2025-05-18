import { Address } from "viem";

import { EVMBaseStrategy, StrategyCall } from "./base";
import { Protocols } from "@/types";

/**
 * MultiStrategy allows combining multiple strategies of different types
 * that all implement the StrategyInterface
 */
export class MultiStrategy {
  constructor(
    public readonly strategies: {
      strategy: EVMBaseStrategy<Protocols>;
      allocation: number;
    }[]
  ) {}

  async buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<StrategyCall[]> {
    const allCalls: StrategyCall[] = [];

    for (const strategy of this.strategies) {
      const calls = await strategy.strategy.buildCalls(
        (amount * BigInt(strategy.allocation)) / BigInt(100),
        user,
        asset
      );
      allCalls.push(...calls);
    }

    return allCalls;
  }
}
