import Image from "next/image";
import { CHAINS } from "@/app/utils/constants/chains";
import { Dispatch, Fragment, SetStateAction } from "react";

interface ChainFilterProps {
  selectedChains: number[];
  setSelectedChains: Dispatch<SetStateAction<number[]>>;
  className?: string;
}

export default function ChainFilter({
  selectedChains,
  setSelectedChains,
  className = "",
}: ChainFilterProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl bg-[#F8F9FE] px-2 py-1 ${className}`}
    >
      {CHAINS.map((chain, idx) => (
        <Fragment key={chain.id}>
          <button
            key={chain.id}
            type="button"
            className={`w-8 h-8 flex items-center justify-center
              ${
                selectedChains.length > 0
                  ? selectedChains.includes(chain.id)
                    ? "opacity-100"
                    : "opacity-50"
                  : "opacity-100"
              }`}
            onClick={() => {
              setSelectedChains((prev) =>
                prev.includes(chain.id)
                  ? prev.filter((id) => id !== chain.id)
                  : [...prev, chain.id]
              );
            }}
            aria-label={chain.name}
          >
            <Image
              src={chain.icon}
              alt={chain.name}
              width={12}
              height={12}
              className="w-6 h-6"
            />
          </button>
          {/* Divider */}
          {idx < CHAINS.length - 1 && (
            <span className="w-[1.5px] h-6 bg-gray-200 rounded-full mx-1" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
