import { base, bsc, celo, arbitrum, polygon } from "viem/chains";

import type { Token } from "@/types";
import { sui } from "./chains";

export const USDT: Token = {
  name: "USDT",
  icon: "/crypto-icons/usdt.svg",
  decimals: 6,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [arbitrum.id]: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    [base.id]: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    [bsc.id]: "0x55d398326f99059fF775485246999027B3197955",
  },
};

export const USDC: Token = {
  name: "USDC",
  icon: "/crypto-icons/usdc.svg",
  decimals: 6,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    [bsc.id]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    [polygon.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    [sui.id]:
      "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
  },
};

export const ETH: Token = {
  name: "ETH",
  icon: "/crypto-icons/eth.svg",
  decimals: 18,
  isNativeToken: true,
  ecosystem: "EVM",
};

export const BNB: Token = {
  name: "BNB",
  icon: "/crypto-icons/chains/56.svg",
  decimals: 18,
  isNativeToken: true,
  ecosystem: "EVM",
};

export const SUI: Token = {
  name: "SUI",
  icon: "/crypto-icons/chains/-1.svg",
  decimals: 9,
  isNativeToken: false,
  ecosystem: "SUI",
  chains: {
    [sui.id]: "0x2::sui::SUI",
  },
};

export const BUT: Token = {
  name: "BUT",
  icon: "/crypto-icons/but.jpeg",
  decimals: 9,
  isNativeToken: false,
  ecosystem: "SUI",
  chains: {
    [sui.id]:
      "0xbc858cb910b9914bee64fff0f9b38855355a040c49155a17b265d9086d256545::but::BUT",
  },
};

export const wstETH: Token = {
  name: "wstETH",
  icon: "/crypto-icons/wstETH.webp",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [base.id]: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
    [arbitrum.id]: "0x5979D7b546E38E414F7E9822514be443A4800529",
  },
};

export const wbETH: Token = {
  name: "wbETH",
  icon: "/crypto-icons/wbeth.webp",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [bsc.id]: "0xa2E3356610840701BDf5611a53974510Ae27E2e1",
  },
};

export const cbBTC: Token = {
  name: "cbBTC",
  icon: "/crypto-icons/cbBTC.svg",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [base.id]: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
  },
};

export const CELO: Token = {
  name: "CELO",
  icon: "/crypto-icons/chains/42220.svg",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [celo.id]: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  },
};

export const FLOW: Token = {
  name: "FLOW",
  icon: "/crypto-icons/chains/747.svg",
  decimals: 18,
  isNativeToken: true,
  ecosystem: "EVM",
};

export const cEUR: Token = {
  name: "cEUR",
  icon: "/crypto-icons/cEUR.png",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [celo.id]: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  },
};

export const WETH: Token = {
  name: "WETH",
  icon: "/crypto-icons/weth.svg",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [base.id]: "0x4200000000000000000000000000000000000006",
    [arbitrum.id]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
};

export const GRAIL: Token = {
  name: "GRAIL",
  icon: "/crypto-icons/grail.svg",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [arbitrum.id]: "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8",
  },
};

export const xGRAIL: Token = {
  name: "xGRAIL",
  icon: "/crypto-icons/xgrail.svg",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [arbitrum.id]: "0x3CAaE25Ee616f2C8E13C74dA0813402eae3F496b",
  },
};

export const WBNB: Token = {
  name: "WBNB",
  icon: "/crypto-icons/bnb.svg",
  decimals: 18,
  isNativeToken: false,
  ecosystem: "EVM",
  chains: {
    [bsc.id]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
};

export function getWrappedToken(token: Token): Token {
  if (token.isNativeToken) {
    switch (token.name) {
      case "ETH":
        return WETH;
      case "BNB":
        return WBNB;
      default:
        throw new Error("Token does't have wrapped token");
    }
  } else {
    throw new Error("Token does't have wrapped token");
  }
}

export const COINGECKO_IDS = {
  [USDT.name]: "tether",
  [USDC.name]: "usd-coin",
  [ETH.name]: "ethereum",
  [BNB.name]: "binancecoin",
  [SUI.name]: "sui",
  [BUT.name]: "bucket-token",
};
