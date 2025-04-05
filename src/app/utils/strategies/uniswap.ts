import { Address } from "viem";
import { BaseStrategy } from "./base";

export class UniswapV3Strategy extends BaseStrategy {
  constructor(chainId: number) {
    super(chainId);
  }

  // These parameters will be used in the actual implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(user: Address, amount: bigint) {
    return "Success";
  }
}
