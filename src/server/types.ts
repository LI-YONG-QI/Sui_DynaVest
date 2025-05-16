/* eslint-disable */

import type { Address, Hex } from "viem";

export interface Call {
  target: Address;
  callData: Hex;
}

export interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  message?: string;
}
