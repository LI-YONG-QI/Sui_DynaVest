import { CETUS_CONTRACTS } from "@/constants/protocols/cetus";
import { SuiBaseStrategy } from "../base";
import { Transaction } from "@mysten/sui/transactions";
import { Address } from "viem";
import { cetusSDK } from "@/utils/sui";
import {
  AddLiquidityFixTokenParams,
  ClmmPoolUtil,
  TickMath,
} from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";

export class CetusAddLiquidity extends SuiBaseStrategy<typeof CETUS_CONTRACTS> {
  constructor(chainId: number) {
    super(chainId, CETUS_CONTRACTS, {
      protocol: "Cetus",
      icon: "/crypto-icons/cetus.svg",
      type: "Yield",
      description: "Add Liquidity to Cetus",
    });
  }

  async buildTransaction(
    tx: Transaction,
    amount: bigint,
    user: Address,
    asset?: Address
  ): Promise<Transaction> {
    cetusSDK.senderAddress = user;
    const UsdcSuiPool =
      "0xb8d7d9e66a60c239e7a60110efcf8de6c705580ed924d0dde141f4a0e2c90105";

    const pool = await cetusSDK.Pool.getPool(UsdcSuiPool);
    const lowerTick = TickMath.getPrevInitializableTickIndex(
      new BN(pool.current_tick_index).toNumber(),
      new BN(pool.tickSpacing).toNumber()
    );
    const upperTick = TickMath.getNextInitializableTickIndex(
      new BN(pool.current_tick_index).toNumber(),
      new BN(pool.tickSpacing).toNumber()
    );

    const usdcAmount = new BN(10 ** 4); // 0.01 USDC
    const fix_amount_a = true;
    const slippage = 0.01; // 1%
    const curSqrtPrice = new BN(pool.current_sqrt_price);

    const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(
      lowerTick,
      upperTick,
      usdcAmount,
      fix_amount_a,
      true,
      slippage,
      curSqrtPrice
    );

    const amount_a = fix_amount_a
      ? usdcAmount.toNumber()
      : liquidityInput.tokenMaxA.toNumber();
    const amount_b = fix_amount_a
      ? liquidityInput.tokenMaxB.toNumber()
      : usdcAmount.toNumber();

    const addLiquidityPayloadParams: AddLiquidityFixTokenParams = {
      coinTypeA: pool.coinTypeA,
      coinTypeB: pool.coinTypeB,
      pool_id: pool.poolAddress,
      tick_lower: lowerTick.toString(),
      tick_upper: upperTick.toString(),
      fix_amount_a,
      amount_a,
      amount_b,
      slippage,
      is_open: true,
      rewarder_coin_types: [],
      collect_fee: false,
      pos_id: "",
    };

    const newTx = await cetusSDK.Position.createAddLiquidityFixTokenPayload(
      addLiquidityPayloadParams,
      {
        slippage: slippage,
        curSqrtPrice: curSqrtPrice,
      },
      tx
    );

    return newTx;
  }
}
