/* eslint-disable */

import { BUCKET_CONTRACTS } from "@/constants/protocols/bucket";
import { SuiBaseStrategy } from "../base";
import { Transaction } from "@mysten/sui/transactions";
import { Address } from "viem";
import { suiClient } from "@/utils/sui";
import { getInputCoins } from "bucket-protocol-sdk";
import { SuiClient } from "@mysten/sui/client";

export class BucketStakeBut extends SuiBaseStrategy<typeof BUCKET_CONTRACTS> {
  constructor(chainId: number) {
    super(chainId, BUCKET_CONTRACTS, {
      protocol: "Bucket",
      icon: "/crypto-icons/bucket.png",
      type: "Staking",
      description: "Stake BUT to earn rewards",
    });
  }

  async buildTransaction(
    tx: Transaction,
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction> {
    // const
    const deTokenPackage = this.getAddress("deToken");
    const buTTokenType = this.getAddress("butCoinType");
    const bucketProtocolType = this.getAddress("bucketProtocolType");

    // sharedObjectRef
    const deCenterObjectRef = {
      objectId:
        "0xaa5eaa8381b1efb7ccc5f60848a165ef9c3d206de9b7e9dd9313ef6b1ff6b464",
      mutable: true,
      initialSharedVersion: 469686337,
    };

    const butCoin = await getInputCoins(
      tx as any,
      suiClient as any,
      user,
      buTTokenType,
      amount.toString() // AMOUNT
    );

    const duration = 86400 * 7 * 1000;
    const [deToken, response] = tx.moveCall({
      target: `${deTokenPackage}::de_center::lock`,
      typeArguments: [buTTokenType, bucketProtocolType],
      arguments: [
        tx.sharedObjectRef(deCenterObjectRef),
        butCoin,
        tx.pure.u64(duration),
        tx.pure.bool(false),
        tx.object.clock(),
      ],
    });

    tx.transferObjects([deToken], user);

    tx.moveCall({
      target: `${deTokenPackage}::de_center::fulfill_response`,
      typeArguments: [buTTokenType, bucketProtocolType],
      arguments: [response, tx.sharedObjectRef(deCenterObjectRef)],
    });

    return tx;
  }
}
