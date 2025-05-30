export const KITTY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        name: "sold_id",
        type: "uint256",
      },
      {
        indexed: false,
        name: "tokens_sold",
        type: "uint256",
      },
      {
        indexed: false,
        name: "bought_id",
        type: "uint256",
      },
      {
        indexed: false,
        name: "tokens_bought",
        type: "uint256",
      },
      {
        indexed: false,
        name: "fee",
        type: "uint256",
      },
      {
        indexed: false,
        name: "packed_price_scale",
        type: "uint256",
      },
    ],
    name: "TokenExchange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        name: "token_amounts",
        type: "uint256[2]",
      },
      {
        indexed: false,
        name: "fee",
        type: "uint256",
      },
      {
        indexed: false,
        name: "token_supply",
        type: "uint256",
      },
      {
        indexed: false,
        name: "packed_price_scale",
        type: "uint256",
      },
    ],
    name: "AddLiquidity",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        name: "token_amounts",
        type: "uint256[2]",
      },
      {
        indexed: false,
        name: "token_supply",
        type: "uint256",
      },
    ],
    name: "RemoveLiquidity",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        name: "token_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "coin_index",
        type: "uint256",
      },
      {
        indexed: false,
        name: "coin_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "approx_fee",
        type: "uint256",
      },
      {
        indexed: false,
        name: "packed_price_scale",
        type: "uint256",
      },
    ],
    name: "RemoveLiquidityOne",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "mid_fee",
        type: "uint256",
      },
      {
        indexed: false,
        name: "out_fee",
        type: "uint256",
      },
      {
        indexed: false,
        name: "fee_gamma",
        type: "uint256",
      },
      {
        indexed: false,
        name: "allowed_extra_profit",
        type: "uint256",
      },
      {
        indexed: false,
        name: "adjustment_step",
        type: "uint256",
      },
      {
        indexed: false,
        name: "ma_time",
        type: "uint256",
      },
    ],
    name: "NewParameters",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "initial_A",
        type: "uint256",
      },
      {
        indexed: false,
        name: "future_A",
        type: "uint256",
      },
      {
        indexed: false,
        name: "initial_gamma",
        type: "uint256",
      },
      {
        indexed: false,
        name: "future_gamma",
        type: "uint256",
      },
      {
        indexed: false,
        name: "initial_time",
        type: "uint256",
      },
      {
        indexed: false,
        name: "future_time",
        type: "uint256",
      },
    ],
    name: "RampAgamma",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "current_A",
        type: "uint256",
      },
      {
        indexed: false,
        name: "current_gamma",
        type: "uint256",
      },
      {
        indexed: false,
        name: "time",
        type: "uint256",
      },
    ],
    name: "StopRampA",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "admin",
        type: "address",
      },
      {
        indexed: false,
        name: "tokens",
        type: "uint256[2]",
      },
    ],
    name: "ClaimAdminFee",
    type: "event",
  },
  {
    inputs: [
      {
        name: "_name",
        type: "string",
      },
      {
        name: "_symbol",
        type: "string",
      },
      {
        name: "_coins",
        type: "address[2]",
      },
      {
        name: "_math",
        type: "address",
      },
      {
        name: "_salt",
        type: "bytes32",
      },
      {
        name: "packed_precisions",
        type: "uint256",
      },
      {
        name: "packed_gamma_A",
        type: "uint256",
      },
      {
        name: "packed_fee_params",
        type: "uint256",
      },
      {
        name: "packed_rebalancing_params",
        type: "uint256",
      },
      {
        name: "initial_price",
        type: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "j",
        type: "uint256",
      },
      {
        name: "dx",
        type: "uint256",
      },
      {
        name: "min_dy",
        type: "uint256",
      },
    ],
    name: "exchange",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "j",
        type: "uint256",
      },
      {
        name: "dx",
        type: "uint256",
      },
      {
        name: "min_dy",
        type: "uint256",
      },
      {
        name: "receiver",
        type: "address",
      },
    ],
    name: "exchange",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "j",
        type: "uint256",
      },
      {
        name: "dx",
        type: "uint256",
      },
      {
        name: "min_dy",
        type: "uint256",
      },
    ],
    name: "exchange_received",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "j",
        type: "uint256",
      },
      {
        name: "dx",
        type: "uint256",
      },
      {
        name: "min_dy",
        type: "uint256",
      },
      {
        name: "receiver",
        type: "address",
      },
    ],
    name: "exchange_received",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "amounts",
        type: "uint256[2]",
      },
      {
        name: "min_mint_amount",
        type: "uint256",
      },
    ],
    name: "add_liquidity",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "amounts",
        type: "uint256[2]",
      },
      {
        name: "min_mint_amount",
        type: "uint256",
      },
      {
        name: "receiver",
        type: "address",
      },
    ],
    name: "add_liquidity",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
      {
        name: "min_amounts",
        type: "uint256[2]",
      },
    ],
    name: "remove_liquidity",
    outputs: [
      {
        name: "",
        type: "uint256[2]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
      {
        name: "min_amounts",
        type: "uint256[2]",
      },
      {
        name: "receiver",
        type: "address",
      },
    ],
    name: "remove_liquidity",
    outputs: [
      {
        name: "",
        type: "uint256[2]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "token_amount",
        type: "uint256",
      },
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "min_amount",
        type: "uint256",
      },
    ],
    name: "remove_liquidity_one_coin",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "token_amount",
        type: "uint256",
      },
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "min_amount",
        type: "uint256",
      },
      {
        name: "receiver",
        type: "address",
      },
    ],
    name: "remove_liquidity_one_coin",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
      {
        name: "_deadline",
        type: "uint256",
      },
      {
        name: "_v",
        type: "uint8",
      },
      {
        name: "_r",
        type: "bytes32",
      },
      {
        name: "_s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fee_receiver",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "amounts",
        type: "uint256[2]",
      },
      {
        name: "deposit",
        type: "bool",
      },
    ],
    name: "calc_token_amount",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "j",
        type: "uint256",
      },
      {
        name: "dx",
        type: "uint256",
      },
    ],
    name: "get_dy",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "uint256",
      },
      {
        name: "j",
        type: "uint256",
      },
      {
        name: "dy",
        type: "uint256",
      },
    ],
    name: "get_dx",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lp_price",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "get_virtual_price",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price_oracle",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price_scale",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "token_amount",
        type: "uint256",
      },
      {
        name: "i",
        type: "uint256",
      },
    ],
    name: "calc_withdraw_one_coin",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "amounts",
        type: "uint256[2]",
      },
      {
        name: "xp",
        type: "uint256[2]",
      },
    ],
    name: "calc_token_fee",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "A",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gamma",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mid_fee",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "out_fee",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee_gamma",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allowed_extra_profit",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "adjustment_step",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ma_time",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "precisions",
    outputs: [
      {
        name: "",
        type: "uint256[2]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "xp",
        type: "uint256[2]",
      },
    ],
    name: "fee_calc",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "future_A",
        type: "uint256",
      },
      {
        name: "future_gamma",
        type: "uint256",
      },
      {
        name: "future_time",
        type: "uint256",
      },
    ],
    name: "ramp_A_gamma",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stop_ramp_A_gamma",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_new_mid_fee",
        type: "uint256",
      },
      {
        name: "_new_out_fee",
        type: "uint256",
      },
      {
        name: "_new_fee_gamma",
        type: "uint256",
      },
      {
        name: "_new_allowed_extra_profit",
        type: "uint256",
      },
      {
        name: "_new_adjustment_step",
        type: "uint256",
      },
      {
        name: "_new_ma_time",
        type: "uint256",
      },
    ],
    name: "apply_new_parameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "MATH",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "uint256",
      },
    ],
    name: "coins",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "last_prices",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "last_timestamp",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initial_A_gamma",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initial_A_gamma_time",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "future_A_gamma",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "future_A_gamma_time",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "uint256",
      },
    ],
    name: "balances",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "D",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "xcp_profit",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "xcp_profit_a",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "virtual_price",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "packed_rebalancing_params",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "packed_fee_params",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ADMIN_FEE",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "address",
      },
      {
        name: "arg1",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "salt",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
