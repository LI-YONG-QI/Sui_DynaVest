import { Address } from "viem";
import { mainnet } from "viem/chains";
import { BaseStrategy } from "./base";

type UniswapSupportedChains = typeof mainnet.id;

export class UniswapV3Strategy extends BaseStrategy<UniswapSupportedChains> {
  constructor(chainId: number) {
    super(chainId);
  }

  // These parameters will be used in the actual implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(
    user: Address,
    asset: Address,
    amount: bigint
  ): Promise<string> {
    return "Success";
  }

  isSupported(chainId: number): boolean {
    return chainId === mainnet.id;
  }
}
