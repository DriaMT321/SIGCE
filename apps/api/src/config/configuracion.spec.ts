import configuracionAplicacion from './configuracion';

describe('configuración de seguridad', () => {
  const originalEnvironment = { ...process.env };

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    process.env.DATABASE_URL = 'postgresql://sigce:test@localhost:5432/sigce';
    process.env.JWT_ACCESS_SECRET = 'a'.repeat(48);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(48);
    delete process.env.CORS_ORIGINS;
    delete process.env.TRUSTED_PROXY_IPS;
    delete process.env.REDIS_URL;
    delete process.env.REDIS_TLS;
    delete process.env.REDIS_PASSWORD;
    delete process.env.REDIS_HOST;
    delete process.env.WEB_COOKIE_SAME_SITE;
    delete process.env.SIGCE_EXTENSION_ORIGIN;
  });

  afterAll(() => {
    for (const key of Object.keys(process.env)) delete process.env[key];
    Object.assign(process.env, originalEnvironment);
  });

  it('usa orígenes locales explícitos durante el desarrollo', () => {
    expect(configuracionAplicacion().corsOrigins).toEqual([
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ]);
  });

  it('solo confía en direcciones de proxy explícitas y válidas', () => {
    expect(configuracionAplicacion().trustedProxyIps).toEqual([]);

    process.env.TRUSTED_PROXY_IPS = ' 127.0.0.1, ::1 ';
    expect(configuracionAplicacion().trustedProxyIps).toEqual(['127.0.0.1', '::1']);

    process.env.TRUSTED_PROXY_IPS = '10.0.0.0/8';
    expect(() => configuracionAplicacion()).toThrow('TRUSTED_PROXY_IPS debe contener');
  });

  it('acepta solo el origen exacto de una extensión de Chrome', () => {
    expect(configuracionAplicacion().extensionOrigin).toBeNull();
    process.env.SIGCE_EXTENSION_ORIGIN = `chrome-extension://${'a'.repeat(32)}`;
    expect(configuracionAplicacion().extensionOrigin).toBe(process.env.SIGCE_EXTENSION_ORIGIN);
    process.env.SIGCE_EXTENSION_ORIGIN = 'chrome-extension://*';
    expect(() => configuracionAplicacion()).toThrow('SIGCE_EXTENSION_ORIGIN');
  });

  it('exige orígenes HTTPS exactos al ejecutar en producción', () => {
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGINS = 'https://sigce.example,https://admin.sigce.example';
    process.env.REDIS_URL = 'rediss://redis:secreto@redis.example:6380';
    expect(configuracionAplicacion().corsOrigins).toEqual([
      'https://sigce.example',
      'https://admin.sigce.example',
    ]);

    process.env.CORS_ORIGINS = '*';
    expect(() => configuracionAplicacion()).toThrow(
      'CORS_ORIGINS must contain exact valid origins',
    );
  });

  it('rechaza secretos JWT cortos o repetidos', () => {
    process.env.JWT_ACCESS_SECRET = 'short';
    expect(() => configuracionAplicacion()).toThrow('deben tener al menos 32 bytes UTF-8');

    process.env.JWT_ACCESS_SECRET = 'c'.repeat(48);
    process.env.JWT_REFRESH_SECRET = process.env.JWT_ACCESS_SECRET;
    expect(() => configuracionAplicacion()).toThrow('deben ser distintos');
  });

  it('rechaza los secretos JWT de ejemplo en producción', () => {
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGINS = 'https://sigce.example';
    process.env.JWT_ACCESS_SECRET = 'local_access_secret_change_me_32_chars_min_sec12345';
    process.env.JWT_REFRESH_SECRET = 'local_refresh_secret_change_me_32_chars_min_sec12345';

    expect(() => configuracionAplicacion()).toThrow(
      'valores de ejemplo no son válidos en producción',
    );
  });

  it('rechaza puertos que no sean enteros dentro de rango', () => {
    process.env.PORT = '3000x';
    expect(() => configuracionAplicacion()).toThrow('PORT/API_PORT debe ser un número entero');

    delete process.env.PORT;
    process.env.REDIS_PORT = '0';
    expect(() => configuracionAplicacion()).toThrow(
      'REDIS_PORT/REDISPORT debe estar entre 1 y 65535',
    );

    delete process.env.REDIS_PORT;

  });

  it('activa TLS cuando REDIS_URL usa rediss', () => {
    process.env.REDIS_URL = 'rediss://usuario:secreto@redis.example:6380';
    expect(configuracionAplicacion().redis).toMatchObject({
      host: 'redis.example',
      port: 6380,
      password: 'secreto',
      usarTLS: true,
    });

    process.env.REDIS_URL = 'redis://redis.example:6380';
    expect(configuracionAplicacion().redis.usarTLS).toBe(false);
  });

  it('exige autenticación y TLS para Redis en producción', () => {
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGINS = 'https://sigce.example';
    process.env.REDIS_URL = 'redis://redis.example:6379';
    expect(() => configuracionAplicacion()).toThrow('Redis requiere TLS y una contraseña');

    process.env.REDIS_URL = 'rediss://redis:secreto@redis.example:6380';
    expect(configuracionAplicacion().redis.usarTLS).toBe(true);

    delete process.env.REDIS_URL;
    process.env.REDIS_HOST = 'redis.internal';
    process.env.REDIS_PASSWORD = 'secreto';
    process.env.REDIS_TLS = 'true';
    expect(configuracionAplicacion().redis).toMatchObject({
      host: 'redis.internal',
      password: 'secreto',
      usarTLS: true,
    });
  });
});
