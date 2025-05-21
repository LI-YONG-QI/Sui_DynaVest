import { BUCKET_CONTRACTS } from "@/constants/protocols/bucket";
import { SuiBaseStrategy } from "../base";
import { Transaction } from "@mysten/sui/transactions";
import { Address } from "viem";
import {
  BucketClient,
  CLOCK_OBJECT,
  COIN_DECIMALS,
  coinFromBalance,
  coinIntoBalance,
  COINS_TYPE_LIST,
  getInputCoins,
  ORACLE_OBJECT,
  PROTOCOL_OBJECT,
} from "bucket-protocol-sdk";
import { bucketClient, suiClient } from "@/utils/sui";

export class BucketBorrow extends SuiBaseStrategy<typeof BUCKET_CONTRACTS> {
  constructor(chainId: number) {
    super(chainId, BUCKET_CONTRACTS, {
      protocol: "Bucket",
      icon: "/crypto-icons/bucket.png",
      type: "Lending",
      description: "Lend assets to Bucket",
    });
  }

  async buildTransaction(
    tx: Transaction,
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction> {
    const bucketOperations = this.getAddress("bucketOperations");

    const suiBottleTableId =
      "0x86050d85ebdafe3bda92c36c8489d46a233f57f103672647062f72f3fe37a46d";
    // collateral: 30 SUI
    const suiCollateral = 0.3 * 10 ** COIN_DECIMALS.SUI;
    const suiPrice = await bucketClient.getPrices().then((res) => res.SUI);
    // debt: 50 BUCK
    const buckDebt = 0.5 * 10 ** COIN_DECIMALS.BUCK;
    const targetCR = ((suiPrice || 0) * suiCollateral) / buckDebt;
    const insertionPlace = await bucketClient.findInsertionPlace(
      suiBottleTableId,
      targetCR,
      1,
      COINS_TYPE_LIST.SUI
    );

    const collateralCoin = await getInputCoins(
      tx as any,
      suiClient as any,
      user,
      COINS_TYPE_LIST.SUI,
      suiCollateral.toString()
    );

    const collateralBalance = coinIntoBalance(
      tx as any,
      COINS_TYPE_LIST.SUI,
      collateralCoin
    );

    bucketClient.updateSupraOracle(tx as any, "SUI");
    const buckBalance = tx.moveCall({
      target: `${bucketOperations}::bucket_operations::high_borrow`,
      typeArguments: [COINS_TYPE_LIST.SUI],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        collateralBalance,
        tx.pure.u64(buckDebt),
        tx.pure.option("address", insertionPlace),
      ],
    });

    const buckCoin = coinFromBalance(
      tx as any,
      COINS_TYPE_LIST.BUCK,
      buckBalance
    );

    tx.transferObjects([buckCoin], user);

    return tx;
  }
}
