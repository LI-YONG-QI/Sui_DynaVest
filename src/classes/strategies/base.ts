import { KernelAccountClient } from "@zerodev/sdk";
import type { Address } from "viem";

import type {
  Protocols,
  ProtocolChains,
  ProtocolContracts,
} from "@/types/strategies";

export abstract class BaseStrategy<T extends Protocols> {
  public readonly chainId: ProtocolChains<T>;
  public readonly user: Address;

  constructor(
    chainId: number,
    public readonly kernelAccountClient: KernelAccountClient,
    public readonly protocolAddresses: T 
  ) {
    if (this.isSupported(chainId)) {
      this.chainId = chainId as ProtocolChains<T>;
    } else {
      throw new Error("Chain not supported");
    }

    if (this.kernelAccountClient.account?.address) {
      this.user = this.kernelAccountClient.account.address;
    } else {
      throw new Error("Kernel account not found");
    }
  }

  /**
   * @param asset - (optional) The asset to invest in. If asset is undefined, the strategy is for native tokens.
   */
  abstract execute(amount: bigint, asset?: Address): Promise<string>;

  isSupported(chainId: number): boolean {
    return Object.keys(this.protocolAddresses).map(Number).includes(chainId);
  }

  getAddress(contract: ProtocolContracts<T>) {
    return this.protocolAddresses[this.chainId][contract];
  }

  protected async waitForUserOp(userOp: `0x${string}`): Promise<string> {
    const { success, receipt, reason, userOpHash } =
      await this.kernelAccountClient.waitForUserOperationReceipt({
        hash: userOp,
      });

    if (success === true) {
      return receipt.transactionHash;
    } else {
      throw new Error(
        `MorphoAA: Reverted with reason: ${reason} / userOpHash: ${userOpHash} / txHash: ${receipt.transactionHash}  `
      );
    }
  }
}
