"use client";
import Image from "next/image";
import { useChat } from "../contexts/ChatContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { toggleChat } = useChat();

  return (
    <div className="">
      <div className="relative flex justify-center mb-6 items-center">
        <h2 className="text-[48px] font-extrabold font-[family-name:var(--font-manrope)] text-[#141A21] text-center">
          DeFAI Strategies
        </h2>

        <div className="absolute right-0">
          <button
            onClick={toggleChat}
            className="bg-[#5F79F1] flex items-center gap-x-2 text-white px-5 py-3 rounded-2xl shadow-[0px_21px_27px_-10px_rgba(71,114,234,0.65)] font-[family-name:var(--font-manrope)] font-medium hover:bg-[#4A64DC] transition-colors z-10"
          >
            <span>
              <Image
                src="/ask-onevault-bot-icon.png"
                alt="Bot"
                width={20}
                height={20}
                className="text-[#1E3498]"
              />
            </span>
            Ask DynaVest Bot
          </button>
        </div>
      </div>

      <div className="py-10">{children}</div>
    </div>
  );
}
