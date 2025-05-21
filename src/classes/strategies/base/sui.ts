import { Address } from "viem";
import { Transaction } from "@mysten/sui/transactions";

import { Protocols } from "@/types";
import { BaseStrategy } from ".";

export abstract class SuiBaseStrategy<
  T extends Protocols
> extends BaseStrategy<T> {
  buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction> {
    console.log("buildCalls", amount, user, asset);
    throw new Error("Not implemented");
  }

  abstract buildTransaction(
    tx: Transaction,
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction>;
}
