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
    <div className="relative" ref={dropdownRef}>
      <button
        disabled={!ready}
        onClick={handleButtonOnClick}
        className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-[10px] bg-gradient-to-r from-[#5F79F1] to-[#FDA4AF]"
      >
        <div className="flex items-center gap-4">
          {ready && authenticated && address ? (
            <div className="flex items-center gap-4 font-[family-name:var(--font-manrope)] font-medium text-base">
              {/* TODO: Add wallet icon */}

              <div className="flex items-center gap-2 text-black">
                {/* TODO: Add username */}
                <span>{address?.slice(0, 6) + "..." + address?.slice(-4)}</span>
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
            <span className="text-white font-[family-name:var(--font-manrope)] font-medium text-base">
              Connect Wallet
            </span>
          )}
        </div>
      </button>

      {isDropdownOpen && authenticated && (
        <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] rounded-[10px] shadow-lg bg-gradient-to-r from-[#5F79F1] to-[#FDA4AF] p-[1px] z-10 transform origin-top-right transition-all duration-200 ease-out">
          <div className="bg-white rounded-[9px] overflow-hidden">
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                Account
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors duration-150"
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
