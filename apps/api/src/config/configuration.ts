export interface AppConfig {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  sie: {
    baseUrl: string;
    headless: boolean;
    timeoutMs: number;
  };
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || process.env.API_PORT || '3000', 10),
  database: {
    url: requiredEnvironment('DATABASE_URL'),
  },
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
        // Ignorar si el formato URL no es válido y usar variables individuales
      }
    }

    return { host, port, password };
  })(),
  jwt: {
    accessSecret: requiredEnvironment('JWT_ACCESS_SECRET'),
    refreshSecret: requiredEnvironment('JWT_REFRESH_SECRET'),
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  sie: {
    baseUrl: process.env.SIE_BASE_URL || '',
    headless: process.env.SIE_HEADLESS !== 'false',
    timeoutMs: parseInt(process.env.SIE_SYNC_TIMEOUT_MS || '30000', 10),
  },
});
