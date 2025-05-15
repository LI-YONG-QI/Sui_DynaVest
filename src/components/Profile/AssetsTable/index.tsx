import Image from "next/image";
import { useState } from "react";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { toast } from "react-toastify";
import { useChainId } from "wagmi";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

import useCurrencies from "@/hooks/useCurrencies";
import { Token } from "@/types";
import { WithdrawDialog } from "./WithdrawDialog";
import { ERC20_ABI } from "@/constants";
import { SUPPORTED_TOKENS } from "@/constants/profile";

export default function AssetsTableComponent() {
  const [sortKey, setSortKey] = useState<"balance" | null>("balance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { tokensData } = useCurrencies(SUPPORTED_TOKENS);
  const { client } = useSmartWallets();
  const chainId = useChainId();

  const handleWithdraw = async (asset: Token, amount: string, to: Address) => {
    if (!client) {
      toast.error("Client not found");
      return;
    }

    await client.switchChain({ id: chainId });
    try {
      const decimals = asset.decimals || 6;
      const amountInBaseUnits = parseUnits(amount, decimals);

      let tx;
      if (asset.isNativeToken) {
        tx = await client.sendTransaction({
          to,
          value: amountInBaseUnits,
        });
      } else {
        tx = await client.sendTransaction({
          to: asset.chains?.[chainId],
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [to, amountInBaseUnits],
          }),
        });
      }

      toast.success(
        `${asset.name} withdrawal submitted successfully, tx hash: ${tx}`
      );
    } catch (error) {
      console.log("Error processing withdrawal:", error);
      toast.error("Something went wrong");
    }
  };

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

              {/* Actions */}
              <td className="p-4 text-right rounded-r-xl">
                <div className="flex justify-end gap-1">
                  <button className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-gray-50 transition-colors">
                    Deposit
                  </button>
                  <WithdrawDialog
                    asset={asset.token}
                    balance={asset.balance}
                    onWithdraw={(amount, to) =>
                      handleWithdraw(asset.token, amount, to)
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
