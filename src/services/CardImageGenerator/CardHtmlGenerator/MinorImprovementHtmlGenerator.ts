import type { GenerateMinorImprovementParams } from "../../../domains/GenerateCardParams";
import type { CardHtmlGenerator } from ".";
import hogan from "hogan.js";

export class MinorImprovementHtmlGenerator implements CardHtmlGenerator {
  constructor(private template: hogan.Template, private templateImageBase64: string) {}

  public async generate(params: GenerateMinorImprovementParams): Promise<string> {
    const html = this.template.render({
      templateImageBase64: this.templateImageBase64,
      name: params.name,
      id: params.id ?? "",
      description: params.description,
      mainImage: params.mainImage,
    });
    return html;
  }
}
