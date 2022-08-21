import hogan from "hogan.js";
import { promises as fs } from "fs";
import type {
  Context,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";
import chromium from "@sparticuz/chrome-aws-lambda";
import puppeteer from "puppeteer-core";

let template: hogan.Template | undefined;
let browser: puppeteer.Browser | undefined;

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const [image, error] = await generateCardImage();
  if (error) {
    console.error(error);
    return {
      statusCode: 400,
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

const generateCardImage = async (): Promise<[string, unknown | undefined]> => {
  if (template === undefined) {
    const templateHtml = await fs.readFile("./assets/index.html", {
      encoding: "utf-8",
    });
    template = hogan.compile(templateHtml);
  }

  const html = template.render({
    name: "欠陥建築設計士",
    id: "AR018",
    minPlayers: 1,
    description: `1部屋建設するたびにその建設コストを好きな資材2つ少なくできる。そうした場合、建設した部屋には人物を収容できない。（部屋タイルを斜めに配置して区別する。）`,
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
    return [screenshot, undefined];
  } catch (error: unknown) {
    return ["", error];
  } finally {
    if (page !== undefined) {
      await page.close();
    }
  }
};
