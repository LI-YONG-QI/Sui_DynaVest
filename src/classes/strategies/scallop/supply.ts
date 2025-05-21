/* eslint-disable */

import { SCALLOP_CONTRACTS } from "@/constants/protocols/scallop";
import { SuiBaseStrategy } from "../base";
import { Address } from "web3";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { COIN_DECIMALS, getInputCoins } from "bucket-protocol-sdk";
import { suiClient } from "@/utils/sui";

export class ScallopSupply extends SuiBaseStrategy<typeof SCALLOP_CONTRACTS> {
  constructor(chainId: number) {
    super(chainId, SCALLOP_CONTRACTS, {
      protocol: "Scallop",
      icon: "/crypto-icons/scallop.png",
      type: "Lending",
      description: "Lend assets to Scallop",
    });
  }

  async buildTransaction(
    tx: Transaction,
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction> {
    const scallopCorePackage = this.getAddress("scallop");
    const convertorPackage = this.getAddress("sCoinConvertor");

    // sharedObjectRef
    const versionObjectRef = {
      objectId:
        "0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7",
      mutable: false,
      initialSharedVersion: 7765848,
    };
    const marketObjectRef = {
      objectId:
        "0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9",
      mutable: true,
      initialSharedVersion: 7765848,
    };

    const sSUICoinTreasury = {
      objectId:
        "0x5c1678c8261ac9eec024d4d630006a9f55c80dc0b1aa38a003fcb1d425818c6b",
      mutable: true,
      initialSharedVersion: 269859631,
    };

    const suiCoin = await getInputCoins(
      tx as any,
      suiClient as any,
      user,
      SUI_TYPE_ARG,
      amount.toString()
    );

    const marketCoin = tx.moveCall({
      target: `${scallopCorePackage}::mint::mint`,
      typeArguments: [SUI_TYPE_ARG],
      arguments: [
        tx.sharedObjectRef(versionObjectRef),
        tx.sharedObjectRef(marketObjectRef),
        suiCoin,
        tx.object.clock(),
      ],
    });

    const sCOIN = tx.moveCall({
      target: `${convertorPackage}::s_coin_converter::mint_s_coin`,
      typeArguments: [
        "0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI",
        SUI_TYPE_ARG,
      ],
      arguments: [tx.sharedObjectRef(sSUICoinTreasury), marketCoin],
    });

    tx.transferObjects([sCOIN], user);

    return tx;
  }
}
