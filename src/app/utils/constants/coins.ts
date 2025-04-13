import { base, bsc, celo } from "viem/chains";
import type { Token } from "../types";

export const USDT: Token = {
  name: "USDT",
  icon: "/crypto-icons/usdt.svg",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [base.id]: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  },
};

export const USDC: Token = {
  name: "USDC",
  icon: "/crypto-icons/usdc.svg",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    [bsc.id]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  },
};

export const CELO: Token = {
  name: "CELO",
  icon: "/crypto-icons/celo.svg",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  },
};

export const FLOW: Token = {
  name: "FLOW",
  icon: "/crypto-icons/flow.svg",
  decimals: 18,
  isNativeToken: true,
};

export const cEUR: Token = {
  name: "cEUR",
  icon: "/crypto-icons/cEUR.png",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  },
};
