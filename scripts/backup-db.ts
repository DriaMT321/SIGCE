import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.POSTGRES_USER || 'academic_admin';
const dbPassword = process.env.POSTGRES_PASSWORD || 'tilin';
const dbName = process.env.POSTGRES_DB || 'academic_management_db';
const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = process.env.POSTGRES_PORT || '5432';

// Ubicar pg_dump
const possiblePgDumpPaths = [
  'pg_dump',
  'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe',
  'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',
  'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',
];

let pgDumpBin = 'pg_dump';
for (const p of possiblePgDumpPaths) {
  if (p === 'pg_dump') {
    try {
      execSync('pg_dump --version', { stdio: 'ignore' });
      pgDumpBin = 'pg_dump';
      break;
    } catch {
      continue;
    }
  } else if (fs.existsSync(p)) {
    pgDumpBin = `"${p}"`;
    break;
  }
}

const backupDir = path.resolve(__dirname, '../database/backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const dumpFile = path.join(backupDir, `sigce_${dbName}_${timestamp}.dump`);
const sqlFile = path.join(backupDir, `sigce_${dbName}_${timestamp}.sql`);

console.log('===============================================================');
console.log('INICIANDO RESPALDO DE SEGURIDAD DE BASE DE DATOS POSTGRESQL');
console.log('===============================================================');
console.log(`Base de datos: ${dbName}`);
console.log(`Host: ${dbHost}:${dbPort} | Usuario: ${dbUser}`);
console.log(`Herramienta: ${pgDumpBin}`);
console.log('---------------------------------------------------------------');

try {
  const env = { ...process.env, PGPASSWORD: dbPassword };

  console.log('[1/2] Generando volcado comprimido (.dump)...');
  execSync(`${pgDumpBin} -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -b -f "${dumpFile}"`, {
    env,
    stdio: 'inherit',
  });
  const dumpSize = (fs.statSync(dumpFile).size / 1024).toFixed(2);
  console.log(` Archivo creado: ${dumpFile} (${dumpSize} KB)`);

  console.log('[2/2] Generando volcado SQL legible (.sql)...');
  execSync(`${pgDumpBin} -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} --clean --if-exists -f "${sqlFile}"`, {
    env,
    stdio: 'inherit',
  });
  const sqlSize = (fs.statSync(sqlFile).size / 1024).toFixed(2);
  console.log(` Archivo creado: ${sqlFile} (${sqlSize} KB)`);

  console.log('\n Respaldo de base de datos completado exitosamente.');
} catch (error) {
  console.error(' Error fatal generando el respaldo:', error);
  process.exit(1);
}
