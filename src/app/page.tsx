import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F2FB] via-[#ECE6FB] to-[#E6F2FB]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center px-20 pt-[100px]">
        <div className="max-w-[883px] w-full flex flex-col items-center">
          <h2 className="text-[48px] font-extrabold font-[family-name:var(--font-manrope)] text-[#141A21] mb-8 text-center">
            DeFAI Strategies Advisor
          </h2>

          {/* Search Bar */}
          <div className="flex justify-between items-center w-full px-5 py-2.5 border border-[#5F79F1]/30 rounded-lg bg-white">
            <p className="text-[#A0ACC5] font-[family-name:var(--font-manrope)] font-medium text-base">
              Ask OneVault AI anything. Make DeFi investment easy and simple.
            </p>
            <button className="bg-[#5F79F1] text-white px-5 py-3 rounded-lg font-[family-name:var(--font-manrope)] font-medium">
              Ask AI
            </button>
          </div>

          {/* Commands Section */}
          <div className="flex items-center gap-2 mt-8 self-start">
            <span className="text-black font-[family-name:var(--font-manrope)] text-sm">
              Commands
            </span>
            <div className="flex gap-2">
              <span className="px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm">
                Deposit
              </span>
              <span className="px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm">
                Withdraw
              </span>
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
      </main>
    </div>
  );
}
