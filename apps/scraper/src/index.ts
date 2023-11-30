import express from 'express';
import scraperRoutes from './routes/scraperRoutes.ts';

const app = express();
const port = 3001;

app.use('/api', scraperRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

