"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton as SuiConnectButton } from "@mysten/dapp-kit";
import Image from "next/image";

import ConnectWalletButton from "./ConnectWalletButton";
import ChainSelector from "./ChainSelector";
import { usePrivy } from "@privy-io/react-auth";

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { label: "Strategies", href: "/strategies", isActive: true },
  { label: "Bot", href: "/", isActive: true },
];

export default function Header() {
  const pathname = usePathname();

  const { user } = usePrivy();
  console.log(user);

  return (
    <header className="flex justify-between items-center px-5 md:px-20 py-6">
      <div className="flex items-center">
        <Link
          href="/"
          className="text-[#5F79F1] text-[22px] font-[family-name:var(--font-lily-script)]"
        >
          <Image src="/logo.svg" alt="DynaVest" width={150} height={120} />
        </Link>
      </div>

      <nav className="hidden md:flex gap-7 items-center">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`font-[family-name:var(--font-dm-sans)] font-medium text-base ${
              pathname === item.href ? "text-[#374151]" : "text-[#9CA3AF]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <SuiConnectButton />
        <ChainSelector />
        <ConnectWalletButton />
      </div>
    </header>
  );
}
