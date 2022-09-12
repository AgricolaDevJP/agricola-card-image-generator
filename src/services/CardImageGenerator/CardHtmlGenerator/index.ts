import type { GenerateCardParams } from "../../../domains/GenerateCardParams";

export interface CardHtmlGenerator {
  generate(params: GenerateCardParams): Promise<string>;
}

export { OccupationHtmlGenerator } from "./OccupationHtmlGenerator";
export { MinorImprovementHtmlGenerator } from "./MinorImprovementHtmlGenerator";
