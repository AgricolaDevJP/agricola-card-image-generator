import type { Browser, Page } from "puppeteer";

declare global {
  const browser: Browser;
  const page: Page;
}
