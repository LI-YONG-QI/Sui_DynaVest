import { base, bsc, celo } from "viem/chains";
import type { Token } from "../types";

export const USDT: Token = {
  name: "USDT",
  icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [base.id]: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  },
};

export const USDC: Token = {
  name: "USDC",
  icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    [bsc.id]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  },
};

export const CELO: Token = {
  name: "CELO",
  icon: "https://cryptologos.cc/logos/celo-celo-logo.png",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  },
};

export const FLOW: Token = {
  name: "FLOW",
  icon: "https://cryptologos.cc/logos/flow-flow-logo.png",
  decimals: 18,
  isNativeToken: true,
};

export const cEUR: Token = {
  name: "cEUR",
  icon: "https://cryptologos.cc/logos/flow-flow-logo.png",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  },
};
