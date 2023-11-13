import { scrapeWebPage } from "./Services/scraper.js";
import { scrapeWebPagePrice } from "./Services/scraperPrice.js";

const NLYMAN_JEANS =
  "https://nlyman.com/se/produkt/woodbird-leroy-thun-black-jeans_841459-3294/";
const HM_JEANS = "https://www2.hm.com/sv_se/productpage.1199024001.html";
const ELGIGANTEN_MONITOR =
  "https://www.elgiganten.se/product/datorer-kontor/skarmar-tillbehor/datorskarm/samsung-odyssey-g8-s34bg850s-34-valvd-oled-bildskarm-silver/562075?gclid=CjwKCAjw15eqBhBZEiwAbDomEnRqk0L0ydadQPe29_PB8YE0UFvZ87K1DDnEUl4H9pXIPVyO63slKBoCV54QAvD_BwE&gclsrc=aw.ds";
const ZALANDO_SWEATER =
  "https://www.mq.se/bondelid-liam-half-zip-sweater-navy/?gclid=Cj0KCQjw-pyqBhDmARIsAKd9XIOYT9LyEECzYG_caeud4xVho5zqhobyw2YvFFCWJVObWd1w-XHeeZQaAqIpEALw_wcB";

const POWER_SONOS =
  "https://www.power.se/tv-och-ljud/soundbars/sonos-beam-gen-2-soundbar-svart/p-2358974/store/7107/?gclid=Cj0KCQjw-pyqBhDmARIsAKd9XIM6K5P8UYk5fErGWOwPNN0g1iOdn2DkxRB4ZsFKio-zCbCyay0E3nkaAv0rEALw_wcB&gclsrc=aw.ds";

const IKEA_SANG =
  "https://www.ikea.com/se/sv/p/dunvik-kontinentalsaeng-valevag-fast-tuddal-moerkgra-s39419803/";

const CLAS_OHLSON =
  "https://www.clasohlson.com/se/Bosch-EasyDrill-18V-40-skruvdragare-med-2-batterier/p/41-2666?gclid=Cj0KCQjw-pyqBhDmARIsAKd9XIPckVWLKnv1BVi4pvUOT6elB0Hq15QRJZDgSUQbkmtI9zqPaeskVSoaAmG-EALw_wcB";

// Skriver ut alla priser på sidan (ej användbar)
// scrapeWebPage(NLYMAN_JEANS, "nlyman.txt");
// scrapeWebPage(HM_JEANS, "hm.txt");
// scrapeWebPage(ELGIGANTEN_MONITOR, "elgiganten.txt");

// Fungerar
scrapeWebPagePrice(ELGIGANTEN_MONITOR, "ELGIGANTEN_MONITOR");
scrapeWebPagePrice(HM_JEANS, "HM_JEANS");
scrapeWebPagePrice(NLYMAN_JEANS, "NLYMAN_JEANS");
scrapeWebPagePrice(ZALANDO_SWEATER, "ZALANDO_SWEATER");
scrapeWebPagePrice(POWER_SONOS, "POWER_SONOS");
scrapeWebPagePrice(IKEA_SANG, "IKEA_SANG");
scrapeWebPagePrice(CLAS_OHLSON, "CLAS_OHLSON");
