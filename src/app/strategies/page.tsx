"use client";

import Image from "next/image";
import Header from "../components/Header";

interface StrategyCardProps {
  title: string;
  apy: string;
  risk: {
    level: "Low" | "Medium" | "High";
    color: string;
    bgColor: string;
  };
  protocol: string;
  description: string;
  image: string;
}

const StrategyCard = ({
  title,
  apy,
  risk,
  protocol,
  description,
  image,
}: StrategyCardProps) => {
  const getRiskColor = () => {
    switch (risk.level) {
      case "Low":
        return { text: "#10B981", bg: "rgba(16, 185, 129, 0.3)" };
      case "Medium":
        return { text: "#B9AB15", bg: "rgba(230, 212, 9, 0.3)" };
      case "High":
        return { text: "#E83033", bg: "rgba(232, 48, 51, 0.3)" };
    }
  };

  return (
    <div className="flex flex-col items-center gap-[18px] p-5 bg-white rounded-2xl shadow-[0px_21px_27px_-10px_rgba(71,114,234,0.65)]">
      <div className="flex justify-around items-center  w-full">
        <Image
          src={image}
          alt={title}
          width={60}
          height={60 }
          className="rounded-lg object-cover"
        />
        <div className="flex flex-col justify-center gap-2.5 w-[224px]">
          <div className="flex gap-[3px] self-stretch">
            <h3 className="font-[family-name:var(--font-manrope)] text-[18px] font-bold text-lg text-[#17181C] text-center">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-inter)] font-medium text-base text-[#17181C]">
              {apy}
            </span>
            <div
              className="flex justify-center items-center gap-2 px-2 py-1 rounded-lg"
              style={{ backgroundColor: getRiskColor().bg }}
            >
              <span
                className="font-[family-name:var(--font-inter)] font-medium text-sm"
                style={{ color: getRiskColor().text }}
              >
                {risk.level} Risk
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex justify-center items-center gap-[5px]">
          <span className="font-[family-name:var(--font-plus-jakarta)] font-medium text-sm text-black">
            {protocol}
          </span>
          <Image
            src="/arrow-right.svg"
            alt="Arrow right"
            width={16}
            height={16}
          />
        </div>
        <p className="font-[family-name:var(--font-plus-jakarta)] font-medium text-sm text-[#17181C] text-center">
          {description}
        </p>
      </div>

      <div className="flex items-center self-stretch gap-[13px]">
        <button className="flex-1 h-[37px] flex justify-center items-center bg-[#5F79F1] text-white rounded-[11px] font-[family-name:var(--font-plus-jakarta)] font-semibold text-sm">
          Invest
        </button>
        <Image
          src="/bot-icon.svg"
          alt="Bot"
          width={24}
          height={24}
          className="text-[#1E3498]"
        />
      </div>
    </div>
  );
};

export default function StrategiesPage() {
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
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F2FB] via-[#ECE6FB] to-[#E6F2FB]">
      <Header />

      {/* Main Content */}
      <main className="px-20 pt-[100px]">
        <div className="max-w-[1315px] mx-auto">
          <h2 className="text-[48px] font-extrabold font-[family-name:var(--font-manrope)] text-[#141A21] mb-8">
            DeFAI Strategies
          </h2>

          {/* Filters */}
          <div className="flex justify-between items-center w-[1000px] mb-6">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#E2E8F7] rounded-lg">
                <span className="font-[family-name:var(--font-inter)] font-medium text-sm text-[#121212]">
                  High APY
                </span>
                <Image
                  src="/caret-up.svg"
                  alt="Caret up"
                  width={16}
                  height={16}
                />
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
                <Image
                  src="/grid.svg"
                  alt="Grid view"
                  width={20}
                  height={20}
                  className="text-[#3568E8]"
                />
                <Image
                  src="/list.svg"
                  alt="List view"
                  width={20}
                  height={20}
                  className="text-[#AFB8C8]"
                />
              </div>
            </div>
          </div>

          {/* Strategy Cards */}
          <div className="grid grid-cols-3 gap-7">
            {strategies.map((strategy, index) => (
              <StrategyCard key={index} {...strategy} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
