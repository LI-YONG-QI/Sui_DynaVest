import { base } from "viem/chains";

export const SCALLOP_CONTRACTS = {
  [base.id]: {
    scallop:
      "0x83bbe0b3985c5e3857803e2678899b03f3c4a31be75006ab03faf268c014ce41",
    sCoinConvertor: "0x80ca577876dec91ae6d22090e56c39bc60dce9086ab0729930c6900bc4162b4c"
  },
} as const;
