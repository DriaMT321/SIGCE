import { PrismaClient, UserRole, RelationshipType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('===============================================================');
  console.log('CONFIGURANDO CREDENCIALES SENCILLAS PARA TODOS LOS ROLES (SIGCE)');
  console.log('===============================================================\n');

  const SIMPLE_PASSWORD = '123456';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(SIMPLE_PASSWORD, saltRounds);

  // --------------------------------------------------------------------------
  // 1. ADMINISTRADOR
  // --------------------------------------------------------------------------
  console.log('[1/4] Configurando Usuario Administrador...');
  const adminEmails = ['admin@sigce.edu.bo', 'admin@example.local'];
  for (const email of adminEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
      },
      create: {
        email,
        passwordHash,
        firstName: 'Administrador',
        lastName: 'General',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
  }
  console.log('  -> Admin listo: admin@sigce.edu.bo / admin@example.local (Clave: 123456)');

  // --------------------------------------------------------------------------
  // 2. PROFESORES / DOCENTES
  // --------------------------------------------------------------------------
  console.log('\n[2/4] Configurando Usuarios Docentes con clave sencilla...');
  // Actualizar todos los usuarios docentes existentes a la clave sencilla
  const updatedTeachers = await prisma.user.updateMany({
    where: { role: UserRole.TEACHER },
    data: { passwordHash, isActive: true },
  });
  console.log(`  -> ${updatedTeachers.count} docentes actualizados con la clave sencilla (123456).`);

  // Asegurar que al menos dos docentes destacados tengan sus datos listos
  const sampleTeacher1 = await prisma.teacher.findFirst({
    where: { ci: '4258830' }, // Eyennil Galvez Linares, item 11
    include: { user: true },
  });
  if (sampleTeacher1) {
    console.log(`  -> Docente Ejemplo 1: Prof. ${sampleTeacher1.firstName} ${sampleTeacher1.lastName}`);
    console.log(`     CI: ${sampleTeacher1.ci} | Ítem: ${sampleTeacher1.itemNumber} | Email: ${sampleTeacher1.user.email}`);
  }

  const sampleTeacher2 = await prisma.teacher.findFirst({
    where: { ci: '3918213' }, // Maura Mariluz Alvarez Rojas, item 1
    include: { user: true },
  });
  if (sampleTeacher2) {
    console.log(`  -> Docente Ejemplo 2: Prof. ${sampleTeacher2.firstName} ${sampleTeacher2.lastName}`);
    console.log(`     CI: ${sampleTeacher2.ci} | Ítem: ${sampleTeacher2.itemNumber} | Email: ${sampleTeacher2.user.email}`);
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
  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
      passwordHash,
      role: UserRole.PARENT, // Rol de consulta académica
      firstName: student.firstName,
      lastName: student.lastName,
      isActive: true,
    },
    create: {
      email: studentEmail,
      passwordHash,
      firstName: student.firstName,
      lastName: student.lastName,
      role: UserRole.PARENT,
      isActive: true,
    },
  });

  // Vincular estudiante con el usuario
  await prisma.student.update({
    where: { id: student.id },
    data: { userId: studentUser.id },
  });
  console.log(`  -> Estudiante configurado: ${student.firstName} ${student.lastName}`);
  console.log(`     RUDE: ${student.rude} | CI: ${student.ci} | Email: ${studentEmail} (Clave: 123456)`);

  // También vincular a un segundo estudiante de secundaria para mayor variedad
  const student2 = await prisma.student.findFirst({
    where: { rude: '8198023220163491' }, // CARLOS FABIAN APONTE GUTIERREZ
  });
  if (student2) {
    const student2Email = `estudiante.${student2.ci}@sigce.edu.bo`.toLowerCase();
    const student2User = await prisma.user.upsert({
      where: { email: student2Email },
      update: {
        passwordHash,
        role: UserRole.PARENT,
        firstName: student2.firstName,
        lastName: student2.lastName,
        isActive: true,
      },
      create: {
        email: student2Email,
        passwordHash,
        firstName: student2.firstName,
        lastName: student2.lastName,
        role: UserRole.PARENT,
        isActive: true,
      },
    });
    await prisma.student.update({
      where: { id: student2.id },
      data: { userId: student2User.id },
    });
    console.log(`  -> Estudiante Secundario configurado: ${student2.firstName} ${student2.lastName}`);
    console.log(`     RUDE: ${student2.rude} | CI: ${student2.ci} | Email: ${student2Email} (Clave: 123456)`);
  }

  // --------------------------------------------------------------------------
  // 4. PADRE DE FAMILIA / TUTOR
  // --------------------------------------------------------------------------
  console.log('\n[4/4] Configurando Padre de Familia / Tutor...');
  const parentEmail = 'padre.5489210@sigce.edu.bo';
  const parentPhone = '76401234';
  const parentCi = '5489210';

  const parentUser = await prisma.user.upsert({
    where: { email: parentEmail },
    update: {
      passwordHash,
      role: UserRole.PARENT,
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
  console.log(`     C.I.: ${parent.ci} | Celular: ${parent.phone} | Email: ${parentEmail} (Clave: 123456)`);
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
