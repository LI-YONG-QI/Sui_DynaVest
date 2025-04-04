"use client";
import { useState, FormEvent, KeyboardEvent, useRef } from "react";

export default function Home() {
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: Handle Deposit
  const handleDeposit = () => {
    console.log("Deposit");
    setCommand("Deposit 100 USDT to Morpho Finance.");
    // Focus the input field after setting the command
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // TODO: Handle Withdraw
  const handleWithdraw = () => {
    console.log("Withdraw");
    setCommand("Withdraw 100 USDT from Morpho Finance.");
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
              onClick={handleDeposit}
              className="cursor-pointer px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm"
            >
              Deposit
            </button>
            <button
              onClick={handleWithdraw}
              className="cursor-pointer px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Hot Topics */}
        <div className="w-[441px] mt-12 self-start">
          <h3 className="text-[#160211] font-[family-name:var(--font-manrope)] font-bold text-2xl mb-4">
            Hot Topics
          </h3>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full bg-white rounded-[14px] px-2.5 py-1.5 shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
