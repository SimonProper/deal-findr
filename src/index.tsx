import { scrapeWebPage } from "./Services/scraper.js";

const NLYMAN_JEANS =
  "https://nlyman.com/se/produkt/woodbird-leroy-thun-black-jeans_841459-3294/";
scrapeWebPage(NLYMAN_JEANS, "nlyman.txt");

const HM_JEANS = "https://www2.hm.com/sv_se/productpage.1199024001.html";
scrapeWebPage(HM_JEANS, "hm.txt");

const ELGIGANTEN_MONITOR =
  "https://www.elgiganten.se/product/datorer-kontor/skarmar-tillbehor/datorskarm/samsung-odyssey-g8-s34bg850s-34-valvd-oled-bildskarm-silver/562075?gclid=CjwKCAjw15eqBhBZEiwAbDomEnRqk0L0ydadQPe29_PB8YE0UFvZ87K1DDnEUl4H9pXIPVyO63slKBoCV54QAvD_BwE&gclsrc=aw.ds";
scrapeWebPage(ELGIGANTEN_MONITOR, "elgiganten.txt");
