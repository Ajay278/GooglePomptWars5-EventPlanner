import express from 'express';
import dotenv from 'dotenv';
import { eventApiRouter } from '../src/server/eventApi.ts';

dotenv.config();

const app = express();
app.use(express.json());

// Mount API router
app.use('/api/events', eventApiRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Event Planner Studio API', timestamp: new Date().toISOString() });
});

export default app;
