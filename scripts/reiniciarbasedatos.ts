import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { readDatabaseConfig } from './consolapostgres';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function main(): void {
  const args = process.argv.slice(2);
  const confirmIndex = args.indexOf('--confirm-database');
  const allowDataLoss = args.includes('--allow-data-loss');
  assertLocalDemoDatabaseTarget();
  const target = readDatabaseConfig();
  if (
    args.length !== 3 ||
    confirmIndex !== 0 ||
    args[1] !== target.database ||
    args[2] !== '--allow-data-loss' ||
    !allowDataLoss
  ) {
    throw new Error(
      'Uso destructivo explícito: pnpm db:reset -- --confirm-database <nombre-de-base> --allow-data-loss.',
    );
  }
  execSync('pnpm exec prisma migrate reset --schema=./prisma/schema.prisma --force', {
    stdio: 'inherit',
  });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'No se pudo reiniciar la base de datos.');
  process.exitCode = 1;
}
