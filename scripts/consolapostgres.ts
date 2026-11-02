import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface configuracionbasedatos {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

export function readDatabaseConfig(databaseOverride?: string): configuracionbasedatos {
  const connectionString = process.env.DATABASE_URL;
  let fromUrl: Partial<configuracionbasedatos> = {};

  if (connectionString) {
    let parsed: URL;
    try {
      parsed = new URL(connectionString);
    } catch {
      throw new Error('DATABASE_URL no es una URL válida.');
    }

    fromUrl = {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: decodeURIComponent(parsed.pathname.replace(/^\//, '')),
    };
  }

  const host = process.env.POSTGRES_HOST || fromUrl.host;
  const port = Number(process.env.POSTGRES_PORT || fromUrl.port || 5432);
  const user = process.env.POSTGRES_USER || fromUrl.user;
  const password = process.env.POSTGRES_PASSWORD ?? fromUrl.password;
  const database = databaseOverride || process.env.POSTGRES_DB || fromUrl.database;

  if (!host || !user || !database) {
    throw new Error('Configura POSTGRES_HOST, POSTGRES_USER y POSTGRES_DB o DATABASE_URL.');
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('POSTGRES_PORT debe ser un puerto válido.');
  }

  return { host, port, user, password, database };
}

export function findPostgresTool(name: 'pg_dump' | 'pg_restore'): string {
  const candidates = [
    name,
    ...[18, 17, 16, 15, 14].map(
      (version) => `C:\\Program Files\\PostgreSQL\\${version}\\bin\\${name}.exe`,
    ),
    `/usr/bin/${name}`,
    `/usr/local/bin/${name}`,
  ];

  for (const candidate of candidates) {
    if (candidate !== name && !fs.existsSync(candidate)) continue;
    const result = spawnSync(candidate, ['--version'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    if (result.status === 0) return candidate;
  }

  throw new Error(
    `No se encontró ${name}. Instala las herramientas cliente de PostgreSQL y agrégalas a PATH.`,
  );
}

export function runPostgresTool(executable: string, args: string[], password?: string): void {
  const env = { ...process.env };
  if (password !== undefined) env.PGPASSWORD = password;

  const result = spawnSync(executable, args, {
    env,
    stdio: 'inherit',
    windowsHide: true,
  });

  if (result.error) throw new Error(`No se pudo ejecutar ${path.basename(executable)}.`);
  if (result.status !== 0) {
    throw new Error(
      `${path.basename(executable)} terminó con código ${result.status ?? 'desconocido'}.`,
    );
  }
}

export function connectionArgs(config: configuracionbasedatos): string[] {
  return [
    '--host',
    config.host,
    '--port',
    String(config.port),
    '--username',
    config.user,
    '--dbname',
    config.database,
    '--no-password',
  ];
}
