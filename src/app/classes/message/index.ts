import type {
  RiskLevel,
  RiskPortfolioStrategies,
  StrategiesSet,
} from "@/app/utils/types";
import { MOCK_STRATEGIES_SET } from "@/test/constants/strategiesSet";
import { arbitrum } from "viem/chains";

export type MessageMetadata = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export abstract class Message {
  constructor(public metadata: MessageMetadata) {}

  abstract next(action?: string): Message;

  protected createDefaultMetadata(text: string): MessageMetadata {
    return {
      ...this.metadata,
      text,
      id: Date.now().toString(),
    };
  }
}

export class TextMessage extends Message {
  constructor(metadata: MessageMetadata) {
    super(metadata);
  }

  next(): Message {
    throw new Error("TextMessage does not have next message");
  }
}

export class InvestMessage extends Message {
  public amount: string = "0";
  public chain: number = arbitrum.id;

  constructor(metadata: MessageMetadata, _chain?: number) {
    super(metadata);
    if (_chain) {
      this.chain = _chain;
    }
  }

  next(): Message {
    return new PortfolioMessage(
      this.createDefaultMetadata(`Portfolio: ${this.amount} USDC`),
      this.amount,
      this.chain,
      MOCK_STRATEGIES_SET // TODO: get real strategies set
    );
  }
}

export class PortfolioMessage extends Message {
  public strategies: RiskPortfolioStrategies[] = [];
  public risk: RiskLevel = "low";

  constructor(
    metadata: MessageMetadata,
    public readonly amount: string,
    public readonly chain: number,
    public readonly strategiesSet: StrategiesSet
  ) {
    super(metadata);
  }

  next(action: "build" | "edit" | "deposit"): Message {
    switch (action) {
      case "build":
        return new BuildPortfolioMessage(
          this.createDefaultMetadata("Build"),
          this.amount,
          this.strategies
        );
      case "edit":
        return new EditMessage(
          this.createDefaultMetadata("Edit"),
          this.amount,
          this.chain,
          this.strategies
        );
      case "deposit":
        return new DepositMessage(
          this.createDefaultMetadata("Deposit"),
          this.amount,
          this.chain,
          this.strategies
        );
    }
  }
}

export class EditMessage extends Message {
  constructor(
    metadata: MessageMetadata,
    public readonly amount: string,
    public readonly chain: number,
    public strategies: RiskPortfolioStrategies[]
  ) {
    super(metadata);
  }

  next(): Message {
    return new ReviewPortfolioMessage(
      this.createDefaultMetadata("Review"),
      this.amount,
      this.chain,
      this.strategies
    );
  }
}

export class ReviewPortfolioMessage extends Message {
  constructor(
    metadata: MessageMetadata,
    public readonly amount: string,
    public readonly chain: number,
    public readonly strategies: RiskPortfolioStrategies[]
  ) {
    super(metadata);
  }

  next(action: "build" | "edit" | "deposit"): Message {
    switch (action) {
      case "build":
        return new BuildPortfolioMessage(
          this.createDefaultMetadata("Build"),
          this.amount,
          this.strategies
        );
      case "edit":
        return new EditMessage(
          this.createDefaultMetadata("Edit"),
          this.amount,
          this.chain,
          this.strategies
        );
      case "deposit":
        return new DepositMessage(
          this.createDefaultMetadata("Deposit"),
          this.amount,
          this.chain,
          this.strategies
        );
    }
  }
}

export class BuildPortfolioMessage extends Message {
  constructor(
    metadata: MessageMetadata,
    public amount: string,
    public strategies: RiskPortfolioStrategies[]
  ) {
    super(metadata);
  }

  next(): Message {
    return new TextMessage(this.metadata);
  }

  execute(): void {
    this.strategies.forEach((strategy) => {
      console.log(strategy.title);
    });

    console.log("Portfolio built successfully");
  }
}

export class DepositMessage extends Message {
  constructor(
    metadata: MessageMetadata,
    public amount: string,
    public readonly chain: number,
    public strategies: RiskPortfolioStrategies[]
  ) {
    super(metadata);
  }

  next(action: "build" | "portfolio"): Message {
    switch (action) {
      case "portfolio":
        return new PortfolioMessage(
          this.createDefaultMetadata(`Portfolio: ${this.amount} USDC`),
          this.amount,
          this.chain,
          MOCK_STRATEGIES_SET
        );
      case "build":
        return new BuildPortfolioMessage(
          this.createDefaultMetadata("Build"),
          this.amount,
          this.strategies
        );
    }
  }

  execute(): void {
    console.log("Deposit executed successfully");
  }
}

export class FindStrategiesMessage extends Message {
  public risk: RiskLevel = "low";
  public chain: number = arbitrum.id;

  constructor(metadata: MessageMetadata, _risk?: RiskLevel, _chain?: number) {
    super(metadata);

    if (_risk) {
      this.risk = _risk;
    }

    if (_chain) {
      this.chain = _chain;
    }
  }

  next(): Message {
    return new StrategiesCardsMessage(
      this.createDefaultMetadata("DeFi Strategies Cards"),
      this.risk,
      this.chain
    );
  }
}

export class StrategiesCardsMessage extends Message {
  constructor(
    metadata: MessageMetadata,
    public readonly risk: RiskLevel,
    public readonly chain: number
  ) {
    super(metadata);
  }

  next(): Message {
    throw new Error(
      "StrategiesCardsMessage does not have default next message"
    );
  }
}
