import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { readDatabaseConfig } from './consolapostgres';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function main(): void {
  const args = process.argv.slice(2);
  const index = args.indexOf('--confirm-database');
  const target = readDatabaseConfig();
  if (args.length !== 2 || index !== 0 || args[1] !== target.database) {
    throw new Error('Uso: pnpm db:deploy -- --confirm-database <nombre-de-base>.');
  }
  execSync('pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'No se pudieron aplicar las migraciones.');
  process.exitCode = 1;
}
