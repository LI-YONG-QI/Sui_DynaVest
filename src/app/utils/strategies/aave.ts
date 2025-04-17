import { signTypedData } from "@wagmi/core";
import type { Address, Hex } from "viem";
import { readContract } from "@wagmi/core";

import { wagmiConfig as config } from "@/providers/config";
import { ERC20_PERMIT_ABI } from "@/app/abis";
import { PERMIT_TYPES } from "@/app/utils/types";
import { PERMIT_EXPIRY } from "../constants";
import { BaseStrategy } from "./base";
import {
  AAVE_CONTRACTS,
  AaveSupportedChains,
  DYNAVEST_CONTRACTS,
} from "../constants/protocols/";

export interface AaveParams {
  chainId: AaveSupportedChains;
  user: Address;
  asset: Address;
  amount: string;
  deadline: string;
  signature: Hex;
}

export class AaveV3Strategy extends BaseStrategy<AaveSupportedChains> {
  public executor: Address;
  public permitExpiry: number;

  constructor(chainId: number) {
    super(chainId);

    this.executor = DYNAVEST_CONTRACTS[this.chainId].executor;
    this.permitExpiry = PERMIT_EXPIRY;
  }

  async execute(user: Address, asset: Address, amount: bigint) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(timestampInSeconds) + BigInt(PERMIT_EXPIRY);

    console.log("hello");

    const nonce = await readContract(config, {
      abi: ERC20_PERMIT_ABI,
      address: asset,
      functionName: "nonces",
      args: [user!],
    });

    // TODO: only USDC is supported (solution: Permit2)
    const signature = await signTypedData(config, {
      domain: {
        name: "USD Coin",
        chainId: this.chainId,
        verifyingContract: asset,
        version: "2",
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

    const body: AaveParams = {
      chainId: this.chainId,
      user,
      asset,
      amount: amount.toString(),
      deadline: deadline.toString(),
      signature,
    };

    const response = await fetch("/api/aave", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await response.json();
    return res.message;
  }

  isSupported(chainId: number): boolean {
    return Object.keys(AAVE_CONTRACTS).map(Number).includes(chainId);
  }
}
