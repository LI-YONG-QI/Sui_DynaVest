"use client";

import Image from "next/image";
import { useState, FormEvent, KeyboardEvent, useRef } from "react";

const HOT_TOPICS = [
  {
    icon: "/atom.svg",
    title: "Strategy: Give me top-performing DeFi strategies on Base",
  },
  {
    icon: "/uni-hat.svg",
    title: "Learn: What is a delta-neutral strategy",
  },
  {
    icon: "/bar-chart.svg",
    title: "Trend: Give me an analysis on current crypto market",
  },
];

export default function Home() {
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (command: string) => {
    setCommand(command);
    // Focus the input field after setting the command
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // TODO: Handle Ask AI
  const handleAskAI = (e: FormEvent) => {
    e.preventDefault();
    if (command.trim() === "") return;

    console.log("Ask AI:", command);
    // Process the command here
    // Reset form if needed
    setCommand("");
  };

  // Handle key press in input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && command.trim() !== "") {
      e.preventDefault();
      handleAskAI(e as unknown as FormEvent);
    }
  };

  // TODO
  const handleHotTopic = (topic: string) => {
    setCommand(topic);
    // Focus the input field after setting the command
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-[48px] font-extrabold font-[family-name:var(--font-manrope)] text-[#141A21] mb-8 text-center">
          DeFAI Strategies Advisor
        </h2>

        {/* Search Bar */}
        <form
          onSubmit={handleAskAI}
          className="flex justify-between items-center w-full px-5 py-2.5 border border-[#5F79F1]/30 rounded-lg bg-white"
        >
          <input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            className="outline-none text-[#A0ACC5] font-[family-name:var(--font-manrope)] font-medium text-base w-[90%]"
            placeholder="Ask OneVault AI anything. Make DeFi investment easy and simple."
          />
          <button
            type="submit"
            disabled={command.trim() === ""}
            className="bg-[#5F79F1] disabled:bg-[#5F79F1]/50 text-white px-5 py-3 rounded-lg font-[family-name:var(--font-manrope)] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask AI
          </button>
        </form>

        {/* Commands Section */}
        <div className="flex items-center gap-2 mt-5 self-start">
          <span className="text-black font-[family-name:var(--font-manrope)] text-sm">
            Commands
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleCommand("Deposit 100 USDT to Morpho Finance")
              }
              className="cursor-pointer px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm"
            >
              Deposit
            </button>
            <button
              onClick={() =>
                handleCommand("Withdraw 100 USDT from Morpho Finance")
              }
              className="cursor-pointer px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Hot Topics */}
        <div className="mt-5 self-start">
          <h3 className="text-[#160211] font-[family-name:var(--font-manrope)] font-bold text-2xl mb-4">
            Hot Topics
          </h3>
          <div className="flex flex-col gap-3">
            {HOT_TOPICS.map((topic) => (
              <button
                key={topic.title}
                onClick={() => handleHotTopic(topic.title)}
                className="w-fit flex items-center bg-white rounded-[14px] px-4 py-1.5 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Image
                  src={topic.icon}
                  width={12}
                  height={12}
                  className="h-6 w-6 mr-2 object-contain"
                  alt={topic.title}
                />
                {topic.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
