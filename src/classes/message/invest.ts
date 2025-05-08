import { Message, MessageMetadata } from "./base";
import { PortfolioMessage } from "./portfolio";
import { MOCK_STRATEGIES_SET } from "@/test/constants/strategiesSet";
import { arbitrum } from "viem/chains";

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
