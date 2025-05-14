import { Message, MessageMetadata } from "./base";
import { PortfolioMessage } from "./portfolio";
import { arbitrum } from "viem/chains";
import { STRATEGIES_METADATA } from "@/constants/strategies";
import { RiskLevel, RiskPortfolioStrategies, StrategiesSet } from "@/types";
import { RISK_OPTIONS } from "@/constants/risk";

export class InvestMessage extends Message {
  public amount: string = "0";
  public chain: number = arbitrum.id;

  constructor(metadata: MessageMetadata, _chain?: number) {
    super(metadata);
    if (_chain) {
      this.chain = _chain;
    }
  }

  /**
   * Filters strategies by chain ID and generates allocations
   */
  private getStrategiesSetByChain(chainId: number): StrategiesSet {
    // Helper function to get strategies by risk level
    const getStrategiesByRisk = (riskLevel: RiskLevel) => {
      return STRATEGIES_METADATA.filter(
        (s) => s.risk.level === riskLevel && s.chainId === chainId
      );
    };

    // Generate allocations based on strategy count and risk type
    const generateAllocations = (
      strategies: typeof STRATEGIES_METADATA,
      riskLevel: RiskLevel
    ): number[] => {
      const count = strategies.length;
      if (count === 0) return [];

      switch (riskLevel) {
        case "low":
          // More weight on first strategies (lower risk ones)
          return Array(count)
            .fill(0)
            .map((_, i) => Math.max(30 - i * 5, 10))
            .map((val, _, arr) =>
              Math.round((val / arr.reduce((a, b) => a + b, 0)) * 100)
            );

        case "medium":
          // Balanced allocation with peak in middle
          return Array(count)
            .fill(0)
            .map((_, i) =>
              i === Math.floor(count / 2)
                ? 30
                : 15 + Math.abs(Math.floor(count / 2) - i) * 5
            )
            .map((val, _, arr) =>
              Math.round((val / arr.reduce((a, b) => a + b, 0)) * 100)
            );

        case "high":
          // Higher weights on later (higher risk) strategies
          return Array(count)
            .fill(0)
            .map((_, i) => 10 + i * 5)
            .map((val, _, arr) =>
              Math.round((val / arr.reduce((a, b) => a + b, 0)) * 100)
            );

        default:
          throw new Error("Invalid risk type");
      }
    };

    // Helper function to convert StrategyMetadata to RiskPortfolioStrategies with allocation
    const addAllocation = (
      strategy: (typeof STRATEGIES_METADATA)[0],
      allocation: number
    ): RiskPortfolioStrategies => ({
      ...strategy,
      allocation,
    });

    // Create strategies set object
    const strategiesSet: StrategiesSet = {} as StrategiesSet;

    // For each risk level, get strategies and add allocations
    RISK_OPTIONS.forEach((riskLevel) => {
      const strategies = getStrategiesByRisk(riskLevel);

      strategiesSet[riskLevel] = strategies.map((strategy, i, arr) =>
        addAllocation(strategy, generateAllocations(arr, riskLevel)[i])
      );
    });

    return strategiesSet;
  }

  next(): Message {
    // Get strategies filtered by chain
    const strategiesSet = this.getStrategiesSetByChain(this.chain);

    return new PortfolioMessage(
      this.createDefaultMetadata(`Portfolio: ${this.amount} USDC`),
      this.amount,
      this.chain,
      strategiesSet
    );
  }
}
