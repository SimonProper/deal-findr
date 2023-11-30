import express from 'express';
import { scraperController } from '../controllers/scraperController.ts';

const router = express.Router();

router.get('/scrape', scraperController.scrapePrice);

export default router;
