import { execSync } from 'node:child_process';
import * as path from 'node:path';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readDatabaseConfig } from './consolapostgres';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function confirmedDatabase(): string | undefined {
  const args = process.argv.slice(2);
  const index = args.indexOf('--confirm-database');
  if (index < 0 || !args[index + 1]) return undefined;
  if (args.length !== 2)
    throw new Error('Uso: pnpm db:setup -- --confirm-database <nombre-de-base>');
  return args[index + 1];
}

async function waitForDatabase(
  connectionString: string,
  maxRetries = 15,
  delayMs = 2000,
): Promise<boolean> {
  console.log('[1/5] Verificando conectividad con PostgreSQL...');
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const client = new Client({ connectionString });
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      return true;
    } catch {
      await client.end().catch(() => undefined);
      console.log(`PostgreSQL no disponible (intento ${attempt}/${maxRetries}).`);
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return false;
}

async function run(): Promise<void> {
  const target = readDatabaseConfig();
  if (confirmedDatabase() !== target.database) {
    throw new Error(
      'Confirma el nombre exacto de la base destino con --confirm-database antes de migrar y sembrar datos.',
    );
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL no está definida en .env.');
  if (!(await waitForDatabase(connectionString))) {
    throw new Error('No se pudo conectar a PostgreSQL.');
  }

  console.log('[2/5] Generando Prisma Client...');
  execSync('pnpm exec prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  console.log('[3/5] Aplicando migraciones...');
  execSync('pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  console.log('[4/5] Ejecutando seed...');
  execSync('pnpm exec tsx ./prisma/seed.ts', { stdio: 'inherit' });

  console.log('[5/5] Verificando tablas y datos iniciales...');
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const checks = await Promise.all([
      client.query('SELECT COUNT(*) FROM "users"'),
      client.query('SELECT COUNT(*) FROM "permissions"'),
      client.query('SELECT COUNT(*) FROM "academic_years"'),
      client.query('SELECT COUNT(*) FROM "subjects"'),
      client.query('SELECT COUNT(*) FROM "audit_logs"'),
    ]);
    console.log(`Usuarios: ${checks[0].rows[0].count}`);
    console.log(`Permisos: ${checks[1].rows[0].count}`);
    console.log(`Gestiones académicas: ${checks[2].rows[0].count}`);
    console.log(`Materias: ${checks[3].rows[0].count}`);
    console.log(`Registros de auditoría: ${checks[4].rows[0].count}`);
  } finally {
    await client.end();
  }
  console.log('Base de datos inicializada y verificada.');
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Error al inicializar la base de datos.');
  process.exitCode = 1;
});
