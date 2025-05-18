import { Address } from "viem";
import { Transaction } from "@mysten/sui/transactions";

import { Protocols } from "@/types";
import { BaseStrategy } from ".";

export abstract class SuiBaseStrategy<
  T extends Protocols
> extends BaseStrategy<T> {
  abstract buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction>;
}
