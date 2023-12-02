import puppeteer from "puppeteer";
import fs from "fs";

export async function scrapeWebPagePrice(
  url: string
): Promise<{ name: string; price: number | null }> {
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
  // This works when the website use use JSON-LD to include structured data (works almost everywhere).
  const ldJsonScripts = await page.$$eval(
    'script[type="application/ld+json"]',
    (scripts) => {
      return scripts.map((script) => JSON.parse(script.innerHTML));
    }
  );

  // Uncomment to save scraped content in files. 
  // const content = await page.content();
  // fs.writeFileSync("data/test_working.json", content);
  // fs.writeFileSync("data/test.json", JSON.stringify(ldJsonScripts, null, 2));



  // Finding the price and the name of the product
  for (const script of ldJsonScripts) {
    let prodName = "";
    if (script['@type'] === 'Product' && script.name) {
      console.log("namnet:" + script.name);
      prodName = script.name;
    }
    if (Array.isArray(script.offers)) {
      if (script.offers.length > 0 && script.offers[0].price) {
        console.log(
          prodName + " pris: " + script.offers[0].price + " kr (no object)"
        );
        await browser.close();
        return { name: prodName, price: script.offers[0].price };
      }
    } else if (script.offers && script.offers.price) {
      // If "offers" is an object, access the price directly
      console.log(
        prodName + " pris: " + script.offers.price + " kr (object)"
      );
      await browser.close();
      return { name: prodName, price: script.offers.price };
    }
  }

  await browser.close();
  return { name: "", price: null };
}
