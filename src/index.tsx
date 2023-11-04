import puppeteer from "puppeteer";
import fs from "fs";

const NLYMAN_JEANS =
  "https://nlyman.com/se/produkt/woodbird-leroy-thun-black-jeans_841459-3294/";
const HM_JEANS = "https://www2.hm.com/sv_se/productpage.1199024001.html";
const ELGIGANTEN_MONITOR =
  "https://www.elgiganten.se/product/datorer-kontor/skarmar-tillbehor/datorskarm/samsung-odyssey-g8-s34bg850s-34-valvd-oled-bildskarm-silver/562075?gclid=CjwKCAjw15eqBhBZEiwAbDomEnRqk0L0ydadQPe29_PB8YE0UFvZ87K1DDnEUl4H9pXIPVyO63slKBoCV54QAvD_BwE&gclsrc=aw.ds";

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Required due to security protections (bypass Cloudflare's bot detection) (nlyman)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );

  await page.goto(HM_JEANS);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Required to fetch all information on some sites (elgiganten)
  await new Promise((r) => setTimeout(r, 15000));

  const content = await page.content();

  // TODO: clean up the regex
  const regex =
    /(\d{1,3}(?:(?:\s*\d{3})*(?:[.,]\d+)?\s*kr)|(?:\d+\s*kr)|(\d+(?:[.,]\d+)?\s*[–.]?\s*kr)|([\d,.-]+)(?:\s*(kr|\.-)))/g;

  const krMatches = content.match(regex);

  if (krMatches) {
    const krContent = krMatches.join("\n"); // Join matches with newlines
    fs.writeFileSync("kr_values.txt", krContent);
    console.log("Saved content with numbers followed by 'kr' to kr_values.txt");
  } else {
    console.log("No content with numbers followed by 'kr' found on the page.");
  }

  fs.writeFileSync("webpage_content.txt", content);
  // console.log(content);

  await browser.close();
})();

//test12345
