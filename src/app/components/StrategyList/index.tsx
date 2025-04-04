import Image from "next/image";
import StrategyCard from "./StrategyCard";
import { useState, useMemo, useRef, useEffect } from "react";
import GridIcon from "./GridIcon";
import ListIcon from "./ListIcon";
import StrategyTable from "./StrategyTable";

const strategies = [
  {
    title: "Morpho Lending Strategy",
    apy: 2.4,
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
    apy: 3.1,
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
    apy: 3.9,
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

// Risk level options with colors
const riskLevels = [
  {
    value: "Low",
    label: "Low Risk",
    color: "#10B981",
  },
  {
    value: "Medium",
    label: "Medium Risk",
    color: "#B9AB15",
  },
  {
    value: "High",
    label: "High Risk",
    color: "#E83033",
  },
];

// No results placeholder
const NoResultsPlaceholder = () => (
  <div className="flex flex-col items-center justify-center py-16 w-full">
    <h3 className="text-lg font-medium text-gray-600 mb-2">
      No strategies found
    </h3>
    <p className="text-sm text-gray-500">
      Try adjusting your search query or filters
    </p>
  </div>
);

export default function StrategyList() {
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowRiskDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle risk selection
  const toggleRiskSelection = (risk: string) => {
    setSelectedRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    );
  };

  // Filter strategies based on search query and selected risks
  const filteredStrategies = useMemo(() => {
    let filtered = strategies;

    // Filter by risk if any risks are selected
    if (selectedRisks.length > 0) {
      filtered = filtered.filter((strategy) =>
        selectedRisks.includes(strategy.risk.level)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      try {
        const regex = new RegExp(searchQuery, "i");
        filtered = filtered.filter(
          (strategy) =>
            regex.test(strategy.title) ||
            regex.test(strategy.protocol) ||
            regex.test(strategy.description)
        );
      } catch {
        // If regex is invalid, fall back to simple includes
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (strategy) =>
            strategy.title.toLowerCase().includes(query) ||
            strategy.protocol.toLowerCase().includes(query) ||
            strategy.description.toLowerCase().includes(query)
        );
      }
    }

    return filtered;
  }, [searchQuery, selectedRisks]);

  return (
    <div>
      {/* Filters */}
      {/* TODO: Implement more filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            {/* Risk Dropdown */}
            <button
              className={`flex items-center gap-2 px-4 py-2.5 ${
                selectedRisks.length > 0 ? "bg-[#E2E8F7]" : "bg-[#F8F9FE]"
              } rounded-lg`}
              onClick={() => setShowRiskDropdown(!showRiskDropdown)}
            >
              <span className="font-[family-name:var(--font-inter)] font-medium text-sm text-[#121212]">
                {selectedRisks.length > 0
                  ? `Risk (${selectedRisks.length})`
                  : "Risk"}
              </span>
              <Image
                src={showRiskDropdown ? "/caret-up.svg" : "/caret-down.svg"}
                alt={showRiskDropdown ? "Caret up" : "Caret down"}
                width={16}
                height={16}
              />
            </button>

            {showRiskDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3">
                  <div className="mb-2 font-medium text-sm text-gray-700">
                    Filter by Risk Level
                  </div>
                  <div className="space-y-2">
                    {riskLevels.map((risk) => (
                      <div
                        key={risk.value}
                        className="flex items-center text-gray-600"
                      >
                        <label className="flex items-center cursor-pointer w-full">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedRisks.includes(risk.value)}
                            onChange={() => toggleRiskSelection(risk.value)}
                          />
                          <div
                            className={`w-4 h-4 rounded mr-2 flex items-center justify-center ${
                              selectedRisks.includes(risk.value)
                                ? "bg-[#5F79F1] border-[#5F79F1]"
                                : "border border-gray-300 bg-white"
                            }`}
                          >
                            {selectedRisks.includes(risk.value) && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 1L3.5 6.5L1 4"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm">{risk.label}</span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: risk.color }}
                            ></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                    <button
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedRisks([])}
                    >
                      Clear all
                    </button>
                    <button
                      className="text-xs text-[#5F79F1] font-medium hover:text-[#4A64DC]"
                      onClick={() => setShowRiskDropdown(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search strategies..."
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
        <>
          {filteredStrategies.length > 0 ? (
            <div className="grid grid-cols-3 gap-7">
              {filteredStrategies.map((strategy, index) => (
                <StrategyCard key={index} {...strategy} />
              ))}
            </div>
          ) : (
            <NoResultsPlaceholder />
          )}
        </>
      )}

      {view === "list" && (
        <>
          {filteredStrategies.length > 0 ? (
            <StrategyTable strategies={filteredStrategies} />
          ) : (
            <NoResultsPlaceholder />
          )}
        </>
      )}
    </div>
  );
}
