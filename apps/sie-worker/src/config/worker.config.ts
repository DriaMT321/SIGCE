import * as dotenv from 'dotenv';

dotenv.config();

export const workerConfig = {
  redis: (() => {
    let host = process.env.REDIS_HOST || process.env.REDISHOST || 'localhost';
    let port = parseInt(process.env.REDIS_PORT || process.env.REDISPORT || '6379', 10);
    let password = process.env.REDIS_PASSWORD || process.env.REDISPASSWORD || undefined;

    if (process.env.REDIS_URL) {
      try {
        const parsed = new URL(process.env.REDIS_URL);
        host = parsed.hostname;
        port = parseInt(parsed.port || '6379', 10);
        password = parsed.password || undefined;
      } catch {
        // Fallback
      }
    }

    return { host, port, password };
  })(),
  sie: {
    baseUrl: process.env.SIE_BASE_URL || '',
    username: process.env.SIE_USERNAME || '',
    password: process.env.SIE_PASSWORD || '',
    headless: process.env.SIE_HEADLESS !== 'false',
    timeoutMs: parseInt(process.env.SIE_SYNC_TIMEOUT_MS || '30000', 10),
  },
  queueName: 'sie-synchronization',
};
