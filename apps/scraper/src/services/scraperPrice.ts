import puppeteer from "puppeteer";
import fs from "fs";

export async function scrapeWebPagePrice(url: string): Promise<{ name: string; price: number | null }> {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Required configurations
  await configurePage(page, url);


  let result;

  // Finding the price and the name of the product
  // #1 method, works 90 percent of the time
  console.log("Initiating method #1")
  result = await findPriceAndName(page);

  if (!result.price || !result.name) {
    // #2 method, loop through selectors
    console.log("Initiating method #2")
    result = await findPriceAndNameBroad(page);
    if (!result.price || !result.name) {
      result.price = 999999
    }
  }


  await browser.close();
  return result;
}

async function configurePage(page: puppeteer.Page, url: string) {
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );
  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1024 });

  // Required to fetch all information on some sites (elgiganten)
  // Note: 2 seconds may be excessive (should be tested)
  await new Promise<void>((r) => setTimeout(r, 2000));
}

async function getJsonScripts(page: puppeteer.Page) {
  return await page.$$eval('script[type="application/ld+json"]', (scripts) => {
    return scripts.map((script) => JSON.parse(script.innerHTML));
  });
}

async function searchWithSelectors(page: puppeteer.Page) {

  // TODO: this should be a list in the DB
  const AMAZON_NAME = '#productTitle';
  const AMAZON_PRICE = 'span.a-price-whole';
  const MELITTA_NAME = 'h1.product--title[itemprop="name"][data-qa-id="product-name"]';
  const MELITTA_PRICE = 'span.price--content[data-qa-id="product-price"]';

  const selectorsPrice = [AMAZON_PRICE, MELITTA_PRICE];
  const selectorsName = [AMAZON_NAME, MELITTA_NAME];
  let elementPrice = null;
  let elementName = null;
  let name = null;
  let price = null;

  for (const selectorPrice of selectorsPrice) {
    elementPrice = await page.$(selectorPrice);
    if (elementPrice) {
      price = await page.evaluate(elementPrice => elementPrice.textContent, elementPrice);
      break;
    }
  }
  for (const selectorName of selectorsName) {
    elementName = await page.$(selectorName);
    if (elementName) {
      name = await page.evaluate(elementName => elementName.textContent, elementName);
      break;
    }
  }

  return { name: name, price: price }
}

async function saveScrapedContent(page: puppeteer.Page, ldJsonScripts: any[]) {
  const content = await page.content();
  fs.writeFileSync("data/test_working.json", content);
  fs.writeFileSync("data/test.json", JSON.stringify(ldJsonScripts, null, 2));
}

async function findPriceAndName(page: puppeteer.Page) {
  // Fetch structured data
  const ldJsonScripts = await getJsonScripts(page);

  // Uncomment to save scraped data
  // await saveScrapedContent(page, ldJsonScripts);

  for (const script of ldJsonScripts) {
    let prodName = "";
    if (script['@type'] === 'Product' && script.name) {
      console.log("namnet:" + script.name);
      prodName = script.name;
    }
    if (Array.isArray(script.offers)) {
      if (script.offers.length > 0 && script.offers[0].price) {
        console.log(prodName + " pris: " + script.offers[0].price + " kr (no object)");
        return { name: prodName, price: script.offers[0].price };
      }
    } else if (script.offers && script.offers.price) {
      // If "offers" is an object, access the price directly
      console.log(prodName + " pris: " + script.offers.price + " kr (object)");
      return { name: prodName, price: script.offers.price };
    }
  }

  return { name: "", price: null };
}

async function findPriceAndNameBroad(page: puppeteer.Page) {

  const productInfo = await searchWithSelectors(page);

  return { name: productInfo.name, price: productInfo.price };
}
