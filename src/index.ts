import type { GenerateCardParams } from "./domains/GenerateCardParams";
import {
  parseGenerateCardParamsFromBody,
  ValidationError,
} from "./services/parseGenerateCardParams";
import { HtmlImageGeneratorImpl } from "./services/CardImageGenerator/HtmlImageGenerator";
import { OccupationHtmlGenerator } from "./services/CardImageGenerator/CardHtmlGenerator";
import { CardImageGenerator, CardImageGeneratorImpl } from "./services/CardImageGenerator";

import type { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { ZodError } from "zod";
import { match } from "ts-pattern";
import hogan from "hogan.js";
import { promises as fs } from "fs";
import svg64 from "svg64";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chrome-aws-lambda";
import { resolve } from "path";

interface HandlerStates {
  occupationTemplate: hogan.Template | undefined;
  occupationTemplateImageBase64: string | undefined;
  browser: puppeteer.Browser | undefined;
}

const states: HandlerStates = {
  occupationTemplate: undefined,
  occupationTemplateImageBase64: undefined,
  browser: undefined,
};

export const handler = async (
  event: APIGatewayEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): Promise<APIGatewayProxyResult> => {
  let params: GenerateCardParams | undefined;
  try {
    params = parseGenerateCardParamsFromBody(event.body);
  } catch (error) {
    if (error instanceof ZodError || error instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error }),
      };
    }
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }

  try {
    const cardImageGenerator = await forgeCardImageGenerator(params);
    const image = await cardImageGenerator.generate(params);
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: image.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }
};

export const forgeCardImageGenerator = async (
  params: GenerateCardParams
): Promise<CardImageGenerator> => {
  const cardHtmlGenerator = await match(params.cardType)
    .with("occupation", async () => await prepareOccupationHtmlGenerator())
    .exhaustive();

  const htmlImageGenerator = await prepareHtmlImageGenerator();

  return new CardImageGeneratorImpl(cardHtmlGenerator, htmlImageGenerator);
};

export const prepareOccupationHtmlGenerator = async () => {
  if (states.occupationTemplate === undefined) {
    const templateHtml = await fs.readFile(
      resolve(__dirname, "assets/occupationTemplate.mustache"),
      {
        encoding: "utf-8",
      }
    );
    states.occupationTemplate = hogan.compile(templateHtml);
  }
  if (states.occupationTemplateImageBase64 === undefined) {
    const templateImage = await fs.readFile(
      resolve(__dirname, "assets/occupationTemplateImage.svg"),
      {
        encoding: "utf-8",
      }
    );
    states.occupationTemplateImageBase64 = svg64(templateImage);
  }
  return new OccupationHtmlGenerator(
    states.occupationTemplate,
    states.occupationTemplateImageBase64
  );
};

export const prepareHtmlImageGenerator = async () => {
  if (states.browser === undefined) {
    await chromium.font(resolve(__dirname, "assets/fonts/NotoSansCJKjp-Regular.otf"));
    states.browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }
  return new HtmlImageGeneratorImpl(states.browser);
};
