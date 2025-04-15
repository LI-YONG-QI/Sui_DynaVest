import { EXECUTOR_ABI } from "@/app/abis";
import { base, flowMainnet, celo, bsc } from "viem/chains";
import { extractChain } from "viem";
import type { Address } from "viem";

import type { Call, ExecutionResult } from "./types";
import { getAdminWallet } from "./utils";
import {
  DYNAVEST_CONTRACTS,
  DynaVestSupportedChains,
} from "@/app/utils/constants/protocols/dynaVest";
import { wagmiConfig } from "@/providers/config";

export abstract class BaseStrategy<T extends DynaVestSupportedChains> {
  public readonly executor: Address;
  public readonly chainId: T;

  constructor(chainId: T) {
    this.chainId = chainId;
    this.executor = DYNAVEST_CONTRACTS[chainId].executor;
  }

  async multiCall(user: Address, calls: Call[]): Promise<ExecutionResult> {
    const chain = extractChain({
      chains: wagmiConfig.chains,
      id: this.chainId,
    });

    const adminWallet = getAdminWallet(chain);

    const tx = await adminWallet.writeContract({
      abi: EXECUTOR_ABI,
      address: this.executor,
      functionName: "execute",
      args: [calls, user],
    });

    return {
      success: true,
      message: `Success!! Transaction Hash: ${tx}`,
    };
  }
}
