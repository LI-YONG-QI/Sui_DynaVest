// import { Address } from "viem";
// import { flowMainnet } from "viem/chains";
// import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

// import { BaseStrategy } from "../baseStrategy";
// import { FLOW_STRATEGY_ABI } from "@/constants/abis";
// import { wagmiConfig as config } from "@/providers/config";

// type FlowSupportedChains = typeof flowMainnet.id;

// /**
//  * @deprecated
//  */

// export class FlowStrategy extends BaseStrategy<FlowSupportedChains> {
//   public readonly strategy: Address =
//     "0xe6fe0766ff66b8768181b0f3f46e8e314f9277e0";

//   constructor(chainId: number) {
//     super(chainId);
//   }

//   async execute(
//     user: Address,
//     _asset: Address,
//     amount: bigint
//   ): Promise<string> {
//     const result = await writeContract(config, {
//       address: this.strategy,
//       abi: FLOW_STRATEGY_ABI,
//       functionName: "execute",
//       args: [],
//       value: amount,
//     });

//     await waitForTransactionReceipt(config, {
//       hash: result,
//     });

//     return result;
//   }

//   isSupported(chainId: number): boolean {
//     return chainId === flowMainnet.id;
//   }
// }
