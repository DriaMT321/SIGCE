import { PrismaClient, UserRole, RelationshipType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { validarcontrasena } from '../apps/api/src/core/domain/policies/politicacontrasena';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  if (
    process.env.NODE_ENV !== 'development' ||
    process.env.SIGCE_ALLOW_DEMO_CREDENTIAL_RESET !== 'true'
  ) {
    throw new Error(
      'Este script solo se permite en desarrollo con SIGCE_ALLOW_DEMO_CREDENTIAL_RESET=true.',
    );
  }
  assertLocalDemoDatabaseTarget();
  const SIMPLE_PASSWORD = process.env.SIGCE_DEMO_ACCOUNT_PASSWORD;
  if (!SIMPLE_PASSWORD) {
    throw new Error('Define SIGCE_DEMO_ACCOUNT_PASSWORD.');
  }
  validarcontrasena(SIMPLE_PASSWORD);

  console.log('===============================================================');
  console.log('CONFIGURANDO CREDENCIALES DE DEMOSTRACIÓN (SIGCE)');
  console.log('===============================================================\n');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(SIMPLE_PASSWORD, saltRounds);

  // --------------------------------------------------------------------------
  // 1. ADMINISTRADOR
  // --------------------------------------------------------------------------
  console.log('[1/4] Configurando Usuario Administrador...');
  const adminEmails = ['admin@sigce.edu.bo', 'admin@example.local'];
  for (const email of adminEmails) {
    const usuarioExistente = await prisma.user.findUnique({
      where: { email },
      include: { parent: true, teacher: true, student: true },
    });
    if (
      usuarioExistente &&
      (usuarioExistente.role !== UserRole.ADMINISTRATIVE ||
        usuarioExistente.parent ||
        usuarioExistente.teacher ||
        usuarioExistente.student)
    ) {
      throw new Error(
        `La cuenta administrativa de demostración ${email} ya pertenece a otro perfil.`,
      );
    }
    const usuarioAdministrador = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: UserRole.ADMINISTRATIVE,
        passwordSetupTokenHash: null,
        passwordSetupExpiresAt: null,
        passwordSetupRequired: false,
        credentialVersion: { increment: 1 },
        isActive: true,
      },
      create: {
        email,
        passwordHash,
        firstName: 'Administrador',
        lastName: 'General',
        role: UserRole.ADMINISTRATIVE,
        isActive: true,
      },
    });
    await revocarTokensRenovacion(usuarioAdministrador.id);
  }
  console.log('  -> Cuentas administrativas de demostración configuradas.');

  // --------------------------------------------------------------------------
  // 2. PROFESORES / DOCENTES
  // --------------------------------------------------------------------------
  console.log('\n[2/4] Configurando Usuarios Docentes con clave sencilla...');
  // Actualizar todos los usuarios docentes existentes a la clave sencilla
  const idsDocentes = await prisma.user.findMany({
    where: { role: UserRole.TEACHER },
    select: { id: true },
  });
  const updatedTeachers = await prisma.user.updateMany({
    where: { role: UserRole.TEACHER },
    data: {
      passwordHash,
      passwordSetupTokenHash: null,
      passwordSetupExpiresAt: null,
      passwordSetupRequired: false,
      credentialVersion: { increment: 1 },
      isActive: true,
    },
  });
  await prisma.refreshToken.updateMany({
    where: { userId: { in: idsDocentes.map((docente) => docente.id) }, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  console.log(`  -> ${updatedTeachers.count} docentes de demostración configurados.`);

  // Asegurar que al menos dos docentes destacados tengan sus datos listos
  const sampleTeacher1 = await prisma.teacher.findFirst({
    where: { ci: '4258830' }, // Eyennil Galvez Linares, item 11
    include: { user: true },
  });
  if (sampleTeacher1) {
    console.log(
      `  -> Docente Ejemplo 1: Prof. ${sampleTeacher1.firstName} ${sampleTeacher1.lastName}`,
    );
    console.log(
      `     CI: ${sampleTeacher1.ci} | Ítem: ${sampleTeacher1.itemNumber} | Email: ${sampleTeacher1.user.email}`,
    );
  }

  const sampleTeacher2 = await prisma.teacher.findFirst({
    where: { ci: '3918213' }, // Maura Mariluz Alvarez Rojas, item 1
    include: { user: true },
  });
  if (sampleTeacher2) {
    console.log(
      `  -> Docente Ejemplo 2: Prof. ${sampleTeacher2.firstName} ${sampleTeacher2.lastName}`,
    );
    console.log(
      `     CI: ${sampleTeacher2.ci} | Ítem: ${sampleTeacher2.itemNumber} | Email: ${sampleTeacher2.user.email}`,
    );
  }

  // --------------------------------------------------------------------------
  // 3. ESTUDIANTE
  // --------------------------------------------------------------------------
  console.log('\n[3/4] Configurando Usuario Estudiante...');
  // Buscar a la estudiante Eileen Camacho Perales (o la primera estudiante con curso)
  let student = await prisma.student.findFirst({
    where: { rude: '819814402020006' },
  });
  if (!student) {
    student = await prisma.student.findFirst({
      where: { deletedAt: null },
    });
  }
  if (!student) {
    throw new Error('No se encontraron estudiantes en la base de datos.');
  }

  const studentEmail = `estudiante.${student.ci}@sigce.edu.bo`.toLowerCase();
  const studentUserExisting = await prisma.user.findUnique({
    where: { email: studentEmail },
    include: { parent: true, teacher: true, student: true },
  });
  if (
    studentUserExisting?.parent ||
    studentUserExisting?.teacher ||
    (studentUserExisting?.student && studentUserExisting.student.id !== student.id) ||
    (studentUserExisting &&
      studentUserExisting.role !== UserRole.STUDENT &&
      !(
        studentUserExisting.role === UserRole.PARENT &&
        studentUserExisting.student?.id === student.id
      ))
  ) {
    throw new Error('La cuenta de estudiante ya pertenece a otro perfil académico.');
  }
  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
      passwordHash,
      role: UserRole.STUDENT, // Rol de consulta académica
      passwordSetupTokenHash: null,
      passwordSetupExpiresAt: null,
      passwordSetupRequired: false,
      credentialVersion: { increment: 1 },
      firstName: student.firstName,
      lastName: student.lastName,
      isActive: true,
    },
    create: {
      email: studentEmail,
      passwordHash,
      firstName: student.firstName,
      lastName: student.lastName,
      role: UserRole.STUDENT,
      isActive: true,
    },
  });

  await prisma.refreshToken.updateMany({
    where: { userId: studentUser.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  // Vincular estudiante con el usuario
  await prisma.student.update({
    where: { id: student.id },
    data: { userId: studentUser.id },
  });
  console.log(`  -> Estudiante configurado: ${student.firstName} ${student.lastName}`);
  console.log(`     RUDE: ${student.rude} | CI: ${student.ci} | Email: ${studentEmail}`);

  // También vincular a un segundo estudiante de secundaria para mayor variedad
  const student2 = await prisma.student.findFirst({
    where: { rude: '8198023220163491' }, // CARLOS FABIAN APONTE GUTIERREZ
  });
  if (student2) {
    const student2Email = `estudiante.${student2.ci}@sigce.edu.bo`.toLowerCase();
    const student2UserExisting = await prisma.user.findUnique({
      where: { email: student2Email },
      include: { parent: true, teacher: true, student: true },
    });
    if (
      student2UserExisting?.parent ||
      student2UserExisting?.teacher ||
      (student2UserExisting?.student && student2UserExisting.student.id !== student2.id) ||
      (student2UserExisting &&
        student2UserExisting.role !== UserRole.STUDENT &&
        !(
          student2UserExisting.role === UserRole.PARENT &&
          student2UserExisting.student?.id === student2.id
        ))
    ) {
      throw new Error('La segunda cuenta de estudiante ya pertenece a otro perfil académico.');
    }
    const student2User = await prisma.user.upsert({
      where: { email: student2Email },
      update: {
        passwordHash,
        role: UserRole.STUDENT,
        passwordSetupTokenHash: null,
        passwordSetupExpiresAt: null,
        passwordSetupRequired: false,
        credentialVersion: { increment: 1 },
        firstName: student2.firstName,
        lastName: student2.lastName,
        isActive: true,
      },
      create: {
        email: student2Email,
        passwordHash,
        firstName: student2.firstName,
        lastName: student2.lastName,
        role: UserRole.STUDENT,
        isActive: true,
      },
    });
    await prisma.refreshToken.updateMany({
      where: { userId: student2User.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await prisma.student.update({
      where: { id: student2.id },
      data: { userId: student2User.id },
    });
    console.log(
      `  -> Estudiante Secundario configurado: ${student2.firstName} ${student2.lastName}`,
    );
    console.log(`     RUDE: ${student2.rude} | CI: ${student2.ci} | Email: ${student2Email}`);
  }

  // --------------------------------------------------------------------------
  // 4. PADRE DE FAMILIA / TUTOR
  // --------------------------------------------------------------------------
  console.log('\n[4/4] Configurando Padre de Familia / Tutor...');
  const parentEmail = 'padre.5489210@sigce.edu.bo';
  const parentPhone = '76401234';
  const parentCi = '5489210';

  const parentUserExistente = await prisma.user.findUnique({
    where: { email: parentEmail },
    include: { parent: true, teacher: true, student: true },
  });
  if (
    parentUserExistente &&
    (parentUserExistente.role !== UserRole.PARENT ||
      !parentUserExistente.parent ||
      parentUserExistente.teacher ||
      parentUserExistente.student)
  ) {
    throw new Error('La cuenta de demostración familiar ya pertenece a otro perfil.');
  }
  const parentUser = await prisma.user.upsert({
    where: { email: parentEmail },
    update: {
      passwordHash,
      role: UserRole.PARENT,
      passwordSetupTokenHash: null,
      passwordSetupExpiresAt: null,
      passwordSetupRequired: false,
      credentialVersion: { increment: 1 },
      firstName: 'MARCOS',
      lastName: 'CAMACHO ROCHA',
      isActive: true,
    },
    create: {
      email: parentEmail,
      passwordHash,
      firstName: 'MARCOS',
      lastName: 'CAMACHO ROCHA',
      role: UserRole.PARENT,
      isActive: true,
    },
  });
  await revocarTokensRenovacion(parentUser.id);

  const parent = await prisma.parent.upsert({
    where: { ci: parentCi },
    update: {
      userId: parentUser.id,
      phone: parentPhone,
      firstName: 'MARCOS',
      lastName: 'CAMACHO ROCHA',
      email: parentEmail,
    },
    create: {
      userId: parentUser.id,
      ci: parentCi,
      phone: parentPhone,
      firstName: 'MARCOS',
      lastName: 'CAMACHO ROCHA',
      email: parentEmail,
    },
  });

  // Vincular padre con la estudiante Eileen
  await prisma.studentParent.upsert({
    where: {
      studentId_parentId: {
        studentId: student.id,
        parentId: parent.id,
      },
    },
    update: {
      relationship: RelationshipType.FATHER,
      isPrimary: true,
      canPickup: true,
    },
    create: {
      studentId: student.id,
      parentId: parent.id,
      relationship: RelationshipType.FATHER,
      isPrimary: true,
      canPickup: true,
    },
  });

  console.log(`  -> Padre de Familia configurado: ${parent.firstName} ${parent.lastName}`);
  console.log(`     C.I.: ${parent.ci} | Celular: ${parent.phone} | Email: ${parentEmail}`);
  console.log(`     Hijo/a asignado: ${student.firstName} ${student.lastName}`);

  console.log('\n===============================================================');
  console.log('✅ TODAS LAS CREDENCIALES HAN SIDO CONFIGURADAS SATISFACTORIAMENTE');
  console.log('===============================================================');
}

main()
  .catch((e) => {
    console.error('Error configurando credenciales:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function revocarTokensRenovacion(idUsuario: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId: idUsuario, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
