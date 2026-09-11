import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import healthRouter from './routes/health.js';
import aiRouter from './routes/ai.js';
import evaluateRouter from './routes/evaluate.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory .env if available
const envRootPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envRootPath)) {
  dotenv.config({ path: envRootPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger for development and production debugging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/assets')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/ai', aiRouter);
app.use('/api/evaluate', evaluateRouter);

// Convenient route aliases for direct endpoints
app.post('/api/chat', (req, res, next) => {
  req.url = '/chat';
  aiRouter(req, res, next);
});

app.post('/api/quiz', (req, res, next) => {
  req.url = '/quiz';
  aiRouter(req, res, next);
});

app.post('/api/extract', (req, res, next) => {
  req.url = '/extract';
  aiRouter(req, res, next);
});

// Serve frontend static build in production
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback: Return index.html for any client route not handled by APIs
  app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: `API route not found: ${req.path}` });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Career Buddy Backend is running. Run `npm run build` to compile and serve the frontend.');
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Career Buddy Server running on port ${PORT}`);
  console.log(`Health check ready at: http://localhost:${PORT}/api/health`);
});

export default app;
