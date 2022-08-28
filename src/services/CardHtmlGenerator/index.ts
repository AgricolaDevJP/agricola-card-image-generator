import type { GenerateCardParams } from "../../domains/GenerateCardParams";
import { unreachable } from "../../utilities";
import { OccupationHtmlGenerator } from "./OccupationHtmlGenerator";

export interface CardHtmlGenerator {
  generate(params: GenerateCardParams): Promise<string>;
}

export { OccupationHtmlGenerator } from "./OccupationHtmlGenerator";

export class CardHtmlGeneratorImpl implements CardHtmlGenerator {
  private occupationHtmlGenerator: OccupationHtmlGenerator | undefined;

  public async generate(params: GenerateCardParams): Promise<string> {
    switch (params.cardType) {
      case "occupation":
        if (this.occupationHtmlGenerator === undefined) {
          this.occupationHtmlGenerator = await OccupationHtmlGenerator.newCardHtmlGenerator();
        }
        return await this.occupationHtmlGenerator.generate(params);
      default:
        return unreachable();
    }
  }
}
