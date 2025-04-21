"use client";

import Image from "next/image";
import { useState } from "react";

const PROFILE_TABS = [
  {
    label: "Assets",
    value: "assets",
  },
  {
    label: "Strategies",
    value: "strategies",
  },
  {
    label: "Transactions",
    value: "transactions",
  },
];

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState(PROFILE_TABS[0].value);

  return (
    <div className="pb-10">
      <div className="bg-white rounded-lg min-h-[80vh] p-8">
        {/*  Header - Icon Section and action buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0">
              <Image
                src="/profile-icon.svg"
                alt="Profile"
                className="rounded-full bg-blue-500 object-cover"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="flex gap-2 items-center">
                <h1 className="text-[#141A21] font-bold text-2xl">Alison</h1>
                <button className="border border-solid border-black rounded-sm h-5 w-5 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 32 32"
                    className="h-4 w-4"
                  >
                    <path d="M 4.0175781 4 L 13.091797 17.609375 L 4.3359375 28 L 6.9511719 28 L 14.246094 19.34375 L 20.017578 28 L 20.552734 28 L 28.015625 28 L 18.712891 14.042969 L 27.175781 4 L 24.560547 4 L 17.558594 12.310547 L 12.017578 4 L 4.0175781 4 z M 7.7558594 6 L 10.947266 6 L 24.279297 26 L 21.087891 26 L 7.7558594 6 z"></path>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-5 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">User Id</span>{" "}
                  <span className="text-sm font-bold">12345</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">Joined</span>{" "}
                  <span className="text-sm font-bold">12345</span>
                </div>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2EDFF] rounded-lg hover:bg-[#d0e0ff] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
              </svg>
              <span>Edit Name</span>
            </button>
            <div className="h-8 w-px bg-[#c4d8f7]"></div>
            <button className="rounded-lg px-4 py-2 bg-[#E2EDFF] hover:bg-[#d0e0ff] transition-colors">
              <span>Deposit</span>
            </button>
            <button className="rounded-lg px-4 py-2 bg-[#E2EDFF] hover:bg-[#d0e0ff] transition-colors">
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="flex gap-10 items-center mb-8">
          <div>
            <h4 className="text-sm text-gray-300">Available Balance</h4>
            <p className="text-lg font-bold tracking-wide">$ 123,456</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-300">TVL</h4>
            <p className="text-lg font-bold tracking-wide">$15</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-300">Total Profilt</h4>
            <p className="text-green-500 font-bold tracking-wide">$0.04</p>
          </div>
        </div>

        {/* Assets/Strategies/Transactions tabs */}
        <div className="mb-8 border-b border-gray-300 gap-x-5 flex">
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`py-2 hover:bg-[#d0e0ff] border-b-4 font-bold transition-colors ${
                selectedTab === tab.value
                  ? "font-bold border-black"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TODO: Assets/Strategies/Transactions Table */}
        <div></div>
      </div>
    </div>
  );
}
