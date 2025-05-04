import Image from "next/image";
import { useState } from "react";
import { formatCoin, formatCurrency } from "@/app/utils";

// TODO: Use real data
const DUMMY_DATA = [
  {
    strategy_name: "AAVE Lending Strategy",
    strategy_icon: "crypto-icons/aave.svg",
    coin_symbol: "BNB",
    coin: "BNB",
    coin_icon: "crypto-icons/bnb.svg",
    balance_coin: 2.3,
    balance_usd: 1050.3,
    profit_coin: 0.8,
    profit_usd: 76.3,
  },
  {
    strategy_name: "AAVE Lending Strategy",
    strategy_icon: "crypto-icons/aave.svg",
    coin_symbol: "USDC",
    coin: "USD Coin",
    coin_icon: "crypto-icons/usdc.svg",
    balance_coin: 1250,
    balance_usd: 1250,
    profit_coin: 134.56,
    profit_usd: 134.56,
  },
];

export default function StrategiesTableComponent() {
  const [sortKey, setSortKey] = useState<"balance_coin" | null>("balance_coin");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedData = [...DUMMY_DATA].sort((a, b) => {
    if (!sortKey) return 0;
    return sortDirection === "asc"
      ? a[sortKey] - b[sortKey]
      : b[sortKey] - a[sortKey];
  });

  const handleSort = () => {
    if (sortKey === "balance_coin") {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey("balance_coin");
      setSortDirection("desc");
    }
  };

  return (
    <div className="mx-4 w-[calc(100%-2rem)]">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-sm font-semibold text-gray-500">
            <th className="w-[20%] text-left px-6 font-medium">Strategy</th>
            <th className="w-[20%] text-right px-4 font-medium">Asset</th>
            <th
              className="w-[20%] text-right px-4 font-medium cursor-pointer"
              onClick={handleSort}
            >
              <div className="flex items-center justify-end">
                Amount
                {sortKey === "balance_coin" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th className="w-[20%] text-right px-4 font-medium">Profit</th>
            <th className="w-[20%] text-right px-6 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((strategy, index) => (
            <tr
              key={`${strategy.strategy_name}-${strategy.coin_symbol}-${index}`}
              className="bg-white rounded-xl shadow-[0_0_0_0.2px_#3d84ff,_0px_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1.5px_#3d84ff,_0px_4px_12px_rgba(0,0,0,0.15)] transition-all"
            >
              {/* Strategy */}
              <td className="p-4 rounded-l-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={`/${strategy.strategy_icon}`}
                      alt={strategy.strategy_name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{strategy.strategy_name}</div>
                  </div>
                </div>
              </td>

              {/* Asset */}
              <td className="p-4">
                <div className="flex items-center gap-3 justify-end">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={`/${strategy.coin_icon}`}
                      alt={strategy.coin_symbol}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-end text-left min-w-[70px]">
                    <div className="font-bold">{strategy.coin_symbol}</div>
                    <div className="text-sm text-gray-500">{strategy.coin}</div>
                  </div>
                </div>
              </td>

              {/* Amount */}
              <td className="p-4 text-right">
                <div className="font-medium text-md">
                  {formatCoin(strategy.balance_coin, strategy.coin_symbol)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(strategy.balance_usd)}
                </div>
              </td>

              {/* Profit */}
              <td className="p-4 text-right">
                <div className="font-medium text-md">
                  {formatCoin(strategy.profit_coin, strategy.coin_symbol)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(strategy.profit_usd)}
                </div>
              </td>

              {/* Actions */}
              <td className="p-4 text-right rounded-r-xl">
                <div className="flex justify-end gap-1">
                  <button className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-gray-50 transition-colors">
                    Deposit
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-gray-50 transition-colors">
                    Withdraw
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
