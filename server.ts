import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { eventApiRouter } from './src/server/eventApi.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Mount API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Event Planner Studio API' });
  });
  app.use('/api/events', eventApiRouter);

  // Setup Vite dev server or serve production build
  const distPath = path.resolve(__dirname, 'dist');
  const distIndexHtml = path.resolve(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';

  if (isProduction && fs.existsSync(distIndexHtml)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndexHtml);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Event Planner Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
