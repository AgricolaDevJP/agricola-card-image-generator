import hogan from "hogan.js";
import { promises as fs } from "fs";
import type {
  Context,
  APIGatewayProxyResult,
  APIGatewayEvent,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import chromium from "@sparticuz/chrome-aws-lambda";
import puppeteer from "puppeteer-core";

type GenerateCardParams = GenerateOccupationParams;

interface GenerateOccupationParams {
  id: string | undefined;
  name: string;
  description: string;
  cardType: "occupation";
  minPlayers: 1 | 3 | 4 | 5 | 6;
}

let template: hogan.Template | undefined;
let browser: puppeteer.Browser | undefined;

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let params: GenerateCardParams | undefined;
  try {
    params = validateParameters(event.queryStringParameters);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }

  let image: string | undefined;
  try {
    image = await generateCardImage(params);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "image/png" },
    body: image,
    isBase64Encoded: true,
  };
};

const validateParameters = (
  queryStringParams: APIGatewayProxyEventQueryStringParameters | null
): GenerateCardParams => {
  if (queryStringParams === null) {
    throw Error("parameters are undefined");
  }
  switch (queryStringParams.cardType) {
    case "occupation":
      const minPlayers = Number(queryStringParams.minPlayers!);
      if (
        minPlayers !== 1 &&
        minPlayers !== 3 &&
        minPlayers !== 4 &&
        minPlayers !== 5 &&
        minPlayers !== 6
      ) {
        throw Error(`minPlayers must be 1, 3, 4, 5 or 6: ${minPlayers}`);
      }

      return {
        id: queryStringParams.id || undefined,
        name: queryStringParams.name!,
        description: queryStringParams.description!,
        cardType: "occupation",
        minPlayers,
      };
    default:
      throw Error(`unexpected cardtype: ${queryStringParams.cardType}`);
  }
};

const generateCardImage = async (
  params: GenerateCardParams
): Promise<string> => {
  if (template === undefined) {
    const templateHtml = await fs.readFile("./assets/index.html", {
      encoding: "utf-8",
    });
    template = hogan.compile(templateHtml);
  }

  const html = template.render({
    name: params.name,
    id: params.id || "",
    minPlayers: params.minPlayers,
    description: params.description,
  });

  let page: puppeteer.Page | undefined;
  try {
    if (browser === undefined) {
      await chromium.font("/var/task/assets/fonts/NotoSansCJKjp-Regular.otf");
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    }

    page = await browser.newPage();
    await page.setViewport({
      width: 446, // 118 mm
      height: 688, // 182 mm
    });
    await page.setContent(html);

    const screenshot = (await page.screenshot({
      type: "png",
      encoding: "base64",
    })) as string;
    return screenshot;
  } catch (error: unknown) {
    throw error;
  } finally {
    if (page !== undefined) {
      await page.close();
    }
  }
};
