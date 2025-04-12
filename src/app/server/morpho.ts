import "server-only";

import { getAdminWallet } from "./utils";
import {
  Address,
  encodeFunctionData,
  extractChain,
  Hex,
  parseSignature,
  toHex,
} from "viem";
import { ERC20_ABI, ERC20_PERMIT_ABI, EXECUTOR_ABI, MORPHO_ABI } from "../abis";
import type { Call, ExecutionResult } from "./types";
import { DYNAVEST_CONTRACTS } from "../utils/constants/protocols/dynaVest";
import {
  MORPHO_CONTRACTS,
  MorphoSupportedChains,
} from "../utils/constants/protocols/morpho";
import { base } from "viem/chains";
import { readContract } from "@wagmi/core";
import { wagmiConfig as config } from "@/providers/config";
import { USDC } from "../utils/constants";

export class MorphoSupplyingStrategy {
  private readonly executor: Address;
  private readonly morpho: Address;

  constructor(private readonly chainId: MorphoSupportedChains) {
    this.executor = DYNAVEST_CONTRACTS[chainId].executor;
    this.morpho = MORPHO_CONTRACTS[chainId].morpho;
  }

  async buildCalls(
    user: Address,
    amount: bigint,
    deadline: bigint,
    signature: Hex
  ) {
    const calls: Call[] = [];

    const { r, s, v } = parseSignature(signature);
    const supplyAsset = USDC.chains![base.id]; // TODO: mock usdc address

    //* Step 1  USDC Permit
    {
      const data = encodeFunctionData({
        abi: ERC20_PERMIT_ABI,
        functionName: "permit",
        args: [user, this.executor, amount, deadline, Number(v), r, s],
      });
      calls.push({
        target: supplyAsset,
        callData: data,
      });
    }

    //* Step 2  USDC Transfer to Executor
    {
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transferFrom",
        args: [user, this.executor, amount],
      });
      calls.push({
        target: supplyAsset,
        callData: data,
      });
    }

    //* Step 3 Approve to morpho blue
    {
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "approve",
        args: [this.morpho, amount],
      });
      calls.push({
        target: supplyAsset,
        callData: data,
      });
    }

    //* Step 4  Supply USDC to morpho blue
    {
      const wethUsdcMarket =
        "0x8793cf302b8ffd655ab97bd1c695dbd967807e8367a65cb2f4edaf1380ba1bda"; // TODO: mock market id
      const marketParams = await this.getMarketParams(wethUsdcMarket);

      const data = encodeFunctionData({
        abi: MORPHO_ABI,
        functionName: "supply",
        args: [marketParams, amount, BigInt(0), user, toHex("")],
      });
      calls.push({
        target: this.morpho,
        callData: data,
      });
    }

    return calls;
  }

  async multiCall(user: Address, calls: Call[]): Promise<ExecutionResult> {
    const chain = extractChain({ chains: [base], id: this.chainId });
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

  private async getMarketParams(marketId: Hex) {
    const [loanToken, collateralToken, oracle, irm, lltv] = await readContract(
      config,
      {
        chainId: this.chainId,
        abi: MORPHO_ABI,
        address: this.morpho,
        functionName: "idToMarketParams",
        args: [marketId],
      }
    );

    return {
      loanToken,
      collateralToken,
      oracle,
      irm,
      lltv,
    };
  }
}
