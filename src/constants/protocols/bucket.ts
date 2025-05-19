import { base } from "viem/chains";

export const BUCKET_CONTRACTS = {
  [base.id]: {
    bucket:
      "0x0b6ba9889bb71abc5fa89e4ad5db12e63bc331dba858019dd8d701bc91184d79",
    deToken:
      "0x9b1afe356c35a59e682047038fe73ed3204e3ac777242c2a7ea9e6c5eb6afab3",
    butCoinType:
      "0xbc858cb910b9914bee64fff0f9b38855355a040c49155a17b265d9086d256545::but::BUT",
    bucketProtocolType:
      "0x3a4b399e18cec6129723c71605378bd554f53eb63afc1039f9af9a067a8847fa::bucket::BUCKET",
  },
} as const;
