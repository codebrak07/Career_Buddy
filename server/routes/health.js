import { Router } from 'express';

const router = Router();
const startTime = Date.now();

router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memory = process.memoryUsage();

  res.status(200).json({
    status: 'healthy',
    service: 'Career Buddy Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    environment: process.env.NODE_ENV || 'production',
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryRssMb: (memory.rss / 1024 / 1024).toFixed(2),
      memoryHeapUsedMb: (memory.heapUsed / 1024 / 1024).toFixed(2)
    }
  });
});

export default router;
