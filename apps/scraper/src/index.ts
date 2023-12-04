import express from 'express';
import cors from 'cors';
import scraperRoutes from './routes/scraperRoutes.js';

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Define your API routes
app.use('/api', scraperRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
