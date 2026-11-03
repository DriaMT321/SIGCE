import {
  PrismaClient,
  UserRole,
  Gender,
  Shift,
  EnrollmentStatus,
  RelationshipType,
  DayOfWeek,
  AttendanceStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('===============================================================');
  console.log(' SEMBRANDO CUENTAS DE DEMOSTRACIÓN PARA TODOS LOS ROLES (SIGCE)');
  console.log('===============================================================\n');

  // 1. Obtener Gestión Académica 2026
  const academicYear = await prisma.academicYear.findUnique({
    where: { year: 2026 },
  });
  if (!academicYear) {
    throw new Error('No se encontró la Gestión Académica 2026.');
  }

  const period1 = await prisma.academicPeriod.findFirst({
    where: { academicYearId: academicYear.id, number: 1 },
  });
  if (!period1) {
    throw new Error('No se encontró el 1er Trimestre.');
  }

  // 2. Crear Curso Demo (6to de Secundaria A)
  const course = await prisma.course.upsert({
    where: {
      academicYearId_gradeLevel_section_shift: {
        academicYearId: academicYear.id,
        gradeLevel: 14,
        section: 'A',
        shift: Shift.MORNING,
      },
    },
    update: {
      name: '6to de Secundaria A',
      maxCapacity: 40,
    },
    create: {
      academicYearId: academicYear.id,
      name: '6to de Secundaria A',
      gradeLevel: 14,
      section: 'A',
      shift: Shift.MORNING,
      maxCapacity: 40,
    },
  });
  console.log(` Curso preparado: ${course.name} (ID: ${course.id})`);

  // 3. Obtener Materias (Matemática y Lenguaje)
  let subjectMat = await prisma.subject.findFirst({
    where: { OR: [{ code: 'MAT-SEC' }, { code: 'MAT' }, { name: { contains: 'Matemática' } }] },
  });
  if (!subjectMat) {
    subjectMat = await prisma.subject.create({
      data: {
        name: 'Matemática',
        code: 'MAT-SEC',
        area: 'Ciencia y Tecnología',
      },
    });
  }

  let subjectLen = await prisma.subject.findFirst({
    where: { OR: [{ code: 'LEN-SEC' }, { code: 'LC' }, { name: { contains: 'Lenguaje' } }] },
  });
  if (!subjectLen) {
    subjectLen = await prisma.subject.create({
      data: {
        name: 'Comunicación y Lenguajes',
        code: 'LEN-SEC',
        area: 'Comunidad y Sociedad',
      },
    });
  }

  // ==============================================================================
  // A. ROL DOCENTE
  // ==============================================================================
  console.log('\n--- Creando Docente ---');
  const teacherPasswordHash = await bcrypt.hash('DocenteSigce2026!', 10);
  const teacherUser = await prisma.user.upsert({
    where: { email: 'docente@sigce.lat' },
    update: {
      passwordHash: teacherPasswordHash,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      role: UserRole.TEACHER,
      isActive: true,
    },
    create: {
      email: 'docente@sigce.lat',
      passwordHash: teacherPasswordHash,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      role: UserRole.TEACHER,
      isActive: true,
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { ci: '6789012' },
    update: {
      userId: teacherUser.id,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      specialty: 'Matemática y Física',
      itemNumber: 'DOC-2026',
      phone: '70011223',
    },
    create: {
      userId: teacherUser.id,
      ci: '6789012',
      itemNumber: 'DOC-2026',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      specialty: 'Matemática y Física',
      phone: '70011223',
    },
  });

  // Asignar materia al docente en el curso
  await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId_courseId_academicYearId: {
        teacherId: teacher.id,
        subjectId: subjectMat.id,
        courseId: course.id,
        academicYearId: academicYear.id,
      },
    },
    update: { weeklyPeriods: 5 },
    create: {
      teacherId: teacher.id,
      subjectId: subjectMat.id,
      courseId: course.id,
      academicYearId: academicYear.id,
      weeklyPeriods: 5,
    },
  });

  // Horario del docente
  await prisma.classSchedule.deleteMany({
    where: { teacherId: teacher.id, courseId: course.id },
  });
  await prisma.classSchedule.create({
    data: {
      courseId: course.id,
      subjectId: subjectMat.id,
      teacherId: teacher.id,
      academicYearId: academicYear.id,
      dayOfWeek: DayOfWeek.LUNES,
      startTime: '08:00',
      endTime: '09:30',
      periodIndex: 1,
      classroom: 'Aula 6-A',
    },
  });
  console.log(` Docente listo: Carlos Mendoza (Item: DOC-2026, CI: 6789012)`);

  // ==============================================================================
  // B. ROL ESTUDIANTE
  // ==============================================================================
  console.log('\n--- Creando Estudiante ---');
  const studentPasswordHash = await bcrypt.hash('EstudianteSigce2026!', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'estudiante@sigce.lat' },
    update: {
      passwordHash: studentPasswordHash,
      firstName: 'Mateo',
      lastName: 'Fernández',
      role: UserRole.STUDENT,
      isActive: true,
    },
    create: {
      email: 'estudiante@sigce.lat',
      passwordHash: studentPasswordHash,
      firstName: 'Mateo',
      lastName: 'Fernández',
      role: UserRole.STUDENT,
      isActive: true,
    },
  });

  const student = await prisma.student.upsert({
    where: { rude: '807300012026001' },
    update: {
      userId: studentUser.id,
      ci: '10234567',
      firstName: 'Mateo',
      lastName: 'Fernández',
      birthDate: new Date('2008-05-14T00:00:00.000Z'),
      gender: Gender.MALE,
      address: 'Av. Las Américas #123, Santa Cruz',
      phone: '71234567',
      isActive: true,
    },
    create: {
      userId: studentUser.id,
      rude: '807300012026001',
      ci: '10234567',
      firstName: 'Mateo',
      lastName: 'Fernández',
      birthDate: new Date('2008-05-14T00:00:00.000Z'),
      gender: Gender.MALE,
      address: 'Av. Las Américas #123, Santa Cruz',
      phone: '71234567',
      isActive: true,
    },
  });

  // Matrícula del estudiante en el curso
  const enrollment = await prisma.enrollment.upsert({
    where: {
      studentId_academicYearId: {
        studentId: student.id,
        academicYearId: academicYear.id,
      },
    },
    update: {
      courseId: course.id,
      status: EnrollmentStatus.ACTIVE,
    },
    create: {
      studentId: student.id,
      courseId: course.id,
      academicYearId: academicYear.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  // Calificaciones demo para el estudiante
  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student.id,
        subjectId: subjectMat.id,
        periodId: period1.id,
      },
    },
    update: {
      value: 88,
      remarks: 'Excelente desempeño y participación',
      publishedAt: new Date(),
    },
    create: {
      enrollmentId: enrollment.id,
      studentId: student.id,
      subjectId: subjectMat.id,
      periodId: period1.id,
      value: 88,
      remarks: 'Excelente desempeño y participación',
      publishedAt: new Date(),
    },
  });

  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student.id,
        subjectId: subjectLen.id,
        periodId: period1.id,
      },
    },
    update: {
      value: 92,
      remarks: 'Sobresaliente en comprensión lectora',
      publishedAt: new Date(),
    },
    create: {
      enrollmentId: enrollment.id,
      studentId: student.id,
      subjectId: subjectLen.id,
      periodId: period1.id,
      value: 92,
      remarks: 'Sobresaliente en comprensión lectora',
      publishedAt: new Date(),
    },
  });

  // Asistencia demo
  await prisma.attendance.deleteMany({
    where: { studentId: student.id },
  });
  await prisma.attendance.create({
    data: {
      studentId: student.id,
      courseId: course.id,
      date: new Date('2026-03-02T08:00:00.000Z'),
      status: AttendanceStatus.PRESENT,
      remarks: 'Puntual',
    },
  });
  console.log(` Estudiante listo: Mateo Fernández (RUDE: 807300012026001, CI: 10234567)`);

  // ==============================================================================
  // C. ROL FAMILIA / TUTOR
  // ==============================================================================
  console.log('\n--- Creando Familiar/Tutor ---');
  const parentPasswordHash = await bcrypt.hash('FamiliaSigce2026!', 10);
  const parentUser = await prisma.user.upsert({
    where: { email: 'familia@sigce.lat' },
    update: {
      passwordHash: parentPasswordHash,
      firstName: 'Roberto',
      lastName: 'Fernández',
      role: UserRole.PARENT,
      isActive: true,
    },
    create: {
      email: 'familia@sigce.lat',
      passwordHash: parentPasswordHash,
      firstName: 'Roberto',
      lastName: 'Fernández',
      role: UserRole.PARENT,
      isActive: true,
    },
  });

  const parent = await prisma.parent.upsert({
    where: { ci: '4567890' },
    update: {
      userId: parentUser.id,
      phone: '71234567',
      firstName: 'Roberto',
      lastName: 'Fernández',
      address: 'Av. Las Américas #123, Santa Cruz',
      occupation: 'Ingeniero Civil',
    },
    create: {
      userId: parentUser.id,
      ci: '4567890',
      phone: '71234567',
      firstName: 'Roberto',
      lastName: 'Fernández',
      address: 'Av. Las Américas #123, Santa Cruz',
      occupation: 'Ingeniero Civil',
    },
  });

  // Vinculación Familiar <-> Estudiante
  const existingRel = await prisma.studentParent.findFirst({
    where: { studentId: student.id, parentId: parent.id },
  });
  if (!existingRel) {
    await prisma.studentParent.create({
      data: {
        studentId: student.id,
        parentId: parent.id,
        relationship: RelationshipType.FATHER,
        isPrimary: true,
        canPickup: true,
      },
    });
  }
  console.log(` Familiar listo: Roberto Fernández (CI: 4567890, Cel: 71234567)`);

  console.log('\n===============================================================');
  console.log(' SEED DE TODOS LOS ROLES COMPLETADO SATISFACTORIAMENTE');
  console.log('===============================================================');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
