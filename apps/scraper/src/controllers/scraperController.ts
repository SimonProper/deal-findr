import type { Request, Response } from 'express';
import { scrapeWebPagePrice } from '../services/scraperPrice.ts';

export const scraperController = {
  async scrapePrice(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'Invalid URL parameter' });
        return;
      }
      const price = await scrapeWebPagePrice(url, "test");
      res.json({ price });
    } catch (error) {
      console.error('Error scraping price:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
