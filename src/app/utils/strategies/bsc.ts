import { bsc } from "viem/chains";
import { BaseStrategy } from "./base";
import { Address } from "viem";
import { DYNAVEST_CONTRACTS } from "../constants/protocols/dynaVest";
import { AAVE_CONTRACTS } from "../constants/protocols/aave";
import { wagmiConfig as config } from "@/providers/config";
import { AAVE_V3_ABI, ERC20_ABI } from "@/app/abis";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

export class BscAaveV3Strategy extends BaseStrategy<typeof bsc.id> {
  public readonly executor: Address;
  public readonly pool: Address;

  constructor(chainId: typeof bsc.id) {
    super(chainId);

    this.executor = DYNAVEST_CONTRACTS[chainId].executor;
    this.pool = AAVE_CONTRACTS[chainId].pool;
  }

  async execute(user: Address, asset: Address, amount: bigint) {
    const approveTx = await writeContract(config, {
      abi: ERC20_ABI,
      address: asset,
      functionName: "approve",
      args: [this.pool, amount],
    });

    await waitForTransactionReceipt(config, {
      hash: approveTx,
    });

    const supplyTx = await writeContract(config, {
      abi: AAVE_V3_ABI,
      address: this.pool,
      functionName: "supply",
      args: [asset, amount, user, 0],
    });

    await waitForTransactionReceipt(config, {
      hash: supplyTx,
    });

    return supplyTx;
  }

  isSupported(chainId: number): boolean {
    return chainId === bsc.id;
  }
}
