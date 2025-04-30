import type { ChartConfig } from "../components/ui/chart";
import type { PieStrategy } from "./types";

/**
 * Generates chart data from strategy information
 */
export const generateChartData = (strategyData: PieStrategy[]) => {
  return strategyData.map((s) => ({
    name: s.name,
    value: s.allocation,
  }));
};

/**
 * Creates chart configuration based on strategy data
 */
export const generateChartConfig = (
  strategyData: PieStrategy[]
): ChartConfig => {
  return {
    value: { label: "Allocation" },
    ...Object.fromEntries(
      strategyData.map((s) => [s.name, { label: s.name, color: s.color }])
    ),
  };
};
