import Image from "next/image";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useDisconnect, useAccount } from "wagmi";
import { useState, useRef, useEffect } from "react";

export default function ConnectWalletButton() {
  const { ready, authenticated, logout } = usePrivy();
  const { address } = useAccount();
  const { login } = useLogin();
  const { disconnect } = useDisconnect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonOnClick = () => {
    if (ready && !authenticated) {
      login({
        loginMethods: ["wallet"],
        walletChainType: "ethereum-only",
        disableSignup: false,
      });
    } else if (ready && authenticated) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleDisconnect = () => {
    logout();
    disconnect();
    setIsDropdownOpen(false);
  };

  // DROPDOWN - close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center text-center rounded-t-[10px] bg-gradient-to-r w-[170px] from-[#5F79F1] to-[#FDA4AF] ${
        isDropdownOpen ? "" : "rounded-b-[10px]"
      }`}
      ref={dropdownRef}
    >
      <button
        disabled={!ready}
        onClick={handleButtonOnClick}
        className="cursor-pointer flex items-center gap-4 px-4 py-3"
      >
        <div className="flex items-center gap-4">
          {ready ? (
            authenticated && address ? (
              <div className="flex items-center gap-4 font-[family-name:var(--font-manrope)] font-medium text-base">
                {/* TODO: Add wallet icon */}

                <div className="flex items-center gap-2 text-black">
                  {/* TODO: Add username */}
                  <span>
                    {address?.slice(0, 6) + "..." + address?.slice(-4)}
                  </span>
                </div>

                <Image
                  src="/arrow-down.svg"
                  alt="Arrow Down"
                  width={16}
                  height={16}
                  className={`text-white transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            ) : (
              <span className="text-center text-white font-[family-name:var(--font-manrope)] font-medium text-base">
                Connect Wallet
              </span>
            )
          ) : (
            <span className="text-center text-white font-[family-name:var(--font-manrope)] font-medium text-base">
              Loading...
            </span>
          )}
        </div>
      </button>

      {/* DROPDOWN */}
      {isDropdownOpen && authenticated && (
        <div className="absolute top-full rounded-b-[10px] right-0 w-full shadow-lg bg-gradient-to-r from-[#5F79F1] to-[#FDA4AF] p-[1px] z-10 transform origin-top-right transition-all duration-200 ease-out">
          <div className="overflow-hidden">
            <div className="">
              {/* Copy Address Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (address) {
                    navigator.clipboard.writeText(address);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }
                }}
                className="w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:opacity-90 transition-colors duration-150"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">Copy Address</span>
                </div>
                {isCopied && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 animate-[checkmark_0.4s_ease-in-out]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:opacity-90 transition-colors duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium text-red-500">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
