import Image from "next/image";
import { useState } from "react";
import { formatCoin, formatCurrency } from "@/app/utils";

// TODO: Use real data
const DUMMY_DATA = [
  {
    coin_symbol: "BNB",
    coin: "BNB",
    coin_icon: "crypto-icons/bnb.svg",
    balance_coin: 550.06,
    balance_usd: 392387.32,
    balance_available_coin: 550.06,
    balance_available_usd: 392387.32,
    balance_frozen_coin: 0,
    balance_frozen_usd: 0,
  },
  {
    coin_symbol: "USDT",
    coin: "TetherUS",
    coin_icon: "crypto-icons/usdt.svg",
    balance_coin: 1331.67,
    balance_usd: 1331.67,
    balance_available_coin: 1331.67,
    balance_available_usd: 1331.67,
    balance_frozen_coin: 0,
    balance_frozen_usd: 0,
  },
];

export default function AssetsTableComponent() {
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
            <th className="w-[30%] text-left px-6 font-medium">Coin</th>
            <th
              className="w-[15%] text-right px-4 font-medium cursor-pointer"
              onClick={handleSort}
            >
              <div className="flex items-center justify-end">
                Balance
                {sortKey === "balance_coin" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th className="w-[15%] text-right px-4 font-medium">Available</th>
            <th className="w-[15%] text-right px-4 font-medium">Frozen</th>
            <th className="w-[25%] text-right px-6 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((asset) => (
            <tr
              key={asset.coin_symbol}
              className="bg-white rounded-xl shadow-[0_0_0_0.2px_#3d84ff,_0px_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1.5px_#3d84ff,_0px_4px_12px_rgba(0,0,0,0.15)] transition-all"
            >
              {/* Coin */}
              <td className="p-4 rounded-l-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={`/${asset.coin_icon}`}
                      alt={asset.coin_symbol}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{asset.coin_symbol}</div>
                    <div className="text-sm text-gray-500">{asset.coin}</div>
                  </div>
                </div>
              </td>

              {/* Balance */}
              <td className="p-4 text-right">
                <div className="font-medium text-md">
                  {formatCoin(asset.balance_coin, asset.coin_symbol)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(asset.balance_usd)}
                </div>
              </td>

              {/* Available */}
              <td className="p-4 text-right">
                <div className="font-medium">
                  {formatCoin(asset.balance_available_coin, asset.coin_symbol)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(asset.balance_available_usd)}
                </div>
              </td>

              {/* Frozen */}
              <td className="p-4 text-right">
                <div className="font-medium">
                  {formatCoin(asset.balance_frozen_coin, asset.coin_symbol)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(asset.balance_frozen_usd)}
                </div>
              </td>

              {/* TODO: Actions */}
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
