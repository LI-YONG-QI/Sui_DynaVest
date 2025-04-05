"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";

// Message type definition
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatroomProps {
  isVisible: boolean;
}

const Chatroom = ({ isVisible }: ChatroomProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with your DeFi investments today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isVisible && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isVisible, isMinimized]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm processing your request. This is a simulated response for now.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl z-50 transition-all duration-300 transform ${
        isMinimized ? "translate-y-0" : "max-h-[600px] h-[550px] translate-y-0"
      }`}
    >
      {/* Header */}
      <div
        className={`bg-[#5F79F1] text-white flex items-center justify-between pl-5 pr-3 py-5`}
      >
        <div className="flex items-center gap-x-3">
          <div className="flex items-center justify-center mt-1">
            <Image
              src="/ask-onevault-bot-icon.png"
              alt="Bot"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="leading-5">
            <h3 className="font-bold text-lg leading-5">OneVault Bot</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-100">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={toggleMinimize}
          className="bg-opacity-20 flex items-center rounded-full p-1.5 hover:bg-opacity-30 transition-all"
        >
          {isMinimized ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div className="bg-gray-50 p-4 h-[calc(100%-150px)] overflow-y-auto">
            <div className="flex flex-col gap-y-10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex items-end mb-1 relative ${
                      message.sender === "user" ? "justify-end" : ""
                    }`}
                  >
                    {/* User icons */}
                    {message.sender === "bot" && (
                      <div className="absolute bottom-[-35px] left-0 z-10 flex-shrink-0 mr-2 order-first bg-[#4558AF] rounded-full p-[5px]">
                        <Image
                          src="/ask-onevault-bot-icon.png"
                          alt="Bot"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    )}
                    {message.sender === "user" && (
                      <div className="flex-shrink-0 ml-2 order-last absolute bottom-[-35px] right-[-10px] z-10">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                          U
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div
                      className={`absolute bottom-[-25px] text-[10px] mt-1 text-gray-500 ${
                        message.sender === "user" ? "right-10" : "left-10"
                      }`}
                    >
                      {format(message.timestamp, "HH:mm")}
                    </div>

                    {/* Chat bubble */}
                    <div
                      className={`relative px-4 py-2 rounded-lg max-w-[250px] ${
                        message.sender === "user"
                          ? "bg-gray-200 text-gray-800 rounded-br-none"
                          : "bg-[#5F79F1] text-white ml-4"
                      }`}
                    >
                      {/* Chat bubble pointer */}
                      <div
                        className={`absolute bottom-[-8px] ${
                          message.sender === "user"
                            ? "right-0 border-t-16 border-t-gray-200 border-l-16"
                            : "left-0 border-t-16 border-t-[#5F79F1] border-r-16"
                        } border-l-transparent border-r-transparent`}
                      />
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex-grow relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5F79F1] focus:border-transparent resize-none placeholder:text-gray-500 text-gray-500"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ""}
                className="bg-[#5F79F1] text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4A64DC] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatroom;
