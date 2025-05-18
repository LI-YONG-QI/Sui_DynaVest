import { Address } from "viem";

import { Protocols } from "@/types";
import { BaseStrategy, StrategyCall } from ".";

export abstract class EVMBaseStrategy<
  T extends Protocols
> extends BaseStrategy<T> {
  abstract buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<StrategyCall[]>;
}
