import { Address, encodeFunctionData } from "viem";

import { EVMBaseStrategy, StrategyCall } from "../base";
import { STAKED_CELO_ABI } from "@/constants/abis";
import { ST_CELO_CONTRACTS } from "@/constants/protocols";

export class StCeloStaking extends EVMBaseStrategy<typeof ST_CELO_CONTRACTS> {
  // TODO: mock metadata
  constructor(chainId: number) {
    super(chainId, ST_CELO_CONTRACTS, {
      protocol: "Morpho",
      icon: "/crypto-icons/morpho.svg",
      type: "Lending",
      description: "Lend assets to Morpho",
    });
  }

  async buildCalls(amount: bigint, user: Address): Promise<StrategyCall[]> {
    const manager = this.getAddress("manager");

    console.log(user);

    return [
      {
        to: manager,
        value: amount,
        data: encodeFunctionData({
          abi: STAKED_CELO_ABI,
          functionName: "deposit",
          args: [],
        }),
      },
    ];
  }
}
