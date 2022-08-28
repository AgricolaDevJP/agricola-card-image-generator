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
import { z, ZodError } from "zod";
import svg64 from "svg64";

let browser: puppeteer.Browser | undefined;

let occupationTemplate: hogan.Template | undefined;
let occupationTemplateImageBase64: string | undefined;

enum OccupationMinPlayers {
  One = 1,
  Three = 3,
  Four = 4,
  Five = 5,
}

const generateOccupationParamsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  cardType: z.literal("occupation"),
  minPlayers: z.nativeEnum(OccupationMinPlayers),
  hasBonusSymbol: z.boolean(),
  mainImage: z.string().optional(),
});

type GenerateOccupationParams = z.infer<typeof generateOccupationParamsSchema>;

type GenerateCardParams = GenerateOccupationParams;

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
      statusCode: error instanceof ZodError ? 400 : 500,
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
      const params = generateOccupationParamsSchema.parse({
        id: queryStringParams.id,
        name: queryStringParams.name,
        description: queryStringParams.description,
        cardType: "occupation",
        minPlayers: Number(queryStringParams.minPlayers),
        hasBonusSymbol: false,
        mainImage: queryStringParams.mainImage,
      });
      return params;
    default:
      throw Error(`unexpected cardtype: ${queryStringParams.cardType}`);
  }
};

const generateCardImage = async (params: GenerateCardParams) => {
  let html: string = "";
  switch (params.cardType) {
    case "occupation":
      html = await generateOccupationHtml(params);
      break;
    default:
      const _err: never = params.cardType;
  }

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
  } catch (error) {
    throw error;
  } finally {
    if (page !== undefined) {
      await page.close();
    }
  }
};

const getOccupationHtmlTemplate = async (): Promise<{
  template: hogan.Template;
  templateImageBase64: string;
}> => {
  if (occupationTemplate === undefined) {
    const templateHtml = await fs.readFile(
      "./assets/occupationTemplate.mustache",
      {
        encoding: "utf-8",
      }
    );
    occupationTemplate = hogan.compile(templateHtml);
  }
  if (occupationTemplateImageBase64 === undefined) {
    const occupationTemplateImage = await fs.readFile(
      "./assets/occupationTemplateImage.svg",
      {
        encoding: "utf-8",
      }
    );
    occupationTemplateImageBase64 = svg64(occupationTemplateImage);
  }
  return {
    template: occupationTemplate,
    templateImageBase64: occupationTemplateImageBase64,
  };
};

const generateOccupationHtml = async (
  params: GenerateCardParams
): Promise<string> => {
  const { template, templateImageBase64 } = await getOccupationHtmlTemplate();
  const html = template.render({
    templateImageBase64,
    name: params.name,
    id: params.id ?? "",
    minPlayers: params.minPlayers,
    description: params.description,
    mainImage: params.mainImage,
  });
  return html;
};
