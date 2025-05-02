import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const getRiskColor = (risk: {
  level: "Low" | "Medium" | "High";
  color: string;
  bgColor: string;
}) => {
  switch (risk.level) {
    case "Low":
      return { text: "#10B981", bg: "rgba(16, 185, 129, 0.3)" };
    case "Medium":
      return { text: "#B9AB15", bg: "rgba(230, 212, 9, 0.3)" };
    case "High":
      return { text: "#E83033", bg: "rgba(232, 48, 51, 0.3)" };
  }
};

// TODO: Convert given value to USD
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCoin = (value: number, symbol: string) => {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  })} ${symbol}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
