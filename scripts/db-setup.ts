import { execSync } from 'child_process';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ ERROR: DATABASE_URL no está definida en el archivo .env');
  process.exit(1);
}

async function waitForDatabase(maxRetries = 15, delayMs = 2000): Promise<boolean> {
  console.log('🔄 [1/5] Verificando conectividad con PostgreSQL...');
  
  for (let i = 1; i <= maxRetries; i++) {
    const client = new Client({ connectionString: dbUrl });
    try {
      await client.connect();
      const res = await client.query('SELECT NOW() as current_time, version() as version;');
      console.log(`  ✅ Conexión establecida con PostgreSQL.`);
      console.log(`     Versión: ${res.rows[0].version.split(',')[0]}`);
      await client.end();
      return true;
    } catch (err: any) {
      console.log(`  ⏳ Intento ${i}/${maxRetries} fallido (${err.message}). Reintentando en ${delayMs / 1000}s...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  return false;
}

async function run() {
  console.log('===============================================================');
  console.log('🚀 SISTEMA DE GESTIÓN ACADÉMICA - INICIALIZACIÓN DE BASE DE DATOS');
  console.log('===============================================================\n');

  // Paso 1: Conectividad
  const isConnected = await waitForDatabase();
  if (!isConnected) {
    console.error('\n❌ ERROR: No se pudo conectar a PostgreSQL después de múltiples intentos.');
    console.error('   Asegúrate de haber ejecutado: docker compose up -d\n');
    process.exit(1);
  }

  // Paso 2: Generar Prisma Client
  console.log('\n📦 [2/5] Generando Prisma Client...');
  try {
    execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
    console.log('  ✅ Prisma Client generado correctamente.');
  } catch (error) {
    console.error('  ❌ Error generando Prisma Client:', error);
    process.exit(1);
  }

  // Paso 3: Aplicar migraciones
  console.log('\n📜 [3/5] Aplicando migraciones de Prisma (prisma migrate deploy)...');
  try {
    execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
    console.log('  ✅ Migraciones aplicadas correctamente.');
  } catch (error) {
    console.error('  ❌ Error aplicando migraciones:', error);
    process.exit(1);
  }

  // Paso 4: Ejecutar Seed
  console.log('\n🌱 [4/5] Ejecutando Seed de datos iniciales...');
  try {
    execSync('npx tsx ./prisma/seed.ts', { stdio: 'inherit' });
    console.log('  ✅ Seed ejecutado correctamente.');
  } catch (error) {
    console.error('  ❌ Error ejecutando el seed:', error);
    process.exit(1);
  }

  // Paso 5: Verificación de estructura
  console.log('\n🔍 [5/5] Verificando tablas y datos iniciales...');
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    const userCount = await client.query('SELECT COUNT(*) FROM "users";');
    const permCount = await client.query('SELECT COUNT(*) FROM "permissions";');
    const yearCount = await client.query('SELECT COUNT(*) FROM "academic_years";');
    const subjectCount = await client.query('SELECT COUNT(*) FROM "subjects";');
    const auditCount = await client.query('SELECT COUNT(*) FROM "audit_logs";');

    console.log(`  -> Usuarios: ${userCount.rows[0].count}`);
    console.log(`  -> Permisos: ${permCount.rows[0].count}`);
    console.log(`  -> Años Académicos: ${yearCount.rows[0].count}`);
    console.log(`  -> Materias: ${subjectCount.rows[0].count}`);
    console.log(`  -> Bitácoras de Auditoría: ${auditCount.rows[0].count}`);

    await client.end();
  } catch (error) {
    console.error('  ❌ Error durante la verificación final:', error);
    process.exit(1);
  }

  console.log('\n===============================================================');
  console.log('🎉 BASE DE DATOS INICIALIZADA Y VERIFICADA CON ÉXITO');
  console.log('===============================================================\n');
}

run().catch((e) => {
  console.error('Error fatal en db-setup:', e);
  process.exit(1);
});
