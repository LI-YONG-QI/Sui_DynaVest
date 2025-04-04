import Image from "next/image";
import StrategyCard from "./StrategyCard";
import { useState } from "react";
import GridIcon from "./GridIcon";
import ListIcon from "./ListIcon";
import StrategyTable from "./StrategyTable";

const strategies = [
  {
    title: "Morpho Lending Strategy",
    apy: "APY 3.10%",
    risk: {
      level: "Low" as const,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.3)",
    },
    protocol: "Morpho",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/sonic.svg",
    externalLink: "https://morpho.org",
    learnMoreLink: "https://morpho.org",
  },
  {
    title: "AAVE Lending Strategy",
    apy: "APY 3.10%",
    risk: {
      level: "Medium" as const,
      color: "#B9AB15",
      bgColor: "rgba(230, 212, 9, 0.3)",
    },
    protocol: "AAVE",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/sonic.svg",
    externalLink: "https://aave.com",
    learnMoreLink: "https://aave.com",
  },
  {
    title: "Compound Yield",
    apy: "APY 3.10%",
    risk: {
      level: "High" as const,
      color: "#E83033",
      bgColor: "rgba(232, 48, 51, 0.3)",
    },
    protocol: "Compound",
    description:
      "Lending protocol that allows anyone to deposit and earn yield. Learn More",
    image: "/sonic.svg",
    externalLink: "https://compound.finance",
    learnMoreLink: "https://compound.finance",
  },
];

export default function StrategyList() {
  const [view, setView] = useState("grid");
  return (
    <div>
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#E2E8F7] rounded-lg">
            <span className="font-[family-name:var(--font-inter)] font-medium text-sm text-[#121212]">
              High APY
            </span>
            <Image src="/caret-up.svg" alt="Caret up" width={16} height={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F8F9FE] rounded-lg">
            <span className="font-[family-name:var(--font-inter)] font-medium text-sm text-[#121212]">
              Risk
            </span>
            <Image
              src="/caret-down.svg"
              alt="Caret down"
              width={16}
              height={16}
            />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-[#F8F9FE] border border-[#E2E8F7] rounded-lg w-[300px]">
            <Image
              src="/search.svg"
              alt="Search"
              width={20}
              height={20}
              className="text-[#4C505B]"
            />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none font-[family-name:var(--font-inter)] font-medium text-sm text-[#AFB8C8] w-full"
            />
          </div>
          <div className="flex justify-center items-center gap-2 px-3 py-2.5 bg-[#F8F9FE] rounded-lg">
            <button
              className={`p-1 rounded hover:bg-gray-100`}
              onClick={() => {
                setView("grid");
              }}
            >
              <GridIcon isActive={view === "grid"} />
            </button>

            <button
              className={`p-1 rounded hover:bg-gray-100`}
              onClick={() => {
                setView("list");
              }}
            >
              <ListIcon isActive={view === "list"} />
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Cards */}
      {view === "grid" && (
        <div className="grid grid-cols-3 gap-7">
          {strategies.map((strategy, index) => (
            <StrategyCard key={index} {...strategy} />
          ))}
        </div>
      )}

      {view === "list" && <StrategyTable strategies={strategies} />}
    </div>
  );
}
