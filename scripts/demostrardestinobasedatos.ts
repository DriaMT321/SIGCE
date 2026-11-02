export function assertLocalDemoDatabaseTarget(): void {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Los scripts de demostración solo se permiten con NODE_ENV=development.');
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Define DATABASE_URL para validar la base de destino.');

  let target: URL;
  try {
    target = new URL(connectionString);
  } catch {
    throw new Error('DATABASE_URL no es válida.');
  }

  const hostname = target.hostname.toLowerCase();
  if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname)) {
    throw new Error('Los scripts de demostración solo pueden modificar una base PostgreSQL local.');
  }

  const database = decodeURIComponent(target.pathname.replace(/^\/+/, ''));
  if (!database || process.env.SIGCE_DEMO_DATABASE_NAME !== database) {
    throw new Error(
      'Define SIGCE_DEMO_DATABASE_NAME con el nombre exacto de la base local autorizada.',
    );
  }
}
