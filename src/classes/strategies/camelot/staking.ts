import { Address, encodeFunctionData } from "viem";
import { readContract } from "@wagmi/core";
import { KernelAccountClient } from "@zerodev/sdk";

import { BaseStrategy } from "../baseStrategy";
import { CAMELOT_CONTRACTS } from "@/constants/protocols";
import { ERC20_ABI, XGRAIL_ABI, CAMELOT_STRATEGY_ABI } from "@/constants/abis";
import { GRAIL, WETH, xGRAIL } from "@/constants/coins";
import { wagmiConfig } from "@/providers/config";

export class CamelotStaking extends BaseStrategy<typeof CAMELOT_CONTRACTS> {
  constructor(chainId: number, kernelAccountClient: KernelAccountClient) {
    super(chainId, kernelAccountClient, CAMELOT_CONTRACTS);
  }

  async execute(amount: bigint, asset?: Address): Promise<string> {
    if (!asset) {
      const grail = GRAIL.chains![this.chainId as keyof typeof GRAIL.chains];
      const xGrail = xGRAIL.chains![this.chainId as keyof typeof xGRAIL.chains];
      const weth = WETH.chains![this.chainId as keyof typeof WETH.chains];

      const pair = "0xf82105aA473560CfBF8Cbc6Fd83dB14Eb4028117"; // TODO: hardcode
      const adapter = "0x610934febc44be225adecd888eaf7dff3b0bc050"; // TODO: hardcode
      const camelotStrategy = this.getAddress("camelotStrategy");
      const dividendsV2 = this.getAddress("dividendsV2");

      // Step 1: Swap ETH to xGrail
      const userOp = await this.kernelAccountClient.sendUserOperation({
        calls: [
          {
            to: camelotStrategy,
            value: amount,
            data: encodeFunctionData({
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
                this.user,
              ],
            }),
          },
        ],
      });

      await this.waitForUserOp(userOp);

      // Get xGRAIL balance
      const xGRAILBalance = (await readContract(wagmiConfig, {
        address: xGrail,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [this.user],
      })) as bigint;

      // Step 2: Approve usage and allocate
      const allocateOp = await this.kernelAccountClient.sendUserOperation({
        calls: [
          {
            to: xGrail,
            data: encodeFunctionData({
              abi: XGRAIL_ABI,
              functionName: "approveUsage",
              args: [dividendsV2, xGRAILBalance],
            }),
          },
          {
            to: xGrail,
            data: encodeFunctionData({
              abi: XGRAIL_ABI,
              functionName: "allocate",
              args: [dividendsV2, xGRAILBalance, "0x"],
            }),
          },
        ],
      });

      return this.waitForUserOp(allocateOp);
    } else {
      throw new Error("CamelotStaking: ERC20 doesn't support yet");
    }
  }
}
