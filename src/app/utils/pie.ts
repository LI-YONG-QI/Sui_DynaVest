import type { ChartConfig } from "../components/ui/chart";
import type { PieStrategy, StrategyMetadata } from "./types";

export const COLORS = ["#7086FD", "#6FD195", "#FFAE4C", "#07DBFA", "#988AFC"];

/**
 * Generates chart data from strategy information
 */
export const createChartData = (strategyData: PieStrategy[]) => {
  return strategyData.map((s) => ({
    name: s.name,
    value: s.allocation,
  }));
};

/**
 * Creates chart configuration based on strategy data
 */
export const createChartConfig = (strategyData: PieStrategy[]): ChartConfig => {
  return {
    value: { label: "Allocation" },
    ...Object.fromEntries(
      strategyData.map((s) => [s.name, { label: s.name, color: s.color }])
    ),
  };
};

export const createPieChartStrategies = (
  strategiesMetadata: StrategyMetadata[],
  allocations: number[]
) => {
  return strategiesMetadata.map((strategy, index) => ({
    id: index + 1,
    color: COLORS[index],
    name: strategy.title,
    apy: `APY ${strategy.apy}%`,
    risk: `${strategy.risk.level} Risk`,
    allocation: allocations[index],
  }));
};
