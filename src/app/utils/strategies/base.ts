import { Address } from "viem";

export class BaseStrategy {
  constructor(public readonly chainId: number) {}

  async execute(user: Address, amount: bigint) {}
}
