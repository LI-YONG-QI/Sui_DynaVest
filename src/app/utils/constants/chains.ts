import { celo, flowMainnet, base, bsc, arbitrum, polygon } from "viem/chains";

export const CHAINS = [
  {
    name: "Arbitrum",
    id: arbitrum.id,
    icon: "/crypto-icons/arb.svg",
  },
  {
    name: "Base",
    id: base.id,
    icon: "/crypto-icons/base.png",
  },
  {
    name: "BSC",
    id: bsc.id,
    icon: "/crypto-icons/bnb.svg",
  },
  {
    name: "Celo",
    id: celo.id,
    icon: "/crypto-icons/celo.svg",
  },
  {
    name: "Flow",
    id: flowMainnet.id,
    icon: "/crypto-icons/flow.svg",
  },
  {
    name: "Polygon",
    id: polygon.id,
    icon: "/crypto-icons/polygon.svg",
  },
];
