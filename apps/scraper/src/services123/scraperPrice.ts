import puppeteer from "puppeteer";
import fs from "fs";

export async function scrapeWebPagePrice(
  url: string,
  ProductName: string
): Promise<void> {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Required due to security protections (bypass Cloudflare's bot detection) (nlyman)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );

  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });

  // Required to fetch all information on some sites (elgiganten)
  // Note: 2 seconds may be excessive (should be tested)
  await new Promise<void>((r) => setTimeout(r, 2000));

  // Find all <script> elements with type "application/ld+json"
  const ldJsonScripts = await page.$$eval(
    'script[type="application/ld+json"]',
    (scripts) => {
      return scripts.map((script) => JSON.parse(script.innerHTML));
    }
  );

  fs.writeFileSync("data/test.json", JSON.stringify(ldJsonScripts, null, 2));

  for (const script of ldJsonScripts) {
    if (Array.isArray(script.offers)) {
      if (script.offers.length > 0 && script.offers[0].price) {
        console.log(
          ProductName + " pris: " + script.offers.price + " kr (no object)"
        );
        return script.offers[0].price;
      }
    } else if (script.offers && script.offers.price) {
      // If "offers" is an object, access the price directly
      console.log(
        ProductName + " pris: " + script.offers.price + " kr (object)"
      );
      return script.offers.price;
    }
  }

  await browser.close();
}
