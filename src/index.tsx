import { scrapeWebPage } from "./Services/scraper.js";
import { scrapeWebPagePrice } from "./Services/scraperPrice.js";

const NLYMAN_JEANS =
  "https://nlyman.com/se/produkt/woodbird-leroy-thun-black-jeans_841459-3294/";
const HM_JEANS = "https://www2.hm.com/sv_se/productpage.1199024001.html";
const ELGIGANTEN_MONITOR =
  "https://www.elgiganten.se/product/datorer-kontor/skarmar-tillbehor/datorskarm/samsung-odyssey-g8-s34bg850s-34-valvd-oled-bildskarm-silver/562075?gclid=CjwKCAjw15eqBhBZEiwAbDomEnRqk0L0ydadQPe29_PB8YE0UFvZ87K1DDnEUl4H9pXIPVyO63slKBoCV54QAvD_BwE&gclsrc=aw.ds";
const ZALANDO_SWEATER =
  "https://www.mq.se/bondelid-liam-half-zip-sweater-navy/?gclid=Cj0KCQjw-pyqBhDmARIsAKd9XIOYT9LyEECzYG_caeud4xVho5zqhobyw2YvFFCWJVObWd1w-XHeeZQaAqIpEALw_wcB";

// Skriver ut alla priser på sidan (ej användbar)
scrapeWebPage(NLYMAN_JEANS, "nlyman.txt");
scrapeWebPage(HM_JEANS, "hm.txt");
scrapeWebPage(ELGIGANTEN_MONITOR, "elgiganten.txt");

// Fungerar
scrapeWebPagePrice(ELGIGANTEN_MONITOR, "ELGIGANTEN_MONITOR");
scrapeWebPagePrice(HM_JEANS, "HM_JEANS");
scrapeWebPagePrice(NLYMAN_JEANS, "NLYMAN_JEANS");
scrapeWebPagePrice(ZALANDO_SWEATER, "ZALANDO_SWEATER");
