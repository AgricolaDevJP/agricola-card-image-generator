import type { CardHtmlGenerator } from "./CardHtmlGenerator";
import type { HtmlImageGenerator } from "./HtmlImageGenerator";
import type { GenerateCardParams } from "../../domains/GenerateCardParams";

export interface CardImageGenerator {
  generate(params: GenerateCardParams): Promise<Buffer>;
}

export class CardImageGeneratorImpl implements CardImageGenerator {
  constructor(
    private cardHtmlGenerator: CardHtmlGenerator,
    private htmlImageGenerator: HtmlImageGenerator
  ) {}

  public async generate(params: GenerateCardParams): Promise<Buffer> {
    const html = await this.cardHtmlGenerator.generate(params);
    const image = await this.htmlImageGenerator.generate(html);
    return image;
  }
}
