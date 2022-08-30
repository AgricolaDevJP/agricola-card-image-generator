import { forgeCardImageGenerator } from "./";
import type { GenerateOccupationParams } from "./domains/GenerateCardParams";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import chromium from "@sparticuz/chrome-aws-lambda";
import puppeteer from "puppeteer";

describe("forgeCardImageGenerator", () => {
  let browser: puppeteer.Browser;

  jest.setTimeout(10000);
  expect.extend({ toMatchImageSnapshot });

  const matchImageSnapshotOptions = {
    failureThreshold: 0.0001,
    failureThresholdType: "percent",
  } as const;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: ["--disable-gpu", "--no-sandbox"],
    });
    chromium.font = jest.fn();
    chromium.puppeteer.launch = jest.fn().mockResolvedValue(browser);
  });

  afterAll(async () => {
    await browser?.close();
  });

  describe("occupation", () => {
    it("generates a card image", async () => {
      const params: GenerateOccupationParams = {
        cardType: "occupation" as const,
        id: "AR018",
        name: "欠陥建築設計士",
        minPlayers: 1,
        description:
          "1部屋建設するたびにそのコストを好きな資材2つ少なくできる。この効果を使って建てた部屋には家族を収容できない。（部屋タイルを斜めに配置して区別する。）",
        mainImage: "https://placehold.jp/300x300.png",
        hasBonusSymbol: false,
      };
      const cardImageGenerator = await forgeCardImageGenerator(params);
      const image = await cardImageGenerator.generate(params);
      expect(image).toMatchImageSnapshot(matchImageSnapshotOptions);
    });
  });
});
