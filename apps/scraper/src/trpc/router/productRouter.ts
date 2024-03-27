import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc.ts";
import { scrapeWebPagePrice } from "../../Services/scraperPrice.ts";

export const productRouter = createTRPCRouter({
  scrapeProduct: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await scrapeWebPagePrice(input.url, "ELGIGANTEN_MONITOR");
      return result;
    }),
});
