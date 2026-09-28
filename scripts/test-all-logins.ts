import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testRoleLogin(role: string, identifier: string, secret?: string, secondaryIdentifier?: string) {
  let user: any = null;

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
          role: { in: [UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY] },
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

  return { ok: true, user: { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, role: user.role } };
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
  return { ok: true, user: { id: user.id, email: user.email, role: user.role } };
}

async function main() {
  console.log('--- TEST: ROLE-BASED LOGIN (UI PORTAL) ---');

  // 1. ADMIN
  const r1 = await testRoleLogin('ADMINISTRATIVE', 'admin@sigce.edu.bo', '123456');
  console.log('1. Admin (Directivo):', r1.ok ? '✅ ÉXITO' : '❌ ERROR', r1);

  // 2. TEACHER
  const r2 = await testRoleLogin('TEACHER', '4258830', '123456');
  console.log('2. Docente (por CI 4258830):', r2.ok ? '✅ ÉXITO' : '❌ ERROR', r2);

  const r2b = await testRoleLogin('TEACHER', '11', '123456');
  console.log('2b. Docente (por Ítem 11):', r2b.ok ? '✅ ÉXITO' : '❌ ERROR', r2b);

  // 3. STUDENT
  const r3 = await testRoleLogin('STUDENT', '819814402020006');
  console.log('3. Estudiante (por RUDE 819814402020006):', r3.ok ? '✅ ÉXITO' : '❌ ERROR', r3);

  // 4. FAMILY
  const r4 = await testRoleLogin('FAMILY', '5489210', undefined, '76401234');
  console.log('4. Padre de Familia (CI: 5489210, Celular: 76401234):', r4.ok ? '✅ ÉXITO' : '❌ ERROR', r4);

  console.log('\n--- TEST: STANDARD EMAIL/PASSWORD LOGIN ---');
  for (const email of [
    'admin@sigce.edu.bo',
    'docente.4258830@sigce.edu.bo',
    'estudiante.16157592@sigce.edu.bo',
    'padre.5489210@sigce.edu.bo',
  ]) {
    const res = await testStandardLogin(email, '123456');
    console.log(`Login ${email}:`, res.ok ? '✅ ÉXITO' : '❌ ERROR', res);
  }
}

main().finally(() => prisma.$disconnect());
