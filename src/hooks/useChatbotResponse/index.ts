import { useMutation } from "@tanstack/react-query";
import type { BotResponse } from "@/types";

export default function useChatbot() {
  return useMutation({
    mutationFn: async (message: string): Promise<BotResponse> => {
      console.log("CHATBOT MESSAGE", message);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHATBOT_URL}/defiInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ input_text: message }),
        }
      );
      return res.json();
    },
  });
}
