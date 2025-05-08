import { RiskPortfolioStrategies, StrategiesSet } from "@/app/utils/types";
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
      { ...this.metadata, text: "Portfolio", id: Date.now().toString() },
      this.amount,
      this.chain,
      MOCK_STRATEGIES_SET // TODO: get real strategies set
    );
  }
}

export class PortfolioMessage extends Message {
  public strategies: RiskPortfolioStrategies[] = [];

  constructor(
    metadata: MessageMetadata,
    public amount: string,
    public chain: number,
    public strategiesSet: StrategiesSet
  ) {
    super(metadata);
  }

  next(action: "build" | "edit"): Message {
    switch (action) {
      case "build":
        return new BuildPortfolioMessage(this.metadata, this.strategies);
      case "edit":
        return new EditMessage(
          this.metadata,
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
    public amount: string,
    public chain: number,
    public strategies: RiskPortfolioStrategies[]
  ) {
    super(metadata);
  }

  next(): Message {
    return new TextMessage(this.metadata);
  }
}

export class BuildPortfolioMessage extends Message {
  constructor(
    metadata: MessageMetadata,
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
