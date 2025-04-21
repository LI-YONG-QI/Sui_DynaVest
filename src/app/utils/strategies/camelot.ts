import { Address } from "viem";
import { arbitrum } from "viem/chains";

import { BaseStrategy } from "./base";
import { CAMELOT_CONTRACTS } from "../constants/protocols/camelot";
import {
  waitForTransactionReceipt,
  writeContract,
  readContract,
} from "@wagmi/core";
import { wagmiConfig } from "@/providers/config";
import { CAMELOT_STRATEGY_ABI } from "@/app/abis/camelotStrategy";
import { GRAIL, WETH, xGRAIL } from "../constants/coins";
import { ERC20_ABI } from "@/app/abis/erc20";
import { XGRAIL_ABI } from "@/app/abis/xGrail";

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

      const pair = "0xf82105aA473560CfBF8Cbc6Fd83dB14Eb4028117";
      const adapter = "0x610934febc44be225adecd888eaf7dff3b0bc050";

      const result = await writeContract(wagmiConfig, {
        address: this.camelotStrategy,
        abi: CAMELOT_STRATEGY_ABI,
        functionName: "swapETHToXGrail",
        args: [
          {
            amountIn: amount,
            amountOut: BigInt(0), // TODO: amountOut limit
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

      const xGRAILBalance = await readContract(wagmiConfig, {
        address: xGrail,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [user],
      });

      const approveTx = await writeContract(wagmiConfig, {
        address: xGrail,
        abi: XGRAIL_ABI,
        functionName: "approveUsage",
        args: [this.dividendsV2, xGRAILBalance],
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash: approveTx,
      });

      const allocateTx = await writeContract(wagmiConfig, {
        address: xGrail,
        abi: XGRAIL_ABI,
        functionName: "allocate",
        args: [this.dividendsV2, xGRAILBalance, "0x"],
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash: allocateTx,
      });

      return allocateTx;
    } else {
      throw new Error("ERC20 is not supported yet");
    }
  }

  isSupported(chainId: number): boolean {
    return chainId === arbitrum.id;
  }
}
