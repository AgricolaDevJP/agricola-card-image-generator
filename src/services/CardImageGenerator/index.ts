import chromium from "@sparticuz/chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { strict as assert } from "assert";

export class CardImageGenerator {
  private browser: puppeteer.Browser | undefined;

  public static async newCardImageGenerator(): Promise<CardImageGenerator> {
    const cardImageGenerator = new CardImageGenerator();
    await cardImageGenerator.initializeBrowser();
    return cardImageGenerator;
  }

  private async initializeBrowser() {
    await chromium.font("/var/task/assets/fonts/NotoSansCJKjp-Regular.otf");
    this.browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }

  public async generate(html: string): Promise<string> {
    assert(this.browser);
    let page: puppeteer.Page | undefined;
    try {
      page = await this.browser.newPage();
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
    } finally {
      if (page !== undefined) {
        await page.close();
      }
    }
  }
}
