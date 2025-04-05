import { BaseStrategy } from "./base";

export class UniswapV3Strategy extends BaseStrategy {
  constructor(chainId: number) {
    super(chainId);
  }

  async execute(user: Address, amount: bigint) {
    return "Success";
  }
}
