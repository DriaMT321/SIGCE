import * as dotenv from 'dotenv';

dotenv.config();

export const workerConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  sie: {
    baseUrl: process.env.SIE_BASE_URL || '',
    username: process.env.SIE_USERNAME || '',
    password: process.env.SIE_PASSWORD || '',
    headless: process.env.SIE_HEADLESS !== 'false',
    timeoutMs: parseInt(process.env.SIE_SYNC_TIMEOUT_MS || '30000', 10),
  },
  queueName: 'sie-synchronization',
};
