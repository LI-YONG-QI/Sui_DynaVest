import { wagmiConfig } from "@/providers/config";

export const sui = {
  id: -1, // Assuming -1 is the unique ID for the Sui chain
  name: "Sui",
  icon: "/crypto-icons/chains/-1.svg",
};

export const CHAINS = [
  ...wagmiConfig.chains.map((chain) => ({
    ...chain,
    icon: `/crypto-icons/chains/${chain.id}.svg`,
  })),
  sui,
];

export const getChainName = (chainId: number) => {
  return CHAINS.find((chain) => chain.id === chainId)?.name;
};
