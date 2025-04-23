import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { useState, useMemo, useRef } from "react";

import StrategyCard from "./StrategyCard";
import GridIcon from "./GridIcon";
import ListIcon from "./ListIcon";
import StrategyTable from "./StrategyTable";
import RiskFilter from "./RiskFilter";
import ProtocolFilter from "./ProtocolFilter";
import { STRATEGIES_METADATA } from "@/app/utils/constants/strategies";

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
  const [showProtocolDropdown, setShowProtocolDropdown] = useState(false);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const protocolDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract all distinct protocols
  const protocolOptions = useMemo(() => {
    const protocols = STRATEGIES_METADATA.map((strategy) => strategy.protocol);
    return Array.from(new Set(protocols));
  }, []);

  // Toggle protocol selection
  const toggleProtocolSelection = (protocol: string) => {
    setSelectedProtocols((prev) =>
      prev.includes(protocol)
        ? prev.filter((p) => p !== protocol)
        : [...prev, protocol]
    );
  };
  // Toggle risk selection
  const toggleRiskSelection = (risk: string) => {
    setSelectedRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    );
  };

  // Filter strategies based on search query, selected risks, and selected protocols
  const filteredStrategies = useMemo(() => {
    let filtered = STRATEGIES_METADATA;

    // Filter by risk if any risks are selected
    if (selectedRisks.length > 0) {
      filtered = filtered.filter((strategy) =>
        selectedRisks.includes(strategy.risk.level)
      );
    }

    // Filter by protocol if any protocols are selected
    if (selectedProtocols.length > 0) {
      filtered = filtered.filter((strategy) =>
        selectedProtocols.includes(strategy.protocol)
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
  }, [searchQuery, selectedRisks, selectedProtocols]);

  return (
    <div>
      {/* Filters */}
      {/* TODO: Implement more filters */}
      {/* TODO: Make fitlers dynamic */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <RiskFilter
            selectedRisks={selectedRisks}
            setSelectedRisks={setSelectedRisks}
            toggleRiskSelection={toggleRiskSelection}
            showRiskDropdown={showRiskDropdown}
            setShowRiskDropdown={setShowRiskDropdown}
            dropdownRef={dropdownRef}
          />
          <ProtocolFilter
            protocols={protocolOptions}
            selectedProtocols={selectedProtocols}
            setSelectedProtocols={setSelectedProtocols}
            toggleProtocolSelection={toggleProtocolSelection}
            showProtocolDropdown={showProtocolDropdown}
            setShowProtocolDropdown={setShowProtocolDropdown}
            dropdownRef={protocolDropdownRef}
          />
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
      <ToastContainer position="bottom-right" />
    </div>
  );
}
