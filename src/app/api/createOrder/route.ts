/* eslint-disable */

import {
  SDK,
  HashLock,
  PrivateKeyProviderConnector,
  NetworkEnum,
} from "@1inch/cross-chain-sdk";
import { Web3 } from "web3";
import {
  solidityPackedKeccak256,
  randomBytes,
  Contract,
  Wallet,
  JsonRpcProvider,
} from "ethers";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";

dotenv.config();

function getRandomBytes32() {
  return "0x" + Buffer.from(randomBytes(32)).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Missing token amount in request body" },
        { status: 400 }
      );
    }

    const {
      WALLET_KEY: makerPrivateKey,
      WALLET_ADDRESS: makerAddress,
      RPC_URL: nodeUrl,
      DEV_PORTAL_KEY: devPortalApiKey,
    } = process.env;

    if (!makerPrivateKey || !makerAddress || !nodeUrl || !devPortalApiKey) {
      return NextResponse.json(
        { error: "Missing required environment variables." },
        { status: 500 }
      );
    }

    const web3Instance = new Web3(nodeUrl) as any;

    const blockchainProvider = new PrivateKeyProviderConnector(
      makerPrivateKey,
      web3Instance
    );

    const sdk = new SDK({
      url: "https://api.1inch.dev/fusion-plus",
      authKey: devPortalApiKey,
      blockchainProvider,
    });

    let srcChainId = NetworkEnum.ETHEREUM;
    let dstChainId = NetworkEnum.COINBASE;
    let srcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    let dstTokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

    /*
    const invert = false;
    if (invert) {
      const temp = srcChainId;
      srcChainId = dstChainId;
      dstChainId = temp;

      const tempAddress = srcTokenAddress;
      srcTokenAddress = dstTokenAddress;
      dstTokenAddress = tempAddress;
    }
    */

    const approveABI = [
      {
        constant: false,
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    try {
      const provider = new JsonRpcProvider(nodeUrl);
      const tokenContract = new Contract(
        srcTokenAddress,
        approveABI,
        new Wallet(makerPrivateKey, provider)
      );
      await tokenContract.approve(
        "0x111111125421ca6dc452d289314280a0f8842a65",
        BigInt(2) ** BigInt(256) - BigInt(1)
      );
    } catch (error: any) {
      console.error("Error during token approval:", error);
      return NextResponse.json(
        { error: "Token approval failed", details: error.message },
        { status: 500 }
      );
    }

    const params = {
      srcChainId,
      dstChainId,
      srcTokenAddress,
      dstTokenAddress,
      amount,
      enableEstimate: true,
      walletAddress: makerAddress,
    };

    const quote = await sdk.getQuote(params);
    const secretsCount = quote.getPreset().secretsCount;

    const secrets = Array.from({ length: secretsCount }).map(() =>
      getRandomBytes32()
    );
    const secretHashes = secrets.map((secret) => HashLock.hashSecret(secret));

    const hashLock =
      secretsCount === 1
        ? HashLock.forSingleFill(secrets[0])
        : HashLock.forMultipleFills(
            secretHashes.map((secretHash, i) =>
              solidityPackedKeccak256(
                ["uint64", "bytes32"],
                [i, secretHash.toString()]
              )
            ) as any
          );

    console.log("Received Fusion+ quote from 1inch API");

    let quoteResponse;
    try {
      quoteResponse = await sdk.placeOrder(quote, {
        walletAddress: makerAddress,
        hashLock,
        secretHashes,
      });
    } catch (error: any) {
      console.error("Error during order processing:", error);
      return NextResponse.json(
        {
          error: "Order processing failed",
          details: JSON.stringify(error, null, 2),
        },
        { status: 500 }
      );
    }

    const orderHash = quoteResponse.orderHash;
    console.log("Order successfully placed");

    const intervalId = setInterval(async () => {
      console.log(
        `Polling for fills until order status is set to "executed"...`
      );
      try {
        const orderStatus = await sdk.getOrderStatus(orderHash);
        if (orderStatus.status === "executed") {
          console.log(`Order is complete. Exiting polling.`);
          clearInterval(intervalId);
        }
      } catch (error: any) {
        console.error("Error getting order status:", error);
      }

      try {
        const fillsObject = await sdk.getReadyToAcceptSecretFills(orderHash);
        if (fillsObject.fills && fillsObject.fills.length > 0) {
          for (const fill of fillsObject.fills) {
            try {
              await sdk.submitSecret(orderHash, secrets[fill.idx]);
              console.log(
                `Fill found! Submitted secret: ${secretHashes[fill.idx]}`
              );
            } catch (error: any) {
              console.error("Error submitting secret:", error);
            }
          }
        }
      } catch (error: any) {
        if (error.response) {
          console.error("Error getting ready to accept secret fills:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          });
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    }, 5000);

    return NextResponse.json({
      message: "Order successfully placed",
      orderHash,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
