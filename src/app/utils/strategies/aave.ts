import { signTypedData } from "@wagmi/core";
import type { Address, Hex } from "viem";
import { readContract } from "@wagmi/core";

import { wagmiConfig as config } from "@/providers/config";
import { ERC20_ABI, ERC20_PERMIT_ABI } from "@/app/abis";
import { PERMIT_TYPES } from "@/app/utils/types";
import { PERMIT_EXPIRY } from "../constants";
import { BaseStrategy } from "./base";

interface SupplyParams {
  user: Address;
  amount: string;
  deadline: string;
  signature: Hex;
}

export type AaveSupportedChains = 42220;

const AAVE_STRATEGY_CONTRACTS: Record<
  AaveSupportedChains,
  {
    executor: Address;
    supplyAssets: Address;
  }
> = {
  42220: {
    executor: "0x2A386Fb9e19D201A1dAF875fcD5c934c06265b65",
    supplyAssets: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  },
};

export class AaveV3Strategy extends BaseStrategy {
  public executor: Address;
  public supplyAsset: Address;
  public permitExpiry: number;

  constructor(chainId: AaveSupportedChains) {
    super(chainId);

    this.executor = AAVE_STRATEGY_CONTRACTS[chainId].executor;
    this.supplyAsset = AAVE_STRATEGY_CONTRACTS[chainId].supplyAssets;
    this.permitExpiry = PERMIT_EXPIRY;
  }

  async execute(user: Address, amount: bigint) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(timestampInSeconds) + BigInt(PERMIT_EXPIRY);

    const nonce = await readContract(config, {
      abi: ERC20_PERMIT_ABI,
      address: this.supplyAsset,
      functionName: "nonces",
      args: [user!],
    });

    const symbol = await readContract(config, {
      abi: ERC20_ABI,
      address: this.supplyAsset,
      functionName: "symbol",
    });

    const signature = await signTypedData(config, {
      domain: {
        name: symbol,
        chainId: this.chainId,
        verifyingContract: this.supplyAsset,
        version: "1",
      },
      types: PERMIT_TYPES,
      primaryType: "Permit",
      message: {
        owner: user,
        spender: this.executor,
        value: amount,
        nonce: nonce,
        deadline,
      },
    });

    const body: SupplyParams = {
      user,
      amount: amount.toString(),
      deadline: deadline.toString(),
      signature,
    };

    const response = await fetch("/api/aave", {
      method: "POST",
      body: JSON.stringify(body),
    });

    console.log(await response.json());
  }
}
