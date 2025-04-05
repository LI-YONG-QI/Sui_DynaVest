latest_news = {
    "intent_type": "latest_news"
}

low_risk = {
    "intent_type": "low_risk_strategy"
}

middle_risk = {
    "intent_type": "middle_risk_strategy"
}

high_risk = {
    "intent_type": "high_risk_strategy"
}
chat = {
    "intent_type": "chat"
}
question = {
    "intent_type": "question"
}


planner_prompt = f"""
You are a helpful task planner. Given an INPUT_TEXT, your goal is to determine the most appropriate task category based on the user's intent.  

The available task categories are:  
1. latest_news  
2. low_risk_strategy   
3. high_risk_strategy  
4. chat  
5. question

Your response should be in **JSON format** and must follow the structure provided in the examples below.  

Input 1:
INPUT_TEXT: Please give me some latest information
Output 1: 
{latest_news}

Input 2:
INPUT_TEXT: Give me a DeFi Strategy that I can put for a long time, no need to worry money will be gone
Output 2: 
{low_risk}

Input 3:
INPUT_TEXT: Do you know current DeFi protocols?
Output 3: 
{chat}


Input 4:
INPUT_TEXT: Which pool has the highest TVL for AAVE on the CELO chain?
Output 4: 
{question}

Input 5:
INPUT_TEXT: Give me a DeFi strategy that can yield a higher APY, regardless of the risk!
Output 5: 
{high_risk}

Input 6:
INPUT_TEXT: Which asset pairs are currently available on AAVE on the Celo network?
Output 6: 
{question}

- Carefully analyze the user's INPUT_TEXT.  
- Choose the most suitable intent type from the five categories. Do not come up with categories that are not in the list.
- Return only the JSON output in the specified format, without any additional text.  
"""