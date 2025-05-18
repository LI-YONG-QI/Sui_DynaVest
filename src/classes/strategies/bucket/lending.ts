import { Transaction } from "@mysten/sui/transactions";
import { Address } from "viem";

import { SuiBaseStrategy } from "../base";
import { SUI_PACKAGES } from "@/hooks/useSuiStrategyExecutor";

export class Lending extends SuiBaseStrategy<typeof SUI_PACKAGES> {
  constructor(chainId: number) {
    super(chainId, SUI_PACKAGES, {
      protocol: "Sui",
      icon: "/crypto-icons/sui.svg",
      type: "Lending",
      description: "Lend assets to Sui",
    });
  }

  async buildCalls(amount: bigint, user: Address): Promise<Transaction> {
    const tx = new Transaction();

    const [coin] = tx.splitCoins(tx.gas, [amount]);
    tx.transferObjects([coin], user);

    return tx;
  }
}
