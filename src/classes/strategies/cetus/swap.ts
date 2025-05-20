import { CETUS_CONTRACTS } from "@/constants/protocols/cetus";
import { SuiBaseStrategy } from "../base";
import { Transaction } from "@mysten/sui/transactions";
import { Address } from "viem";
import { cetusAggregatorClient, suiClient } from "@/utils/sui";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import BN from "bn.js";
import { getInputCoins } from "bucket-protocol-sdk";

export class CetusSwap extends SuiBaseStrategy<typeof CETUS_CONTRACTS> {
  constructor(chainId: number) {
    super(chainId, CETUS_CONTRACTS, {
      protocol: "Cetus",
      icon: "/crypto-icons/morpho.svg",
      type: "Trading",
      description: "Swap token on Cetus",
    });
  }

  async buildCalls(
    amount: bigint,
    user: Address,
    asset?: Address,
  ): Promise<Transaction> {
    const tx = new Transaction();

    const from = SUI_TYPE_ARG;
    const target =
      "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";

    const routers = await cetusAggregatorClient.findRouters({
      from,
      target,
      amount: new BN(amount.toString()),
      byAmountIn: true, // true means fix input amount, false means fix output amount
    });

    if (!routers) throw Error("fail to acquire the routers");

    const inputCoin = await getInputCoins(
      tx as any,
      suiClient as any,
      user,
      SUI_TYPE_ARG,
      amount.toString(),
    );
    const swappedCoin = await cetusAggregatorClient.routerSwap({
      routers,
      txb: tx,
      inputCoin,
      slippage: 0.01,
    });

    tx.transferObjects([swappedCoin], user);

    return tx;
  }
}
