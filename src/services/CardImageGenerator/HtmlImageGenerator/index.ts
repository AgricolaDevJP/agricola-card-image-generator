import puppeteer from "puppeteer-core";

export interface HtmlImageGenerator {
  generate(html: string): Promise<Buffer>;
  close(): Promise<void>;
}

export class HtmlImageGeneratorImpl implements HtmlImageGenerator {
  constructor(private browser: puppeteer.Browser) {}

  public async generate(html: string): Promise<Buffer> {
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
        encoding: "binary",
      })) as Buffer;
      return screenshot;
    } finally {
      if (page !== undefined) {
        await page.close();
      }
    }
  }

  public async close(): Promise<void> {
    await this.browser.close();
  }
}
