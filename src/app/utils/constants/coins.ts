import { celo, base } from "viem/chains";
import type { Token } from "../types";

export const USDT: Token = {
  name: "USDT",
  icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

export const USDC: Token = {
  name: "USDC",
  icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b89d2Fb44",
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

export const CELO: Token = {
  name: "CELO",
  icon: "https://cryptologos.cc/logos/celo-celo-logo.png",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b89d2Fb44",
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

export const FLOW: Token = {
  name: "FLOW",
  icon: "https://cryptologos.cc/logos/flow-flow-logo.png",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b89d2Fb44",
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

export const cEUR: Token = {
  name: "cEUR",
  icon: "https://cryptologos.cc/logos/flow-flow-logo.png",
  decimals: 18,
  isNativeToken: false,
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b89d2Fb44",
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};
