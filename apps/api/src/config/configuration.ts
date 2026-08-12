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

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || process.env.API_PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://academic_admin:academic_secret_password_2026@localhost:5432/academic_management_db?schema=public',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_key_change_in_production_32chars!',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_change_in_production_32chars!',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  sie: {
    baseUrl: process.env.SIE_BASE_URL || 'https://sie.minedu.gob.bo',
    headless: process.env.SIE_HEADLESS !== 'false',
    timeoutMs: parseInt(process.env.SIE_SYNC_TIMEOUT_MS || '30000', 10),
  },
});
