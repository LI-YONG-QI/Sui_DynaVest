"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Undo2, FileCheck, MoveUpRight } from "lucide-react";
import { format } from "date-fns";

import type { Message, MessagePortfolioData, MessageType } from "./types";
import useChatbot from "@/app/hooks/useChatbotResponse";
import RiskPortfolio, {
  getRiskDescription,
} from "@/app/components/RiskPortfolio";
import ChangePercentList from "@/app/components/ChangePercentList";
import { InvestmentFormChatWrapper } from "@/app/components/InvestmentFormChatWrapper";
import {
  sendMockChangePercentageMessage,
  sendMockReviewMessage,
  sendMockInvestMessage,
  sendMockBuildPortfolioMessage,
  sendMockFindDeFiStrategiesMessage,
  sendMockDeFiStrategiesCardMessage,
} from "@/test/sendMock";
import { MOCK_STRATEGIES_SET } from "@/test/constants/strategiesSet";
import { useStrategiesSet } from "@/app/hooks/useStrategiesSet";
import { RiskBadgeList } from "./components/RiskBadgeList";
import DepositChatWrapper from "./components/DepositChatWrapper";
import { BOT_STRATEGY } from "./utils/constants/strategies";
import { useChat } from "./contexts/ChatContext";
import { useAccount, useBalance } from "wagmi";
import { parseUnits } from "viem";
import ChainFilter from "./components/StrategyList/ChainFilter";
import { RISK_OPTIONS } from "./utils/constants/risk";
import Button from "./components/Button";
import StrategyListChatWrapper from "./components/StrategyListChatWrapper";
import { getChainName } from "./utils/constants/chains";
export default function Home() {
  const [isInput, setIsInput] = useState(false);
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const {
    selectedChains,
    setSelectedChains,
    selectedRiskLevel,
    setSelectedRiskLevel,
    selectedStrategies,
    setSelectedStrategies,
  } = useStrategiesSet(MOCK_STRATEGIES_SET); // TODO: remove mock data
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: sendMessage, isPending: loadingBotResponse } =
    useChatbot();
  const { closeChat } = useChat();

  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: BOT_STRATEGY.tokens[0].chains![selectedChains[0]],
    chainId: selectedChains[0],
  });

  const chainsName = selectedChains
    .map((chainId) => getChainName(chainId))
    .join(" / ");

  // TODO: build a high relation between `MessageType` and `createBotMessage` `renderBotMessageContent`
  const createBotMessage = (botResponse: { result: string }): Message => {
    let type: MessageType = "Text";
    let text = "";
    let data: MessagePortfolioData | undefined;

    switch (botResponse.result) {
      case "build_portfolio":
        text =
          "We will diversify your token into reputable and secured yield protocols based on your preference.\nWhat's your investment size (Base by default)? ";
        type = "Invest";
        break;
      case "pie_chart":
        text = "What's your Risk/Yield and Airdrop portfolio preference?";
        type = "Portfolio";
        break;
      case "edit_portfolio":
        type = "Edit";
        break;
      case "review_portfolio":
        type = "Review Portfolio";
        data = {
          risk: selectedRiskLevel,
          strategies: selectedStrategies,
        };
        break;
      case "middle_risk_strategy":
        text =
          "No problem. What's your Chain and Risk preference? I'll find DeFi strategies meet your preference. ";
        type = "Find Defi Strategies";
        // TODO: data should'nt be included in the message
        data = {
          risk: selectedRiskLevel,
          strategies: selectedStrategies,
        };
        break;
      case "build_portfolio_2": // TODO: rename
        if (parseUnits(depositAmount, 6) > (balance?.value ?? BigInt(0))) {
          text =
            "Oops, you have insufficient balance in your wallet. You can deposit or change amount.";
          type = "Deposit Funds";
          // TODO: data should'nt be included in the message
          data = {
            risk: selectedRiskLevel,
            strategies: selectedStrategies,
          };
        } else {
          text = "Start building portfolio...";
          type = "Build Portfolio";
        }
        break;
      case "defi_strategies_card":
        text = `Here’re some ${selectedRiskLevel} risk DeFi yield strategies from reputable and secured platform on ${chainsName}`;
        type = "DeFi Strategies Cards";
        // TODO: data should'nt be included in the message
        data = {
          risk: selectedRiskLevel,
          strategies: selectedStrategies,
        };
        break;
      default:
        text = botResponse.result;
        break;
    }

    // Add bot response to conversation
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      type,
      data,
    };

    // For Portfolio and Edit types, set this message as being edited
    if (
      type === "Portfolio" ||
      type === "Edit" ||
      type === "Deposit Funds" ||
      type === "Find Defi Strategies"
    ) {
      setIsEditing(true);
    }

    return botMessage;
  };

  const getMessageData = (message: Message) => {
    const validateEditable = (message: Message) => {
      return (
        message.id === conversation[conversation.length - 1].id && // The latest message conversation
        isEditing === true
      );
    };

    const { data } = message;
    const isEditable = validateEditable(message);

    if (!isEditable && !data) {
      throw new Error("Portfolio data is required");
    }

    const risk = isEditable ? selectedRiskLevel : data!.risk;
    const strategies = isEditable ? selectedStrategies : data!.strategies;

    return { isEditable, risk, strategies };
  };

  const nextStep = (
    userInput: string,
    sendMsg: (message: string) => Promise<{
      result: string;
    }>
  ) => {
    const settleMessage = (message: Message) => {
      // Update the message with the current data
      const updatedConversation = conversation.map((convMsg) => {
        if (convMsg.id === message.id) {
          return {
            ...convMsg,
            data: {
              risk: selectedRiskLevel,
              strategies: selectedStrategies,
            },
          };
        }
        return convMsg;
      });

      setConversation(updatedConversation);
      setIsEditing(false);
    };

    settleMessage(conversation[conversation.length - 1]);
    handleMessage(userInput, sendMsg);
  };

  /// HANDLE FUNCTIONS ///
  const handleHotTopic = (topic: string) => {
    setCommand(topic);
    // Focus the input field after setting the command
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleMessage = async (
    userInput: string,
    sendMsg: (message: string) => Promise<{
      result: string;
    }>
  ) => {
    const addUserMessage = (message: string) => {
      if (message === "") return;
      // Add user message to conversation
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: new Date(),
        type: "Text",
      };

      setConversation((prev) => [...prev, userMessage]);
      setCommand("");
    };

    addUserMessage(userInput);

    try {
      const botResponse = await sendMsg(userInput);
      if (!botResponse || !botResponse.result) return;
      const botMessage = createBotMessage(botResponse);

      await handleTypingText(botMessage);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        type: "Text",
      };

      setConversation((prev) => [...prev, errorMessage]);
    }
  };

  const handleTypingText = async (botMessage: Message) => {
    setIsTyping(true);
    let currentText = "";
    const textToType = botMessage.text;

    for (let i = 0; i < textToType.length; i++) {
      currentText += textToType[i];
      setTypingText(currentText);
      // Slow down the typing speed
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    setIsTyping(false);
    setTypingText("");
    setConversation((prev) => [...prev, botMessage]);
  };

  // Handle key press in input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && command.trim() !== "") {
      e.preventDefault();
      handleMessage(command, sendMessage);
    }
  };

  const renderBotMessageContent = (message: Message) => {
    if (message.sender !== "bot") return null;

    switch (message.type) {
      case "Invest":
        return (
          <InvestmentFormChatWrapper
            selectedChains={selectedChains}
            setSelectedChains={setSelectedChains}
            nextStep={nextStep}
            setDepositAmount={setDepositAmount}
          />
        );
      case "Portfolio": {
        const {
          isEditable,
          risk: messageRisk,
          strategies,
        } = getMessageData(message);

        return (
          <div className="mt-4 overflow-x-auto max-w-full w-full flex justify-center">
            <div className="w-full max-w-[320px] md:max-w-none">
              <div className="flex flex-col gap-3">
                <div className="rounded-[0px_10px_10px_10px] p-4 flex flex-col gap-6">
                  {/* Risk preference selection */}
                  <RiskBadgeList
                    selectedRisk={messageRisk}
                    isEditable={isEditable}
                    setSelectedRiskLevel={setSelectedRiskLevel}
                    options={RISK_OPTIONS}
                  />

                  <div className="flex items-center">
                    <p className="text-gray text-xs md:text-sm font-normal px-1">
                      {getRiskDescription(messageRisk)}
                    </p>
                  </div>
                </div>
              </div>

              <RiskPortfolio
                buildPortfolio={() =>
                  nextStep("Build portfolio", sendMockBuildPortfolioMessage)
                }
                changePercent={() =>
                  nextStep("Change percentage", sendMockChangePercentageMessage)
                }
                riskPortfolioStrategies={strategies}
              />
            </div>
          </div>
        );
      }
      case "Edit": {
        const { isEditable, strategies } = getMessageData(message);

        return (
          <div className="overflow-x-auto max-w-full">
            <ChangePercentList
              riskPortfolioStrategies={strategies}
              setRiskPortfolioStrategies={setSelectedStrategies}
              isEditable={isEditable}
              nextStep={() => nextStep("", sendMockReviewMessage)}
            />
          </div>
        );
      }
      case "Review Portfolio": {
        const { strategies } = getMessageData(message);

        return (
          <div className="mt-4 overflow-x-auto max-w-full w-full flex justify-center">
            <div className="w-full min-w-[600px] md:max-w-none">
              <RiskPortfolio
                buildPortfolio={() =>
                  nextStep("Build portfolio", sendMockBuildPortfolioMessage)
                }
                changePercent={() =>
                  nextStep("Change percentage", sendMockChangePercentageMessage)
                }
                riskPortfolioStrategies={strategies}
              />
            </div>
          </div>
        );
      }
      case "Build Portfolio": {
        return (
          <div className="flex flex-col gap-4">
            <p className="mt-4 text-lg font-bold">
              ${depositAmount} USDC Portfolio complete!
            </p>
            <div className="flex flex-col gap-2">
              {selectedStrategies.map((strategy, index) => (
                <p className="text-sm text-gray-400" key={index}>
                  {strategy.title} {strategy.allocation}% $
                  {(strategy.allocation * Number(depositAmount)) / 100}
                </p>
              ))}
            </div>
            <div className="flex gap-5">
              <button className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5">
                <FileCheck />
                <span className="text-sm font-semibold">
                  Check my portfolio
                </span>
              </button>
              <button className="flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5">
                <MoveUpRight />
                <span className="text-sm font-semibold">
                  Explore more DeFi Investment
                </span>
              </button>
            </div>
          </div>
        );
      }
      case "Deposit Funds": {
        const { isEditable } = getMessageData(message);

        return (
          <DepositChatWrapper
            setDepositAmount={setDepositAmount}
            depositAmount={depositAmount}
            isEditable={isEditable}
            nextStep={nextStep}
            strategy={{
              ...BOT_STRATEGY,
              chainId: selectedChains[0],
            }}
          />
        );
      }
      case "Find Defi Strategies": {
        const { isEditable } = getMessageData(message);

        return (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="font-[Manrope] font-medium text-sm">
                Select Chains
              </p>
              <ChainFilter
                selectedChains={selectedChains}
                setSelectedChains={setSelectedChains}
              />
            </div>
            <div className="flex items-center gap-2">
              <p className="font-[Manrope] font-medium text-sm">Select Risk</p>
              <RiskBadgeList
                selectedRisk={selectedRiskLevel}
                setSelectedRiskLevel={setSelectedRiskLevel}
                options={RISK_OPTIONS.filter(
                  (option) =>
                    option !== "Balanced" && option !== "High Airdrop Potential"
                )}
                isEditable={isEditable}
              />
            </div>
            <Button
              onClick={() =>
                nextStep(
                  `Find ${selectedRiskLevel} risk DeFi strategies on ${chainsName}`,
                  sendMockDeFiStrategiesCardMessage
                )
              }
              text="Find DeFi Strategies"
              icon={<MoveUpRight />}
            />
          </div>
        );
      }

      case "DeFi Strategies Cards": {
        return (
          <StrategyListChatWrapper
            selectedChains={selectedChains}
            selectedRiskLevel={selectedRiskLevel}
          />
        );
      }

      default:
        return null;
    }
  };

  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isTyping]);

  useEffect(() => {
    const latestMessage = conversation[conversation.length - 1];
    setIsInput(
      latestMessage?.type === "Text" ||
        latestMessage?.type === "Find Defi Strategies" ||
        latestMessage?.type === "DeFi Strategies Cards"
    );
  }, [conversation]);

  useEffect(() => {
    closeChat();
  }, []);

  return (
    <div className="h-[80vh]">
      <div
        className={`flex flex-col ${
          conversation.length > 0 ? "flex-1" : "h-full"
        }`}
      >
        {conversation.length === 0 ? (
          <>
            {/* Welcome Message and Options UI based on Figma design */}
            <div className="flex flex-col gap-10 w-full max-w-[805px] mx-auto px-4 md:px-0">
              {/* Welcome Message */}
              <div className="w-full">
                <div className="text-[#17181C] rounded-[0px_10px_10px_10px] p-4 ">
                  <h2 className="font-[Manrope] font-extrabold text-lg mb-2">
                    👋 Welcome to DynaVest Bot!
                  </h2>
                  <p className="font-[Manrope] font-medium text-sm">
                    I&apos;m a DeFi investment bot. Ask me anything about DeFi
                    yield strategies, portfolio management, or use one of our
                    built-in functions below to get started.
                  </p>
                </div>
              </div>

              {/* Built-in Functions */}
              <div className="flex flex-col items-center gap-2.5 w-full max-w-[771px]">
                <p className="font-[Manrope] font-medium text-sm text-center w-full">
                  Choose a built-in function
                </p>
                <div className="flex flex-col md:flex-row justify-stretch gap-4 w-full">
                  <button
                    className="w-full bg-[#5F79F1] text-white rounded-[11px] py-3 px-4 flex justify-center items-center"
                    onClick={() =>
                      handleMessage(
                        "Build a diversified DeFi Portfolio",
                        sendMockInvestMessage
                      )
                    }
                  >
                    <span className="font-[Manrope] font-semibold text-base text-center">
                      Build a diversified DeFi Portfolio
                    </span>
                  </button>
                  <button
                    className="w-full bg-[#5F79F1] text-white rounded-[11px] py-3 px-4 flex justify-center items-center"
                    onClick={() =>
                      handleMessage(
                        "Analyze and adjust my DeFi Portfolio",
                        sendMessage
                      )
                    }
                  >
                    <span className="font-[Manrope] font-semibold text-base text-center">
                      Analyze and adjust my DeFi Portfolio
                    </span>
                  </button>
                  <button
                    className="w-full bg-[#5F79F1] text-white rounded-[11px] py-3 px-4 flex justify-center items-center"
                    onClick={() =>
                      handleMessage("Deposit into my wallet", sendMessage)
                    }
                  >
                    <span className="font-[Manrope] font-semibold text-base text-center">
                      Deposit into my wallet
                    </span>
                  </button>
                </div>
              </div>

              {/* Hot Topics */}
              <div className="flex-col items-center gap-3.5 w-full max-w-[771px] md:flex hidden">
                <p className="font-[Manrope] font-medium text-sm text-center w-full text-black">
                  Explore hot topics
                </p>
                <div className="flex flex-col w-full gap-4">
                  <button
                    className="w-full bg-[rgba(255,255,255,0.7)] text-black rounded-[14px] py-1.5 px-5 flex items-center gap-1.5"
                    onClick={() =>
                      handleMessage(
                        "Help me find the best DeFi strategies",
                        sendMockFindDeFiStrategiesMessage
                      )
                    }
                  >
                    <span className="font-[Manrope] font-bold text-sm">
                      DeFi Strategy:
                    </span>
                    <span className="font-[Manrope] font-medium text-sm truncate">
                      Help me find the best DeFi strategies
                    </span>
                  </button>
                  <button
                    className="w-full bg-[rgba(255,255,255,0.7)] text-black rounded-[14px] py-1.5 px-5 flex items-center gap-1.5"
                    onClick={() => handleHotTopic("Learn more about DeFi")}
                  >
                    <span className="font-[Manrope] font-bold text-sm">
                      DynaVest Academy:
                    </span>
                    <span className="font-[Manrope] font-medium text-sm truncate">
                      Learn more about DeFi
                    </span>
                  </button>
                  <button
                    className="w-full bg-[rgba(255,255,255,0.7)] text-black rounded-[14px] py-1.5 px-5 flex items-center gap-1.5"
                    onClick={() =>
                      handleHotTopic(
                        "Give me an analysis on current crypto market"
                      )
                    }
                  >
                    <span className="font-[Manrope] font-bold text-sm">
                      Trend:
                    </span>
                    <span className="font-[Manrope] font-medium text-sm truncate">
                      Give me an analysis on current crypto market
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex fixed w-[95%] md:w-[50%] bottom-[75px] md:bottom-5 left-1/2 -translate-x-1/2 gap-4 z-10">
              <div className="flex-1 border border-[rgba(113,128,150,0.5)] bg-white rounded-lg px-5 py-2.5 flex items-center">
                <input
                  ref={inputRef}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 outline-none text-black font-[Manrope] font-medium text-base"
                  placeholder="Ask me anything about DeFi strategies or use the quick commands"
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleMessage(command, sendMessage);
                }}
                disabled={command.trim() === ""}
                className="flex justify-center items-center min-w-[50px] h-[50px] bg-gradient-to-r from-[#AF95E3] to-[#7BA9E9] p-2 rounded-lg disabled:opacity-50 shrink-0"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Chat View */}
            {/* Welcome Message at top of conversation */}
            <div className="w-full max-w-[805px] mx-auto px-4 md:px-0">
              <div className="mx-auto mb-4">
                <div className="text-[#17181C] rounded-[0px_10px_10px_10px] p-4">
                  <h2 className="font-[Manrope] font-extrabold text-lg mb-2">
                    👋 Welcome to DynaVest Bot!
                  </h2>
                  <p className="font-[Manrope] font-medium text-sm">
                    I&apos;m a DeFi investment bot. Ask me anything about DeFi
                    yield strategies, portfolio management, or use one of our
                    built-in functions below to get started.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2 md:px-4 py-6">
                <div className="flex flex-col gap-6 pb-24">
                  {/* Conversion */}
                  {conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        message.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[90%] md:max-w-[80%] rounded-2xl py-3 ${
                          message.sender === "user"
                            ? "bg-white text-black px-4"
                            : "bg-transparent text-gray-800"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.text}
                        </div>

                        {/* Render bot message content by response type */}
                        {renderBotMessageContent(message)}

                        <div
                          className={`text-xs mt-3 ${
                            message.sender === "user"
                              ? "text-gray-500"
                              : "text-black"
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
                      <div className="text-black max-w-[90%] md:max-w-[80%] rounded-2xl py-3">
                        <div className="whitespace-pre-wrap break-words">
                          {typingText}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Command Form Input */}
            <div className="flex flex-col w-[95%] md:w-[50%] gap-4 justify-center items-center fixed bottom-[10px] left-1/2 -translate-x-1/2 z-10">
              <div
                className={`flex w-full gap-4 ${
                  isInput ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex-1 border border-[rgba(113,128,150,0.5)] bg-white rounded-lg px-5 py-2.5 flex items-center">
                  <input
                    ref={inputRef}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 outline-none text-black font-[Manrope] font-medium text-base"
                    placeholder="Ask me anything about DeFi strategies or use the quick commands"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleMessage(command, sendMessage);
                  }}
                  disabled={command.trim() === ""}
                  className="flex justify-center items-center min-w-[50px] h-[50px] bg-gradient-to-r from-[#AF95E3] to-[#7BA9E9] p-2 rounded-lg disabled:opacity-50 shrink-0"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col relative w-[95%] md:w-[70%] gap-4">
                <div className="flex justify-center">
                  {/* Start new chat button  */}
                  <button
                    className={`flex items-center gap-2.5 py-3 px-6 md:py-4 md:px-8 text-[16px] rounded-[11px] self-end ${
                      loadingBotResponse || isTyping
                        ? "bg-[#D3D8F3]"
                        : "bg-[#9EACEB]"
                    } text-[rgba(0,0,0,0.6)]`}
                    disabled={loadingBotResponse || isTyping}
                    onClick={() => {
                      setConversation([]);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Undo2 className="w-5 h-5" />

                    <span className="font-[Plus Jakarta Sans] font-semibold text-sm">
                      Start a new chat
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
