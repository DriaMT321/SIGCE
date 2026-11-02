import { PrismaClient, UserRole, User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testRoleLogin(
  role: string,
  identifier: string,
  secret?: string,
  secondaryIdentifier?: string,
) {
  let user: PrismaUser | null = null;

  switch (role) {
    case 'STUDENT': {
      const student = await prisma.student.findFirst({
        where: {
          deletedAt: null,
          userId: { not: null },
          OR: [{ rude: identifier }, { ci: identifier }],
        },
        include: { user: true },
      });
      user = student?.user ?? null;
      break;
    }
    case 'TEACHER': {
      const teacher = await prisma.teacher.findFirst({
        where: {
          deletedAt: null,
          OR: [
            { itemNumber: identifier },
            { ci: identifier },
            { user: { email: identifier.toLowerCase() } },
          ],
        },
        include: { user: true },
      });
      user = teacher?.user ?? null;
      break;
    }
    case 'FAMILY': {
      if (!secondaryIdentifier) break;
      const parent = await prisma.parent.findFirst({
        where: { ci: identifier, phone: secondaryIdentifier, deletedAt: null },
        include: { user: true },
      });
      user = parent?.user ?? null;
      break;
    }
    case 'ADMINISTRATIVE': {
      user = await prisma.user.findFirst({
        where: {
          OR: [{ email: identifier.toLowerCase() }, { id: identifier }],
          role: { in: [UserRole.ADMINISTRATIVE, UserRole.SECRETARY] },
        },
      });
      break;
    }
  }

  if (!user || !user.isActive || user.deletedAt) {
    return { ok: false, error: 'Usuario no encontrado o inactivo' };
  }

  if (role === 'TEACHER' || role === 'ADMINISTRATIVE') {
    if (!secret || !(await bcrypt.compare(secret, user.passwordHash))) {
      return { ok: false, error: 'Contraseña incorrecta' };
    }
  }

  return { ok: true };
}

async function testStandardLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user || !user.isActive || user.deletedAt) {
    return { ok: false, error: 'Usuario no encontrado' };
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { ok: false, error: 'Contraseña incorrecta' };
  return { ok: true };
}

function requiredSetting(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Define ${name} para ejecutar las pruebas de acceso.`);
  return value;
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Las pruebas de acceso no se ejecutan contra un entorno de producción.');
  }
  const password = requiredSetting('SIGCE_TEST_PASSWORD');
  const adminEmail = requiredSetting('SIGCE_TEST_ADMIN_EMAIL');
  const teacherCi = requiredSetting('SIGCE_TEST_TEACHER_CI');
  const teacherItem = requiredSetting('SIGCE_TEST_TEACHER_ITEM');
  const teacherEmail = requiredSetting('SIGCE_TEST_TEACHER_EMAIL');
  const studentRude = requiredSetting('SIGCE_TEST_STUDENT_RUDE');
  const studentEmail = requiredSetting('SIGCE_TEST_STUDENT_EMAIL');
  const parentCi = requiredSetting('SIGCE_TEST_PARENT_CI');
  const parentPhone = requiredSetting('SIGCE_TEST_PARENT_PHONE');
  const parentEmail = requiredSetting('SIGCE_TEST_PARENT_EMAIL');

  console.log('--- TEST: ROLE-BASED LOGIN (UI PORTAL) ---');

  const r1 = await testRoleLogin('ADMINISTRATIVE', adminEmail, password);
  console.log(
    '1. Administración y Dirección:',
    r1.ok ? '✅ ÉXITO' : `❌ ERROR: ${r1.error ?? 'falló el acceso'}`,
  );

  const r2 = await testRoleLogin('TEACHER', teacherCi, password);
  console.log(
    '2. Docente (por CI):',
    r2.ok ? '✅ ÉXITO' : `❌ ERROR: ${r2.error ?? 'falló el acceso'}`,
  );

  const r2b = await testRoleLogin('TEACHER', teacherItem, password);
  console.log(
    '2b. Docente (por ítem):',
    r2b.ok ? '✅ ÉXITO' : `❌ ERROR: ${r2b.error ?? 'falló el acceso'}`,
  );

  const r3 = await testRoleLogin('STUDENT', studentRude);
  console.log(
    '3. Estudiante (por RUDE):',
    r3.ok ? '✅ ÉXITO' : `❌ ERROR: ${r3.error ?? 'falló el acceso'}`,
  );

  const r4 = await testRoleLogin('FAMILY', parentCi, undefined, parentPhone);
  console.log('4. Familiar:', r4.ok ? '✅ ÉXITO' : `❌ ERROR: ${r4.error ?? 'falló el acceso'}`);

  console.log('\n--- TEST: STANDARD EMAIL/PASSWORD LOGIN ---');
  for (const [label, email] of [
    ['Administración', adminEmail],
    ['Docente', teacherEmail],
    ['Estudiante', studentEmail],
    ['Familiar', parentEmail],
  ]) {
    const res = await testStandardLogin(email, password);
    console.log(
      `Login ${label}:`,
      res.ok ? '✅ ÉXITO' : `❌ ERROR: ${res.error ?? 'falló el acceso'}`,
    );
  }
}

main().finally(() => prisma.$disconnect());
