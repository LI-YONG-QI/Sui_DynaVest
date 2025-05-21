import { Address } from "viem";
import { Transaction } from "@mysten/sui/transactions";

import { SuiBaseStrategy } from "./base";
import { Protocols } from "@/types";

export class MultiSuiStrategy {
  constructor(
    public readonly strategies: {
      strategy: SuiBaseStrategy<Protocols>;
      allocation: number;
    }[]
  ) {}

  async buildTransaction(
    tx: Transaction,
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction> {
    for (const strategy of this.strategies) {
      tx = await strategy.strategy.buildTransaction(tx, amount, user, asset);
    }

    return tx;
  }
}
