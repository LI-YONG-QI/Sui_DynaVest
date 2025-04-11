import { createConfig } from "@privy-io/wagmi";
import { mainnet, sepolia, celo, flowMainnet, base } from "viem/chains";
import { http } from "wagmi";

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const wagmiConfig = createConfig({
  chains: [celo, base, flowMainnet, mainnet, sepolia],
  transports: {
    [celo.id]: http(`https://celo-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [flowMainnet.id]: http(
      `https://flow-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    ),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  },
});
