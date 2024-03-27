import puppeteer from "puppeteer";

export async function scrapeWebPagePrice(
  url: string,
  ProductName: string,
): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Required due to security protections (bypass Cloudflare's bot detection) (nlyman)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  );

  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });

  // Find all <script> elements with type "application/ld+json"
  const ldJsonScripts = await page.$$eval(
    'script[type="application/ld+json"]',
    (scripts) => {
      return scripts.map((script) => JSON.parse(script.innerHTML));
    },
  );

  const prices: string[] = [];

  for (const script of ldJsonScripts) {
    if (Array.isArray(script.offers)) {
      if (script.offers.length > 0 && script.offers[0].price) {
        console.log(ProductName + " pris: " + script.offers[0].price + " kr");
        prices.push(script.offers[0].price);
      }
      // TODO: Tror att det är lugnt om det är en lista av offer att ta första. Kontrollera innan detta tas bort.
      //   for (const offer of script.offers) {
      //     if (offer.price) {
      //       console.log("Priss: " + offer.price);
      //     }
      //   }
    } else if (script.offers && script.offers.price) {
      // If "offers" is an object, access the price directly
      console.log(ProductName + " pris: " + script.offers.price + " kr");
      prices.push(script.offers.price);
    }
  }

  await browser.close();
  return prices;
}
