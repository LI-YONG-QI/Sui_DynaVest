import { STRATEGIES_METADATA } from "@/app/utils/constants/strategies";
import type {
  StrategiesSet,
  RiskLevel,
  RiskPortfolioStrategies,
} from "@/app/utils/types";

// Helper function to convert StrategyMetadata to RiskPortfolioStrategies with allocation
const addAllocation = (
  strategy: (typeof STRATEGIES_METADATA)[0],
  allocation: number
): RiskPortfolioStrategies => ({
  ...strategy,
  allocation,
});

// Filter strategies by risk level
const getStrategiesByRisk = (riskLevel: "Low" | "Medium" | "High") => {
  return STRATEGIES_METADATA.filter((s) => s.risk.level === riskLevel);
};

// Get all unique strategies for high airdrop potential (using specific protocols)
const getAirdropStrategies = () => {
  return STRATEGIES_METADATA.filter(
    (s) => ["Uniswap", "Flow"].includes(s.protocol) && s.risk.level === "High"
  ).slice(0, 2);
};

// Get a mix of strategies for balanced risk
const getBalancedStrategies = () => {
  const lowRisk = getStrategiesByRisk("Low").slice(0, 1);
  const mediumRisk = getStrategiesByRisk("Medium").slice(0, 2);
  const highRisk = getStrategiesByRisk("High").slice(0, 2);

  return [...lowRisk, ...mediumRisk, ...highRisk];
};

// Generate allocations based on strategy count and risk type
const generateAllocations = (
  strategies: typeof STRATEGIES_METADATA,
  riskType: RiskLevel
): number[] => {
  const count = strategies.length;
  if (count === 0) return [];

  switch (riskType) {
    case "Low":
      // More weight on first strategies (lower risk ones)
      return Array(count)
        .fill(0)
        .map((_, i) => Math.max(30 - i * 5, 10))
        .map((val, _, arr) =>
          Math.round((val / arr.reduce((a, b) => a + b, 0)) * 100)
        );

    case "Medium":
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

    case "High":
      // Higher weights on later (higher risk) strategies
      return Array(count)
        .fill(0)
        .map((_, i) => 10 + i * 5)
        .map((val, _, arr) =>
          Math.round((val / arr.reduce((a, b) => a + b, 0)) * 100)
        );

    case "High Airdrop Potential":
      // Focus on the first airdrop strategy
      if (count === 1) return [100];
      if (count === 2) return [80, 20];
      return [70, 30];

    case "Balanced":
    default:
      // Equal allocation
      return Array(count).fill(Math.round(100 / count));
  }
};

// Create the mock data structure
export const MOCK_STRATEGIES_SET: StrategiesSet = {
  Balanced: getBalancedStrategies().map((strategy, i, arr) =>
    addAllocation(strategy, generateAllocations(arr, "Balanced")[i])
  ),

  Low: getStrategiesByRisk("Low")
    .slice(0, 5)
    .map((strategy, i, arr) =>
      addAllocation(strategy, generateAllocations(arr, "Low")[i])
    ),

  Medium: getStrategiesByRisk("Medium")
    .slice(0, 5)
    .map((strategy, i, arr) =>
      addAllocation(strategy, generateAllocations(arr, "Medium")[i])
    ),

  High: getStrategiesByRisk("High")
    .slice(0, 5)
    .map((strategy, i, arr) =>
      addAllocation(strategy, generateAllocations(arr, "High")[i])
    ),

  "High Airdrop Potential": getAirdropStrategies().map((strategy, i, arr) =>
    addAllocation(
      strategy,
      generateAllocations(arr, "High Airdrop Potential")[i]
    )
  ),
};
