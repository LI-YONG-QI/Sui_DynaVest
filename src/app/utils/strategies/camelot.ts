import { Address } from "viem";
import { arbitrum } from "viem/chains";

import { BaseStrategy } from "./base";
import { CAMELOT_CONTRACTS } from "../constants/protocols/camelot";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/providers/config";
import { CAMELOT_STRATEGY_ABI } from "@/app/abis/camelotStrategy";
import { GRAIL, WETH } from "../constants/coins";
// import { xGRAIL } from "../constants/coins";

type CamelotSupportedChains = typeof arbitrum.id;

export class CamelotStrategy extends BaseStrategy<CamelotSupportedChains> {
  public readonly yakRouter: Address;
  public readonly dividendsV2: Address;
  public readonly camelotStrategy: Address;

  constructor(chainId: number) {
    super(chainId);

    this.yakRouter = CAMELOT_CONTRACTS[this.chainId].yakRouter;
    this.dividendsV2 = CAMELOT_CONTRACTS[this.chainId].dividendsV2;
    this.camelotStrategy = CAMELOT_CONTRACTS[this.chainId].camelotStrategy;
  }

  async execute(
    user: Address,
    asset: Address | null,
    amount: bigint
  ): Promise<string> {
    if (asset == null) {
      const grail = GRAIL.chains![this.chainId];
      //   const xGrail = xGRAIL.chains![this.chainId];
      const weth = WETH.chains![this.chainId];

      const pair = "0xf82105aA473560CfBF8Cbc6Fd83dB14Eb4028117";
      const adapter = "0x610934febc44be225adecd888eaf7dff3b0bc050";

      const result = await writeContract(wagmiConfig, {
        address: this.camelotStrategy,
        abi: CAMELOT_STRATEGY_ABI,
        functionName: "swapETHToXGrail",
        args: [
          {
            amountIn: amount,
            amountOut: BigInt(0),
            path: [weth, grail],
            adapters: [adapter],
            recipients: [pair],
          },
          user,
        ],
        value: amount,
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash: result,
      });

      return result;
    } else {
      throw new Error("ERC20 is not supported yet");
    }
  }

  isSupported(chainId: number): boolean {
    return chainId === arbitrum.id;
  }
}
