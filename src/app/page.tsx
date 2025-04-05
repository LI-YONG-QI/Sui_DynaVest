"use client";

import Image from "next/image";
import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import useChatbot from "./hooks/useChatbot";
import { Message } from "./types";
import { format } from "date-fns";

const HOT_TOPICS = [
  {
    icon: "/atom.svg",
    title: "Strategy: Give me top-performing DeFi strategies on Base",
  },
  {
    icon: "/uni-hat.svg",
    title: "Learn: What is a delta-neutral strategy",
  },
  {
    icon: "/bar-chart.svg",
    title: "Trend: Give me an analysis on current crypto market",
  },
];

export default function Home() {
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: sendMessage, isPending: loadingBotResponse } =
    useChatbot();

  const handleCommand = (command: string) => {
    setCommand(command);
    // Focus the input field after setting the command
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // TODO: Handle Ask AI
  const handleAskAI = async (e: FormEvent) => {
    e.preventDefault();
    if (command.trim() === "") return;

    console.log("Command:", command);
    // Process the command here
    // Reset form if needed

    // Add user message to conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      text: command,
      sender: "user",
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setCommand("");

    try {
      const botResponse = await sendMessage(command);
      if (!botResponse || !botResponse.result) return;

      // Add bot response to conversation
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.result,
        sender: "bot",
        timestamp: new Date(),
      };

      // Start typewriter effect
      setIsTyping(true);
      let currentText = "";
      const textToType = botResponse.result;

      for (let i = 0; i < textToType.length; i++) {
        currentText += textToType[i];
        setTypingText(currentText);
        // Slow down the typing speed
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      setIsTyping(false);
      setTypingText("");
      setConversation((prev) => [...prev, botMessage]);
    } catch {
      // TODO: handle AI error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, errorMessage]);
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && command.trim() !== "") {
      e.preventDefault();
      handleAskAI(e as unknown as FormEvent);
    }
  };

  // TODO
  const handleHotTopic = (topic: string) => {
    setCommand(topic);
    // Focus the input field after setting the command
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isTyping]);

  return (
    <div className="">
      <div className="">
        <h2 className="text-[48px] font-extrabold font-[family-name:var(--font-manrope)] text-[#141A21] mb-8 text-center">
          DeFAI Strategies Advisor
        </h2>

        {/* Search Bar */}
        <form
          onSubmit={handleAskAI}
          className="flex justify-between items-center w-full px-5 py-2.5 border border-[#5F79F1]/30 rounded-lg bg-white"
        >
          <input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            className="outline-none text-[#A0ACC5] font-[family-name:var(--font-manrope)] font-medium text-base w-[90%]"
            placeholder="Ask OneVault AI anything. Make DeFi investment easy and simple."
          />
          <button
            type="submit"
            disabled={command.trim() === ""}
            className="bg-[#5F79F1] disabled:bg-[#5F79F1]/50 text-white px-5 py-3 rounded-lg font-[family-name:var(--font-manrope)] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask AI
          </button>
        </form>

        {/* Commands Section */}
        <div className="flex items-center gap-2 mt-5 self-start">
          <span className="text-black font-[family-name:var(--font-manrope)] text-sm">
            Commands
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleCommand("Deposit 100 USDT to Morpho Finance")
              }
              className="cursor-pointer px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm"
            >
              Deposit
            </button>
            <button
              onClick={() =>
                handleCommand("Withdraw 100 USDT from Morpho Finance")
              }
              className="cursor-pointer px-[13px] py-[5px] bg-[#F3F5F6] rounded-lg text-[#444444] text-[10px] font-semibold font-[family-name:var(--font-inter)] shadow-sm"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Hot Topics */}
        {conversation.length === 0 && (
          <div className="mt-5 self-start">
            <h3 className="text-[#160211] font-[family-name:var(--font-manrope)] font-bold text-2xl mb-4">
              Hot Topics
            </h3>
            <div className="flex flex-col gap-3">
              {HOT_TOPICS.map((topic) => (
                <button
                  key={topic.title}
                  onClick={() => handleHotTopic(topic.title)}
                  className="w-fit flex items-center bg-white rounded-[14px] px-4 py-1.5 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={topic.icon}
                    width={12}
                    height={12}
                    className="h-6 w-6 mr-2 object-contain"
                    alt={topic.title}
                  />
                  {topic.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bot Response */}
        <div className="mt-8 rounded-xl overflow-hidden mx-auto">
          <div className="p-4 h-[400px] overflow-y-auto">
            {conversation.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>
                  Ask me anything about DeFi strategies or use the quick
                  commands above!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-[#5F79F1] text-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-gray-500"
                            : "text-blue-100"
                        }`}
                      >
                        {format(message.timestamp, "HH:mm")}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading animation or typing effect */}
                {loadingBotResponse && (
                  <div className="flex justify-start">
                    <div className="bg-[#5F79F1] text-white max-w-[80%] rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Typewriter effect */}
                {isTyping && typingText && (
                  <div className="flex justify-start">
                    <div className="bg-[#5F79F1] text-white max-w-[80%] rounded-2xl px-4 py-3">
                      <div className="whitespace-pre-wrap">{typingText}</div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
