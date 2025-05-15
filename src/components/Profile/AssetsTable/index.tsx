import Image from "next/image";
import { useState } from "react";
import { BNB, USDT, USDC, ETH } from "@/constants/coins";
import useCurrencies from "@/hooks/useCurrencies";
import { Token } from "@/types";
import { ERC20_ABI } from "@/constants/abis";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData, parseUnits } from "viem";
import { toast } from "react-toastify";

// TODO: Use real data
// const DUMMY_DATA = [
//   {
//     coin_symbol: "BNB",
//     coin: "BNB",
//     coin_icon: "crypto-icons/bnb.svg",
//     balance_coin: 2.3,
//     balance_usd: 1050.3,
//     balance_available_coin: 1.2,
//     balance_available_usd: 550,
//     balance_frozen_coin: 1.1,
//     balance_frozen_usd: 500.3,
//   },
//   {
//     coin_symbol: "USDC",
//     coin: "USD Coin",
//     coin_icon: "crypto-icons/usdc.svg",
//     balance_coin: 1250,
//     balance_usd: 1250,
//     balance_available_coin: 900,
//     balance_available_usd: 900,
//     balance_frozen_coin: 350,
//     balance_frozen_usd: 350,
//   },
// ];

const SUPPORTED_TOKENS = [USDT, USDC, BNB, ETH];

export default function AssetsTableComponent() {
  const [sortKey, setSortKey] = useState<"balance" | null>("balance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { tokensData, isLoading } = useCurrencies(SUPPORTED_TOKENS);
  const { client } = useSmartWallets();

  console.log(tokensData);
  console.log(isLoading);

  const sortedData = [...tokensData].sort((a, b) => {
    if (!sortKey) return 0;
    return sortDirection === "asc"
      ? a[sortKey] - b[sortKey]
      : b[sortKey] - a[sortKey];
  });

  const handleSort = () => {
    if (sortKey === "balance") {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey("balance");
      setSortDirection("desc");
    }
  };

  const withdraw = async (token: Token, _amount: string) => {
    if (!client) throw new Error("Client not found");

    const chainId = await client.getChainId();
    const amount = parseUnits(_amount, token.decimals);

    try {
      let tx;

      if (token.isNativeToken) {
        tx = await client.sendTransaction({
          to: token.chains?.[chainId],
          value: amount,
        });
      } else {
        tx = await client.sendTransaction({
          to: token.chains?.[chainId],
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: ["0x80dAdeBda19E5C010c4417985a4c05d0a8008A81", amount],
          }),
        });
      }

      toast.success(`Transaction sent: ${tx}`);
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed");
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
                {sortKey === "balance" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((asset) => (
            <tr
              key={asset.token.name}
              className="bg-white rounded-xl shadow-[0_0_0_0.2px_#3d84ff,_0px_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1.5px_#3d84ff,_0px_4px_12px_rgba(0,0,0,0.15)] transition-all"
            >
              {/* Coin */}
              <td className="p-4 rounded-l-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={asset.token.icon}
                      alt={asset.token.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{asset.token.name}</div>
                    <div className="text-sm text-gray-500">
                      {asset.token.name}
                    </div>
                  </div>
                </div>
              </td>

              {/* Balance */}
              <td className="p-4 text-right">
                <div className="font-medium text-md">
                  {asset.balance.toString()}
                </div>
                <div className="text-sm text-gray-500">
                  {/* TODO: update with usd value */}
                  {`$ ${asset.balance.toString()}`}
                </div>
              </td>

              {/* TODO: Actions */}
              <td className="p-4 text-right rounded-r-xl">
                <div className="flex justify-end gap-1">
                  <button className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-gray-50 transition-colors">
                    Deposit
                  </button>
                  <button
                    onClick={() => withdraw(asset.token, "0.00001")}
                    className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-gray-50 transition-colors"
                  >
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
