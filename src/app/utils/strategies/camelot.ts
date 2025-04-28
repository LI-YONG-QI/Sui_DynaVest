import { Address } from "viem";
import { arbitrum } from "viem/chains";
import { writeContract, readContract } from "@wagmi/core";

import { BaseStrategy } from "./base";
import { CAMELOT_CONTRACTS } from "../constants/protocols";
import { GRAIL, WETH, xGRAIL } from "../constants/coins";
import { wagmiConfig } from "@/providers/config";
import { ERC20_ABI, XGRAIL_ABI, CAMELOT_STRATEGY_ABI } from "@/app/abis";

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
      const xGrail = xGRAIL.chains![this.chainId];
      const weth = WETH.chains![this.chainId];

      const pair = "0xf82105aA473560CfBF8Cbc6Fd83dB14Eb4028117"; // TODO: hardcode
      const adapter = "0x610934febc44be225adecd888eaf7dff3b0bc050"; // TODO: hardcode

      await this.executeWaitTx(() =>
        writeContract(wagmiConfig, {
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
        })
      );

      const xGRAILBalance = await readContract(wagmiConfig, {
        address: xGrail,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [user],
      });

      await this.executeWaitTx(() =>
        writeContract(wagmiConfig, {
          address: xGrail,
          abi: XGRAIL_ABI,
          functionName: "approveUsage",
          args: [this.dividendsV2, xGRAILBalance],
        })
      );

      const allocateTx = await this.executeWaitTx(() =>
        writeContract(wagmiConfig, {
          address: xGrail,
          abi: XGRAIL_ABI,
          functionName: "allocate",
          args: [this.dividendsV2, xGRAILBalance, "0x"],
        })
      );

      return allocateTx;
    } else {
      throw new Error("ERC20 is not supported yet");
    }
  }

  isSupported(chainId: number): boolean {
    return chainId === arbitrum.id;
  }
}
