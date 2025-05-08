import Image from "next/image";

const DUMMY_DATA = [
  {
    date: "2025-04-29",
    strategy_name: "AAVE Lending Strategy",
    strategy_icon: "crypto-icons/aave.svg",
    transaction_type: "Invest",
    asset: "BNB",
    amount: 2,
  },
  {
    date: "2025-05-01",
    strategy_name: "AAVE Lending Strategy",
    strategy_icon: "crypto-icons/aave.svg",
    transaction_type: "Withdraw",
    asset: "USDT",
    amount: 1000,
  },
];

export default function TransactionsTableComponent() {
  return (
    <div className="mx-4 w-[calc(100%-2rem)]">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-sm font-semibold text-gray-500">
            <th className="w-[20%] text-left px-6 font-medium">Date</th>
            <th className="w-[30%] text-left px-4 font-medium">Strategy</th>
            <th className="w-[20%] text-left px-4 font-medium">Type</th>
            <th className="w-[30%] text-left px-6 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_DATA.map((transaction, index) => (
            <tr
              key={`${transaction.strategy_name}-${transaction.asset}-${index}`}
              className="bg-white rounded-xl shadow-[0_0_0_0.2px_#3d84ff,_0px_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1.5px_#3d84ff,_0px_4px_12px_rgba(0,0,0,0.15)] transition-all"
            >
              {/* Date */}
              <td className="p-4 rounded-l-xl">
                <div className="font-medium text-md">{transaction.date}</div>
              </td>

              {/* Strategy */}
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={`/${transaction.strategy_icon}`}
                      alt={transaction.strategy_name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{transaction.strategy_name}</div>
                  </div>
                </div>
              </td>

              {/* Type */}
              <td className="p-4">
                <div className="font-medium text-md">
                  {transaction.transaction_type}
                </div>
              </td>

              {/* Amount */}
              <td className="p-4 rounded-r-xl">
                <div className="font-medium text-md">
                  {transaction.amount} {transaction.asset}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
