import tiktoken 
import requests
import os
from dotenv import load_dotenv
load_dotenv()

COMPLETIONS_MODEL = "gpt-4o-mini"

def num_tokens_from_string(string: str, encoding_name = COMPLETIONS_MODEL) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def get_token_balances(wallet_address):
    endpoint = f'https://api.1inch.dev/balance/v1.2/1/balances/{wallet_address}'
    response = requests.get(endpoint, headers={'Authorization': os.getenv("INCH_API_KEY")})

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch token balances. Error code: {response.status_code}")
        return None



import requests

method = "get"
apiUrl = "https://api.1inch.dev/fusion-plus/orders/v1.0/order/active"
requestOptions = {
      "headers": {
  "Authorization": "Bearer 1esOPPGlyWZiREGQEQE9mn8zeHLhykR"
},
      "body": "",
      "params": {}
}

# Prepare request components
headers = requestOptions.get("headers", {})
body = requestOptions.get("body", {})
params = requestOptions.get("params", {})


response = requests.get(apiUrl, headers=headers, params=params)

print(response.json())
# def main():
#     # Replace '0xYourWalletAddress' with the Ethereum wallet address you want to check
#     wallet_address = '0xf7b10d603907658f690da534e9b7dbc4dab3e2d6'
#     token_balances = get_token_balances(wallet_address)

#     if token_balances:
#         print(f"Token balances for wallet address {wallet_address}:")
#         for token, balance in token_balances.items():
#             print(f"{token}: {balance}")
#     else:
#         print("Token balance fetch failed. Please check your wallet address.")





# if __name__ == '__main__':
#     main()