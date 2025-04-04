import Image from "next/image";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";

export default function ConnectWalletButton() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { login } = useLogin();

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button
      disabled={disableLogin}
      onClick={() =>
        login({
          loginMethods: ["wallet"],
          walletChainType: "ethereum-only",
          disableSignup: false,
        })
      }
      className="flex items-center gap-4 px-4 py-3 rounded-[10px] bg-gradient-to-r from-[#5F79F1] to-[#FDA4AF]"
    >
      <div className="flex items-center gap-4">
        {wallets.length > 0 && wallets[0] ? (
          <div className="flex items-center gap-4 text-white font-[family-name:var(--font-manrope)] font-medium text-base">
            {/* TODO: Add wallet icon */}

            <div className="flex items-center gap-2">
              {/* TODO: Add username */}
              <span>
                {wallets[0]?.address?.slice(0, 6) +
                  "..." +
                  wallets[0]?.address?.slice(-4)}
              </span>
            </div>

            {/* TODO: Disconnect wallet using wagmi */}
            <Image
              src="/arrow-down.svg"
              alt="Arrow Down"
              width={16}
              height={16}
              className="text-white"
            />
          </div>
        ) : (
          <span className="text-white font-[family-name:var(--font-manrope)] font-medium text-base">
            Connect Wallet
          </span>
        )}
      </div>
    </button>
  );
}
