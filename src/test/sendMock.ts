// TODO: replace with actual API call

export const sendMockInvestMessage = async (
  message: string
): Promise<{ result: string }> => {
  // For demo purposes, we're including our mock strategy in the response
  console.log("message", message);
  return {
    result: "build_portfolio",
  };
};

export const sendMockPortfolioMessage = async (
  message: string
): Promise<{ result: string }> => {
  // For demo purposes, we're including our mock strategy in the response
  console.log("send mock portfolio message", message);
  return {
    result: `pie_chart`,
  };
};

export const sendMockChangePercentageMessage = async (
  message: string
): Promise<{ result: string }> => {
  console.log("message", message);
  return {
    result: "edit_portfolio",
  };
};

export const sendMockReviewMessage = async (
  message: string
): Promise<{ result: string }> => {
  console.log("message", message);
  return {
    result: "review_portfolio",
  };
};

export const sendMockBuildPortfolioMessage = async (
  message: string
): Promise<{ result: string }> => {
  console.log("message", message);

  return {
    result: "build_portfolio_2",
  };
};

export const sendMockFindDeFiStrategiesMessage = async (
  message: string
): Promise<{ result: string }> => {
  console.log("message", message);
  return {
    result: "middle_risk_strategy",
  };
};

export const sendMockDeFiStrategiesCardMessage = async (
  message: string
): Promise<{ result: string }> => {
  console.log("message", message);
  return {
    result: "defi_strategies_card",
  };
};
