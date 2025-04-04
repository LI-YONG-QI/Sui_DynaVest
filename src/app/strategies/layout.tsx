import Header from "../components/Header";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#E6F2FB] via-[#ECE6FB] to-[#E6F2FB]">
      <div className="min-h-screen mx-auto">
        <Header />
        <div className="relative flex items-center py-8 px-20">
          <div className="absolute left-0 right-0 flex justify-center">
            <h2 className="text-[48px] font-extrabold font-[family-name:var(--font-manrope)] text-[#141A21]">
              DeFAI Strategies
            </h2>
          </div>
          <div className="ml-auto">
            <button className="bg-[#5F79F1] flex items-center gap-x-2 text-white px-5 py-3 rounded-2xl shadow-[0px_21px_27px_-10px_rgba(71,114,234,0.65)] font-[family-name:var(--font-manrope)] font-medium">
              <span>
                <Image
                  src="/ask-onevault-bot-icon.png"
                  alt="Bot"
                  width={20}
                  height={20}
                  className="text-[#1E3498]"
                />
              </span>
              Ask OneVault Bot
            </button>
          </div>
        </div>
        <div className="px-20 mt-10">{children}</div>
      </div>
    </div>
  );
}
