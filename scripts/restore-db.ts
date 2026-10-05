import { execSync, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

// 1. Asegurar archivo .env
const envPath = path.resolve(__dirname, '../.env');
const envExamplePath = path.resolve(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('[AVISO] Archivo .env no encontrado. Creando automáticamente desde .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
  } else {
    console.warn('[AVISO] No se encontró .env ni .env.example.');
  }
}

dotenv.config({ path: envPath });

const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || 'tilin';
const dbName = process.env.POSTGRES_DB || 'academic_management_db';
const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const dbUrl = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;

console.log('===============================================================');
console.log('RESTAURACIÓN Y BOOTSTRAP DE BASE DE DATOS SIGCE');
console.log('===============================================================');
console.log(`Base de datos objetivo: ${dbName}`);
console.log(`Host: ${dbHost}:${dbPort} | Usuario: ${dbUser}`);
console.log('---------------------------------------------------------------');

// 2. Buscar archivo de respaldo SQL
function findBackupFile(): string | null {
  const canonicalPath = path.resolve(__dirname, '../database/sigce_full_backup.sql');
  if (fs.existsSync(canonicalPath)) {
    return canonicalPath;
  }

  const backupsDir = path.resolve(__dirname, '../database/backups');
  if (fs.existsSync(backupsDir)) {
    const sqlFiles = fs.readdirSync(backupsDir)
      .filter((f) => f.endsWith('.sql'))
      .map((f) => ({
        name: f,
        path: path.join(backupsDir, f),
        time: fs.statSync(path.join(backupsDir, f)).mtimeMs,
      }))
      .sort((a, b) => b.time - a.time);

    if (sqlFiles.length > 0) {
      return sqlFiles[0].path;
    }
  }

  return null;
}

// 3. Ubicar psql en el sistema
function findPsqlBin(): string | null {
  const candidates = [
    'psql',
    'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\14\\bin\\psql.exe',
    '/usr/bin/psql',
    '/usr/local/bin/psql',
  ];

  for (const p of candidates) {
    if (p === 'psql') {
      const check = spawnSync('psql', ['--version'], { stdio: 'ignore' });
      if (check.status === 0) return 'psql';
    } else if (fs.existsSync(p)) {
      return `"${p}"`;
    }
  }

  return null;
}

// 4. Asegurar existencia de la base de datos
async function ensureDatabaseExists(): Promise<void> {
  const defaultClient = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres',
  });

  try {
    await defaultClient.connect();
    const res = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rows.length === 0) {
      console.log(`[INFO] La base de datos '${dbName}' no existe. Creándola...`);
      await defaultClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[INFO] Base de datos '${dbName}' creada con éxito.`);
    } else {
      console.log(`[INFO] Base de datos '${dbName}' verificada y lista.`);
    }
    await defaultClient.end();
  } catch (err: any) {
    console.warn(`[AVISO] No se pudo conectar a la base 'postgres' por defecto (${err.message}). Intentando conexión directa a '${dbName}'...`);
  }
}

// 5. Verificar tablas y logins
async function verifyRestoredData(): Promise<void> {
  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  console.log('\n[VERIFICACIÓN] Comprobando integridad de datos...');
  const userCount = await client.query('SELECT COUNT(*) FROM "users"');
  const teacherCount = await client.query('SELECT COUNT(*) FROM "teachers"');
  const studentCount = await client.query('SELECT COUNT(*) FROM "students"');
  const courseCount = await client.query('SELECT COUNT(*) FROM "courses"');
  const enrollmentCount = await client.query('SELECT COUNT(*) FROM "enrollments"');
  const gradeCount = await client.query('SELECT COUNT(*) FROM "grades"');

  console.log(`  -> Usuarios: ${userCount.rows[0].count}`);
  console.log(`  -> Docentes: ${teacherCount.rows[0].count}`);
  console.log(`  -> Estudiantes: ${studentCount.rows[0].count}`);
  console.log(`  -> Cursos institucionales: ${courseCount.rows[0].count}`);
  console.log(`  -> Matrículas: ${enrollmentCount.rows[0].count}`);
  console.log(`  -> Calificaciones registradas: ${gradeCount.rows[0].count}`);

  // Verificar credencial admin
  const adminRes = await client.query(
    "SELECT email, password_hash, role FROM users WHERE email = 'admin@sigce.edu.bo' OR role = 'ADMIN' LIMIT 1"
  );
  if (adminRes.rows.length > 0) {
    const admin = adminRes.rows[0];
    const match = await bcrypt.compare('123456', admin.password_hash);
    console.log(`  -> Verificación Admin (${admin.email}): ${match ? '✅ Contraseña 123456 OK' : '⚠️ Contraseña distinta de 123456'}`);
  }

  await client.end();
}

// 6. Flujo de respaldo programático en TypeScript (fallback si no hay psql)
function runScriptPipeline(): void {
  console.log('[FALLBACK] Ejecutando canalización de migración y seed mediante TypeScript...');
  execSync('pnpm exec prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  execSync('pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  execSync('pnpm exec tsx ./prisma/seed.ts', { stdio: 'inherit' });
  execSync('pnpm exec tsx ./scripts/inject-extracted-data.ts', { stdio: 'inherit' });
  execSync('pnpm exec tsx ./scripts/reassign-16-courses-curriculum.ts', { stdio: 'inherit' });
  execSync('pnpm exec tsx ./scripts/seed-grades.ts', { stdio: 'inherit' });
  execSync('pnpm exec tsx ./scripts/setup-simple-credentials.ts', { stdio: 'inherit' });
}

// 7. Ejecución principal
async function main() {
  await ensureDatabaseExists();

  const backupFile = findBackupFile();
  const psqlBin = findPsqlBin();

  if (backupFile && psqlBin) {
    console.log(`[RESTAURACIÓN] Usando archivo de respaldo: ${backupFile}`);
    console.log(`[HERRAMIENTA] Usando ejecutable: ${psqlBin}`);
    const env = { ...process.env, PGPASSWORD: dbPassword };

    try {
      execSync(`${psqlBin} -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f "${backupFile}"`, {
        env,
        stdio: 'inherit',
      });
      console.log(' Restauración SQL completada con éxito.');
    } catch (err: any) {
      console.warn('⚠️ Ocurrió una advertencia o error en psql. Verificando estado...');
    }
  } else if (backupFile) {
    console.log('[AVISO] Archivo de respaldo detectado, pero no se encontró la herramienta psql en PATH.');
    console.log('Intentando verificar si Docker está ejecutando PostgreSQL...');
    try {
      execSync(`docker exec -i academic_postgres psql -U ${dbUser} -d ${dbName} < "${backupFile}"`, {
        stdio: 'inherit',
      });
      console.log(' Restauración vía Docker exitosa.');
    } catch {
      console.log('No se pudo restaurar vía Docker. Pasando a pipeline de scripts TS...');
      runScriptPipeline();
    }
  } else {
    console.log('[AVISO] No se encontró archivo .sql de respaldo. Ejecutando pipeline completo de scripts...');
    runScriptPipeline();
  }

  // Generar Prisma Client
  console.log('\n[PRISMA] Regenerando Prisma Client...');
  execSync('pnpm exec prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  // Verificación final
  await verifyRestoredData();

  console.log('\n===============================================================');
  console.log('🎉 BASE DE DATOS RESTAURADA Y OPERATIVA AL 100%');
  console.log('===============================================================');
  console.log('Credenciales de acceso rápido (Contraseña general: 123456):');
  console.log('  • Administrador: admin@sigce.edu.bo (o admin@example.local)');
  console.log('  • Docente 1:     docente.4258830@sigce.edu.bo (Prof. Eyennil Galvez Linares)');
  console.log('  • Docente 2:     docente.3918213@sigce.edu.bo (Prof. Maura Alvarez Rojas)');
  console.log('  • Estudiante:    estudiante.16157592@sigce.edu.bo (Eileen Camacho Perales)');
  console.log('  • Padre/Tutor:   padre.5489210@sigce.edu.bo (Marcos Camacho Rocha)');
  console.log('===============================================================');
}

main().catch((err) => {
  console.error('Error fatal durante la restauración:', err);
  process.exit(1);
});
