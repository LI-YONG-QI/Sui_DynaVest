"use client";

import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { label: "Strategies", href: "/strategies", isActive: true },
  { label: "Bot", href: "/bot" },
  { label: "Quests", href: "/quests" },
];

export default function Header() {
  return (
    <header className="flex justify-between items-center px-20 py-6">
      <div className="flex items-center">
        <Link
          href="/"
          className="text-[#5F79F1] text-[22px] font-[family-name:var(--font-lily-script)]"
        >
          OneVault
        </Link>
      </div>

      <nav className="flex gap-7 items-center">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`font-[family-name:var(--font-dm-sans)] font-medium text-base ${
              item.isActive ? "text-[#374151]" : "text-[#9CA3AF]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <ConnectWalletButton />
    </header>
  );
}
