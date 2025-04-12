import { EXECUTOR_ABI } from "@/app/abis";
import { base, flowMainnet, celo } from "viem/chains";
import { extractChain } from "viem";
import type { Address } from "viem";

import type { Call, ExecutionResult } from "./types";
import { getAdminWallet } from "./utils";
import {
  DYNAVEST_CONTRACTS,
  DynaVestSupportedChains,
} from "@/app/utils/constants/protocols/dynaVest";

export class BaseStrategy {
  public readonly executor: Address;

  constructor(public readonly chainId: DynaVestSupportedChains) {
    this.executor = DYNAVEST_CONTRACTS[chainId].executor;
  }

  async multiCall(user: Address, calls: Call[]): Promise<ExecutionResult> {
    const chain = extractChain({
      chains: [base, celo, flowMainnet], // TODO: bound chain with constants
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
