import { BUCKET_CONTRACTS } from "@/constants/protocols/bucket";
import { SuiBaseStrategy } from "../base";
import { Transaction } from "@mysten/sui/transactions";
import { Address } from "viem";
import { getInputCoins, suiClient } from "@/utils/sui";

export class BucketStakeBut extends SuiBaseStrategy<typeof BUCKET_CONTRACTS> {
  constructor(chainId: number) {
    super(chainId, BUCKET_CONTRACTS, {
      protocol: "Bucket",
      icon: "/crypto-icons/morpho.svg",
      type: "Lending",
      description: "Lend assets to Bucket",
    });
  }

  async buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address,
  ): Promise<Transaction> {
    const tx = new Transaction();

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
      tx,
      suiClient,
      user,
      buTTokenType,
      (10 ** 9).toString(),
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
