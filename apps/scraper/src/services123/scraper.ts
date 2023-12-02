import puppeteer from "puppeteer";
import fs from "fs";

export async function scrapeWebPage(
  url: string,
  outputFileName: string
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
  await new Promise<void>((r) => setTimeout(r, 5000));

  const content = await page.content();

  const regex =
    /(\d{1,3}(?:(?:\s*\d{3})*(?:[.,]\d+)?\s*kr)|(?:\d+\s*kr)|(\d+(?:[.,]\d+)?\s*[–.]?\s*kr)|([\d,.-]+)(?:\s*(kr|\.-)))/g;

  const krMatches = content.match(regex);

  if (krMatches) {
    const krContent = krMatches.join("\n");
    fs.writeFileSync("src/Data/pris/" + outputFileName, krContent);
    console.log(
      "Saved content with numbers followed by 'kr' to " + outputFileName
    );
  } else {
    console.log(
      "No content with numbers followed by 'kr' found on the page: " + url
    );
  }

  fs.writeFileSync("src/Data/content/" + outputFileName, content);

  await browser.close();
}
