import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { normalizeSuiAddress, SUI_TYPE_ARG } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import { BucketClient } from "bucket-protocol-sdk";
import { AggregatorClient } from "@cetusprotocol/aggregator-sdk";

export const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
export const bucketClient = new BucketClient();
export const cetusAggregatorClient = new AggregatorClient({});
