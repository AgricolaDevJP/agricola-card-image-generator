import hogan from "hogan.js";
import svg64 from "svg64";
import { promises as fs } from "fs";
import { strict as assert } from "assert";
import type { GenerateOccupationParams } from "../../domains/GenerateCardParams";
import type { CardHtmlGenerator } from "./";

export class OccupationHtmlGenerator implements CardHtmlGenerator {
  private template: hogan.Template | undefined;
  private templateImageBase64: string | undefined;

  public static async newCardHtmlGenerator(): Promise<OccupationHtmlGenerator> {
    const cardHtmlGenerator = new OccupationHtmlGenerator();
    await cardHtmlGenerator.setTemplate();
    return cardHtmlGenerator;
  }

  private async setTemplate() {
    await Promise.all([this.setTemplateHtml(), this.setTemplateImageBase64()]);
  }

  private async setTemplateHtml() {
    const templateHtml = await fs.readFile("./assets/occupationTemplate.mustache", {
      encoding: "utf-8",
    });
    this.template = hogan.compile(templateHtml);
  }

  private async setTemplateImageBase64() {
    const templateImage = await fs.readFile("./assets/occupationTemplateImage.svg", {
      encoding: "utf-8",
    });
    this.templateImageBase64 = svg64(templateImage);
  }

  public async generate(params: GenerateOccupationParams): Promise<string> {
    assert(this.template);
    assert(this.templateImageBase64);

    const html = this.template.render({
      templateImageBase64: this.templateImageBase64,
      name: params.name,
      id: params.id ?? "",
      minPlayers: params.minPlayers,
      description: params.description,
      mainImage: params.mainImage,
    });
    return html;
  }
}
