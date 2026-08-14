import { execSync } from 'node:child_process';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL no esta definida en el archivo .env');
}

async function waitForDatabase(maxRetries = 15, delayMs = 2000): Promise<boolean> {
  console.log('[1/5] Verificando conectividad con PostgreSQL...');

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const client = new Client({ connectionString: dbUrl });
    try {
      await client.connect();
      const result = await client.query('SELECT NOW() AS current_time, version() AS version');
      console.log(`PostgreSQL conectado: ${result.rows[0].version.split(',')[0]}`);
      await client.end();
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`Intento ${attempt}/${maxRetries} fallido: ${message}`);
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
}

async function run(): Promise<void> {
  if (!(await waitForDatabase())) {
    throw new Error('No se pudo conectar a PostgreSQL. Ejecuta docker compose up -d.');
  }

  console.log('[2/5] Generando Prisma Client...');
  execSync('pnpm exec prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  console.log('[3/5] Aplicando migraciones...');
  execSync('pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  console.log('[4/5] Ejecutando seed...');
  execSync('pnpm exec tsx ./prisma/seed.ts', { stdio: 'inherit' });

  console.log('[5/5] Verificando tablas y datos iniciales...');
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  const checks = await Promise.all([
    client.query('SELECT COUNT(*) FROM "users"'),
    client.query('SELECT COUNT(*) FROM "permissions"'),
    client.query('SELECT COUNT(*) FROM "academic_years"'),
    client.query('SELECT COUNT(*) FROM "subjects"'),
    client.query('SELECT COUNT(*) FROM "audit_logs"'),
  ]);
  await client.end();

  console.log(`Usuarios: ${checks[0].rows[0].count}`);
  console.log(`Permisos: ${checks[1].rows[0].count}`);
  console.log(`Anos academicos: ${checks[2].rows[0].count}`);
  console.log(`Materias: ${checks[3].rows[0].count}`);
  console.log(`Auditoria: ${checks[4].rows[0].count}`);
  console.log('Base de datos inicializada y verificada correctamente.');
}

run().catch((error: unknown) => {
  console.error('Error fatal en db-setup:', error);
  process.exitCode = 1;
});
