import {
  PrismaClient,
  UserRole,
  Gender,
  Shift,
  EnrollmentStatus,
  RelationshipType,
  DayOfWeek,
  AttendanceStatus,
  CurriculumStatus,
  AssignmentType,
  AssignmentStatus,
  AnnouncementUrgency,
  AnnouncementScope,
  AlertSeverity,
  AlertStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('========================================================================');
  console.log(' SEMBRANDO ECOSISTEMA COMPLETO Y ELEMENTOS CONFIGURABLES POR ROL (SIGCE)');
  console.log('========================================================================\n');

  // 1. Gestión Académica 2026
  const academicYear = await prisma.academicYear.findUnique({
    where: { year: 2026 },
  });
  if (!academicYear) throw new Error('No se encontró la Gestión Académica 2026.');

  const periods = await prisma.academicPeriod.findMany({
    where: { academicYearId: academicYear.id },
    orderBy: { number: 'asc' },
  });
  const period1 = periods.find((p) => p.number === 1);
  const period2 = periods.find((p) => p.number === 2);
  if (!period1 || !period2) throw new Error('Faltan periodos del 1er o 2do trimestre.');

  // Obtener Administrador
  const adminUser = await prisma.user.findFirst({
    where: { role: UserRole.ADMINISTRATIVE },
  });
  if (!adminUser) throw new Error('Usuario administrador no encontrado.');

  // 2. Cursos
  // Curso 1: 6to de Secundaria A (Hijo mayor: Mateo)
  const course6to = await prisma.course.upsert({
    where: {
      academicYearId_gradeLevel_section_shift: {
        academicYearId: academicYear.id,
        gradeLevel: 14,
        section: 'A',
        shift: Shift.MORNING,
      },
    },
    update: { name: '6to de Secundaria A', maxCapacity: 40 },
    create: {
      academicYearId: academicYear.id,
      name: '6to de Secundaria A',
      gradeLevel: 14,
      section: 'A',
      shift: Shift.MORNING,
      maxCapacity: 40,
    },
  });

  // Curso 2: 1ro de Secundaria B (Hija menor: Luciana)
  const course1ro = await prisma.course.upsert({
    where: {
      academicYearId_gradeLevel_section_shift: {
        academicYearId: academicYear.id,
        gradeLevel: 9,
        section: 'B',
        shift: Shift.MORNING,
      },
    },
    update: { name: '1ro de Secundaria B', maxCapacity: 35 },
    create: {
      academicYearId: academicYear.id,
      name: '1ro de Secundaria B',
      gradeLevel: 9,
      section: 'B',
      shift: Shift.MORNING,
      maxCapacity: 35,
    },
  });
  console.log(` Cursos listos: ${course6to.name} y ${course1ro.name}`);

  // 3. Materias
  const subjectMat = await prisma.subject.upsert({
    where: { code: 'MAT-SEC' },
    update: {},
    create: { name: 'Matemática', code: 'MAT-SEC', area: 'Ciencia y Tecnología' },
  });

  const subjectFis = await prisma.subject.upsert({
    where: { code: 'FIS-SEC' },
    update: {},
    create: { name: 'Física', code: 'FIS-SEC', area: 'Ciencia y Tecnología' },
  });

  const subjectLen = await prisma.subject.upsert({
    where: { code: 'LEN-SEC' },
    update: {},
    create: { name: 'Comunicación y Lenguajes', code: 'LEN-SEC', area: 'Comunidad y Sociedad' },
  });

  // ==============================================================================
  // A. PROFESORES Y ASIGNACIONES DOCENTES
  // ==============================================================================
  console.log('\n--- Configurando Docentes y Carga Horaria ---');
  const teacherPass = await bcrypt.hash('DocenteSigce2026!', 10);

  // Docente 1: Carlos Mendoza
  const teacherUser1 = await prisma.user.upsert({
    where: { email: 'docente@sigce.lat' },
    update: {
      firstName: 'Carlos',
      lastName: 'Mendoza',
      role: UserRole.TEACHER,
      passwordHash: teacherPass,
      isActive: true,
    },
    create: {
      email: 'docente@sigce.lat',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      role: UserRole.TEACHER,
      passwordHash: teacherPass,
      isActive: true,
    },
  });

  const teacher1 = await prisma.teacher.upsert({
    where: { ci: '6789012' },
    update: {
      userId: teacherUser1.id,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      specialty: 'Matemática y Física',
      itemNumber: 'DOC-2026',
      phone: '70011223',
    },
    create: {
      userId: teacherUser1.id,
      ci: '6789012',
      itemNumber: 'DOC-2026',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      specialty: 'Matemática y Física',
      phone: '70011223',
    },
  });

  // Asignaciones de Carlos Mendoza
  await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId_courseId_academicYearId: {
        teacherId: teacher1.id,
        subjectId: subjectMat.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
      },
    },
    update: { weeklyPeriods: 5 },
    create: {
      teacherId: teacher1.id,
      subjectId: subjectMat.id,
      courseId: course6to.id,
      academicYearId: academicYear.id,
      weeklyPeriods: 5,
    },
  });

  await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId_courseId_academicYearId: {
        teacherId: teacher1.id,
        subjectId: subjectFis.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
      },
    },
    update: { weeklyPeriods: 4 },
    create: {
      teacherId: teacher1.id,
      subjectId: subjectFis.id,
      courseId: course6to.id,
      academicYearId: academicYear.id,
      weeklyPeriods: 4,
    },
  });

  // Docente 2: Elena Quispe
  const teacherUser2 = await prisma.user.upsert({
    where: { email: 'elena.quispe@sigce.lat' },
    update: {
      firstName: 'Elena',
      lastName: 'Quispe',
      role: UserRole.TEACHER,
      passwordHash: teacherPass,
      isActive: true,
    },
    create: {
      email: 'elena.quispe@sigce.lat',
      firstName: 'Elena',
      lastName: 'Quispe',
      role: UserRole.TEACHER,
      passwordHash: teacherPass,
      isActive: true,
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { ci: '6789013' },
    update: {
      userId: teacherUser2.id,
      firstName: 'Elena',
      lastName: 'Quispe',
      specialty: 'Lenguaje y Literatura',
      itemNumber: 'DOC-2027',
      phone: '70011224',
    },
    create: {
      userId: teacherUser2.id,
      ci: '6789013',
      itemNumber: 'DOC-2027',
      firstName: 'Elena',
      lastName: 'Quispe',
      specialty: 'Lenguaje y Literatura',
      phone: '70011224',
    },
  });

  await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId_courseId_academicYearId: {
        teacherId: teacher2.id,
        subjectId: subjectLen.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
      },
    },
    update: { weeklyPeriods: 4 },
    create: {
      teacherId: teacher2.id,
      subjectId: subjectLen.id,
      courseId: course6to.id,
      academicYearId: academicYear.id,
      weeklyPeriods: 4,
    },
  });

  await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId_courseId_academicYearId: {
        teacherId: teacher2.id,
        subjectId: subjectLen.id,
        courseId: course1ro.id,
        academicYearId: academicYear.id,
      },
    },
    update: { weeklyPeriods: 5 },
    create: {
      teacherId: teacher2.id,
      subjectId: subjectLen.id,
      courseId: course1ro.id,
      academicYearId: academicYear.id,
      weeklyPeriods: 5,
    },
  });

  // ==============================================================================
  // B. HORARIOS DE CLASES (SEMANAL)
  // ==============================================================================
  console.log('--- Configurando Horarios de Clases ---');
  await prisma.classSchedule.deleteMany({
    where: {
      courseId: { in: [course6to.id, course1ro.id] },
    },
  });

  // Horario 6to Secundaria A
  const schedules6to = [
    {
      courseId: course6to.id,
      subjectId: subjectMat.id,
      teacherId: teacher1.id,
      dayOfWeek: DayOfWeek.LUNES,
      startTime: '08:00',
      endTime: '09:30',
      periodIndex: 1,
      classroom: 'Aula 6-A',
    },
    {
      courseId: course6to.id,
      subjectId: subjectFis.id,
      teacherId: teacher1.id,
      dayOfWeek: DayOfWeek.MARTES,
      startTime: '08:00',
      endTime: '09:30',
      periodIndex: 1,
      classroom: 'Laboratorio de Ciencias',
    },
    {
      courseId: course6to.id,
      subjectId: subjectLen.id,
      teacherId: teacher2.id,
      dayOfWeek: DayOfWeek.MIERCOLES,
      startTime: '08:00',
      endTime: '09:30',
      periodIndex: 1,
      classroom: 'Aula 6-A',
    },
    {
      courseId: course6to.id,
      subjectId: subjectMat.id,
      teacherId: teacher1.id,
      dayOfWeek: DayOfWeek.JUEVES,
      startTime: '09:45',
      endTime: '11:15',
      periodIndex: 2,
      classroom: 'Aula 6-A',
    },
    {
      courseId: course6to.id,
      subjectId: subjectFis.id,
      teacherId: teacher1.id,
      dayOfWeek: DayOfWeek.VIERNES,
      startTime: '09:45',
      endTime: '11:15',
      periodIndex: 2,
      classroom: 'Aula 6-A',
    },
  ];

  for (const s of schedules6to) {
    await prisma.classSchedule.create({
      data: { ...s, academicYearId: academicYear.id },
    });
  }

  // Horario 1ro Secundaria B
  await prisma.classSchedule.create({
    data: {
      courseId: course1ro.id,
      subjectId: subjectLen.id,
      teacherId: teacher2.id,
      academicYearId: academicYear.id,
      dayOfWeek: DayOfWeek.LUNES,
      startTime: '09:45',
      endTime: '11:15',
      periodIndex: 2,
      classroom: 'Aula 1-B',
    },
  });

  // ==============================================================================
  // C. AVANCE CURRICULAR (CURRICULUM TOPICS)
  // ==============================================================================
  console.log('--- Configurando Avance Curricular ---');
  await prisma.curriculumTopic.deleteMany({
    where: { courseId: course6to.id },
  });

  await prisma.curriculumTopic.createMany({
    data: [
      {
        subjectId: subjectMat.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
        periodNumber: 1,
        gradeLevel: 14,
        campo: 'Ciencia, Tecnología y Producción',
        unitTitle: 'Unidad 1: Geometría Analítica',
        title: 'La Recta, Parábola y Elipse en el plano cartesiano',
        description: 'Ecuaciones fundamentales y resolución de problemas aplicados.',
        progressPercent: 100,
        status: CurriculumStatus.COMPLETADO,
      },
      {
        subjectId: subjectMat.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
        periodNumber: 2,
        gradeLevel: 14,
        campo: 'Ciencia, Tecnología y Producción',
        unitTitle: 'Unidad 2: Cálculo Diferencial',
        title: 'Límites, Continuidad y Reglas de Derivación',
        description: 'Cálculo de derivadas directas y por definición.',
        progressPercent: 75,
        status: CurriculumStatus.EN_DESARROLLO,
      },
      {
        subjectId: subjectMat.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
        periodNumber: 3,
        gradeLevel: 14,
        campo: 'Ciencia, Tecnología y Producción',
        unitTitle: 'Unidad 3: Cálculo Integral',
        title: 'Integrales Indefinidas y Métodos de Sustitución',
        description: 'Aplicación en cálculo de áreas bajo la curva.',
        progressPercent: 0,
        status: CurriculumStatus.PLANIFICADO,
      },
      {
        subjectId: subjectFis.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
        periodNumber: 1,
        gradeLevel: 14,
        campo: 'Ciencia, Tecnología y Producción',
        unitTitle: 'Unidad 1: Mecánica de Fluidos',
        title: 'Presión Hidrostática y Principio de Arquímedes',
        description: 'Laboratorio de fluidos y empuje.',
        progressPercent: 100,
        status: CurriculumStatus.COMPLETADO,
      },
      {
        subjectId: subjectFis.id,
        courseId: course6to.id,
        academicYearId: academicYear.id,
        periodNumber: 2,
        gradeLevel: 14,
        campo: 'Ciencia, Tecnología y Producción',
        unitTitle: 'Unidad 2: Termodinámica',
        title: 'Primera Ley de la Termodinámica y Máquinas Térmicas',
        description: 'Transformaciones isotérmicas, isobáricas y adiabáticas.',
        progressPercent: 60,
        status: CurriculumStatus.EN_DESARROLLO,
      },
    ],
  });

  // ==============================================================================
  // D. TAREAS Y EXÁMENES (ASSIGNMENTS)
  // ==============================================================================
  console.log('--- Configurando Tareas y Evaluaciones ---');
  await prisma.assignment.deleteMany({
    where: { courseId: course6to.id },
  });

  const dueTomorrow = new Date();
  dueTomorrow.setDate(dueTomorrow.getDate() + 2);
  const dueNextWeek = new Date();
  dueNextWeek.setDate(dueNextWeek.getDate() + 7);

  await prisma.assignment.createMany({
    data: [
      {
        courseId: course6to.id,
        subjectId: subjectMat.id,
        teacherId: teacher1.id,
        title: 'Práctica de Derivadas y Regla de la Cadena',
        type: AssignmentType.TRABAJO_PRACTICO,
        description: 'Resolver los ejercicios 1 al 25 de la guía entregada en clase.',
        dueDate: dueTomorrow,
        maxScore: 100,
        status: AssignmentStatus.PENDIENTE,
      },
      {
        courseId: course6to.id,
        subjectId: subjectFis.id,
        teacherId: teacher1.id,
        title: 'Informe de Laboratorio: Prensa Hidráulica',
        type: AssignmentType.TAREA,
        description: 'Redactar informe en formato APA con datos y gráficas experimentales.',
        dueDate: dueNextWeek,
        maxScore: 100,
        status: AssignmentStatus.PENDIENTE,
      },
      {
        courseId: course6to.id,
        subjectId: subjectLen.id,
        teacherId: teacher2.id,
        title: 'Ensayo Crítico: Literatura Contemporánea Boliviana',
        type: AssignmentType.PROYECTO,
        description: 'Análisis de la obra "Raza de Bronce" y su contexto histórico.',
        dueDate: dueNextWeek,
        maxScore: 100,
        status: AssignmentStatus.PENDIENTE,
      },
    ],
  });

  // ==============================================================================
  // E. FAMILIA Y SUS DOS HIJOS (MATEO Y LUCIANA)
  // ==============================================================================
  console.log('\n--- Configurando Familia y Estudiantes ---');
  const studentPass = await bcrypt.hash('EstudianteSigce2026!', 10);
  const parentPass = await bcrypt.hash('FamiliaSigce2026!', 10);

  // Padre: Roberto Fernández
  const parentUser = await prisma.user.upsert({
    where: { email: 'familia@sigce.lat' },
    update: {
      firstName: 'Roberto',
      lastName: 'Fernández',
      role: UserRole.PARENT,
      passwordHash: parentPass,
      isActive: true,
    },
    create: {
      email: 'familia@sigce.lat',
      firstName: 'Roberto',
      lastName: 'Fernández',
      role: UserRole.PARENT,
      passwordHash: parentPass,
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

  // Hijo 1: Mateo Fernández (6to Secundaria A)
  const studentUser1 = await prisma.user.upsert({
    where: { email: 'estudiante@sigce.lat' },
    update: {
      firstName: 'Mateo',
      lastName: 'Fernández',
      role: UserRole.STUDENT,
      passwordHash: studentPass,
      isActive: true,
    },
    create: {
      email: 'estudiante@sigce.lat',
      firstName: 'Mateo',
      lastName: 'Fernández',
      role: UserRole.STUDENT,
      passwordHash: studentPass,
      isActive: true,
    },
  });

  const student1 = await prisma.student.upsert({
    where: { rude: '807300012026001' },
    update: {
      userId: studentUser1.id,
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
      userId: studentUser1.id,
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

  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      studentId_academicYearId: {
        studentId: student1.id,
        academicYearId: academicYear.id,
      },
    },
    update: { courseId: course6to.id, status: EnrollmentStatus.ACTIVE },
    create: {
      studentId: student1.id,
      courseId: course6to.id,
      academicYearId: academicYear.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  // Vinculación Padre -> Mateo
  const rel1 = await prisma.studentParent.findFirst({
    where: { studentId: student1.id, parentId: parent.id },
  });
  if (!rel1) {
    await prisma.studentParent.create({
      data: {
        studentId: student1.id,
        parentId: parent.id,
        relationship: RelationshipType.FATHER,
        isPrimary: true,
        canPickup: true,
      },
    });
  }

  // Hijo 2: Luciana Fernández (1ro Secundaria B)
  const studentUser2 = await prisma.user.upsert({
    where: { email: 'luciana@sigce.lat' },
    update: {
      firstName: 'Luciana',
      lastName: 'Fernández',
      role: UserRole.STUDENT,
      passwordHash: studentPass,
      isActive: true,
    },
    create: {
      email: 'luciana@sigce.lat',
      firstName: 'Luciana',
      lastName: 'Fernández',
      role: UserRole.STUDENT,
      passwordHash: studentPass,
      isActive: true,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { rude: '807300012026002' },
    update: {
      userId: studentUser2.id,
      ci: '10234568',
      firstName: 'Luciana',
      lastName: 'Fernández',
      birthDate: new Date('2013-09-22T00:00:00.000Z'),
      gender: Gender.FEMALE,
      address: 'Av. Las Américas #123, Santa Cruz',
      phone: '71234567',
      isActive: true,
    },
    create: {
      userId: studentUser2.id,
      rude: '807300012026002',
      ci: '10234568',
      firstName: 'Luciana',
      lastName: 'Fernández',
      birthDate: new Date('2013-09-22T00:00:00.000Z'),
      gender: Gender.FEMALE,
      address: 'Av. Las Américas #123, Santa Cruz',
      phone: '71234567',
      isActive: true,
    },
  });

  const enrollment2 = await prisma.enrollment.upsert({
    where: {
      studentId_academicYearId: {
        studentId: student2.id,
        academicYearId: academicYear.id,
      },
    },
    update: { courseId: course1ro.id, status: EnrollmentStatus.ACTIVE },
    create: {
      studentId: student2.id,
      courseId: course1ro.id,
      academicYearId: academicYear.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  // Vinculación Padre -> Luciana
  const rel2 = await prisma.studentParent.findFirst({
    where: { studentId: student2.id, parentId: parent.id },
  });
  if (!rel2) {
    await prisma.studentParent.create({
      data: {
        studentId: student2.id,
        parentId: parent.id,
        relationship: RelationshipType.FATHER,
        isPrimary: true,
        canPickup: true,
      },
    });
  }
  console.log(` Hijos vinculados al Padre Roberto: Mateo (6to Sec A) y Luciana (1ro Sec B)`);

  // ==============================================================================
  // F. CALIFICACIONES DEL 1ER Y 2DO TRIMESTRE
  // ==============================================================================
  console.log('--- Sembrando Calificaciones ---');
  const now = new Date();

  // Mateo Fernández
  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student1.id,
        subjectId: subjectMat.id,
        periodId: period1.id,
      },
    },
    update: { value: 88, publishedAt: now },
    create: {
      enrollmentId: enrollment1.id,
      studentId: student1.id,
      subjectId: subjectMat.id,
      periodId: period1.id,
      value: 88,
      publishedAt: now,
      remarks: 'Excelente comprensión de funciones',
    },
  });

  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student1.id,
        subjectId: subjectMat.id,
        periodId: period2.id,
      },
    },
    update: { value: 85, publishedAt: now },
    create: {
      enrollmentId: enrollment1.id,
      studentId: student1.id,
      subjectId: subjectMat.id,
      periodId: period2.id,
      value: 85,
      publishedAt: now,
      remarks: 'Buen desempeño en cálculo de límites',
    },
  });

  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student1.id,
        subjectId: subjectFis.id,
        periodId: period1.id,
      },
    },
    update: { value: 91, publishedAt: now },
    create: {
      enrollmentId: enrollment1.id,
      studentId: student1.id,
      subjectId: subjectFis.id,
      periodId: period1.id,
      value: 91,
      publishedAt: now,
      remarks: 'Sobresaliente en laboratorio',
    },
  });

  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student1.id,
        subjectId: subjectLen.id,
        periodId: period1.id,
      },
    },
    update: { value: 92, publishedAt: now },
    create: {
      enrollmentId: enrollment1.id,
      studentId: student1.id,
      subjectId: subjectLen.id,
      periodId: period1.id,
      value: 92,
      publishedAt: now,
      remarks: 'Habilidad destacada en redacción',
    },
  });

  // Luciana Fernández
  await prisma.grade.upsert({
    where: {
      studentId_subjectId_periodId: {
        studentId: student2.id,
        subjectId: subjectLen.id,
        periodId: period1.id,
      },
    },
    update: { value: 96, publishedAt: now },
    create: {
      enrollmentId: enrollment2.id,
      studentId: student2.id,
      subjectId: subjectLen.id,
      periodId: period1.id,
      value: 96,
      publishedAt: now,
      remarks: 'Excelente ortografía y lectura fluida',
    },
  });

  // ==============================================================================
  // G. ASISTENCIAS
  // ==============================================================================
  console.log('--- Sembrando Asistencias ---');
  await prisma.attendance.deleteMany({
    where: { studentId: { in: [student1.id, student2.id] } },
  });

  await prisma.attendance.createMany({
    data: [
      {
        studentId: student1.id,
        courseId: course6to.id,
        registeredById: teacherUser1.id,
        date: new Date('2026-03-02'),
        status: AttendanceStatus.PRESENT,
      },
      {
        studentId: student1.id,
        courseId: course6to.id,
        registeredById: teacherUser1.id,
        date: new Date('2026-03-03'),
        status: AttendanceStatus.LATE,
        justification: 'Atraso de 10 min por lluvia intensa, justificado por dirección.',
      },
      {
        studentId: student1.id,
        courseId: course6to.id,
        registeredById: teacherUser1.id,
        date: new Date('2026-03-04'),
        status: AttendanceStatus.PRESENT,
      },
      {
        studentId: student2.id,
        courseId: course1ro.id,
        registeredById: teacherUser2.id,
        date: new Date('2026-03-02'),
        status: AttendanceStatus.PRESENT,
      },
      {
        studentId: student2.id,
        courseId: course1ro.id,
        registeredById: teacherUser2.id,
        date: new Date('2026-03-03'),
        status: AttendanceStatus.PRESENT,
      },
    ],
  });

  // ==============================================================================
  // H. COMUNICADOS Y AVISOS INSTITUCIONALES (ANNOUNCEMENTS)
  // ==============================================================================
  console.log('--- Sembrando Comunicados Institucionales ---');
  await prisma.announcement.deleteMany();

  await prisma.announcement.createMany({
    data: [
      {
        title: 'Convocatoria: Primera Reunión General de Padres y Tutores de Familia',
        content:
          'Se convoca a todos los padres de familia a la asamblea informativa del primer trimestre que se llevará a cabo el viernes a las 18:30 en el coliseo institucional. Su puntual asistencia es de suma importancia para el seguimiento de la gestión.',
        urgency: AnnouncementUrgency.ALTA,
        scope: AnnouncementScope.ALL_PARENTS,
        createdById: adminUser.id,
      },
      {
        title: 'Feria Científica y Tecnológica 2026: Inscripción de Proyectos de Aula',
        content:
          'Se invita a todos los estudiantes de nivel secundaria a conformar sus grupos de trabajo para la presentación de experimentos y prototipos tecnológicos en las áreas de Física, Química y Robótica.',
        urgency: AnnouncementUrgency.MEDIA,
        scope: AnnouncementScope.ALL_COURSES,
        createdById: adminUser.id,
      },
      {
        title: 'Práctica evaluada de Derivadas y Límites (6to de Secundaria A)',
        content:
          'Estimados estudiantes, recuerden que la entrega de la práctica formativa de cálculo diferencial vence impostergablemente este jueves a primera hora.',
        urgency: AnnouncementUrgency.MEDIA,
        scope: AnnouncementScope.COURSE,
        targetCourseId: course6to.id,
        createdById: teacherUser1.id,
      },
    ],
  });

  // ==============================================================================
  // I. ALERTAS TEMPRANAS PREVENTIVAS
  // ==============================================================================
  console.log('--- Sembrando Alertas Preventivas ---');
  await prisma.alert.deleteMany();

  await prisma.alert.createMany({
    data: [
      {
        userId: parentUser.id,
        studentId: student1.id,
        title: 'Registro de Atraso Registrado',
        message:
          'Se registró un atraso para Mateo Fernández el 03/03/2026 a las 08:10. Motivo registrado: Lluvia intensa.',
        severity: AlertSeverity.INFO,
        status: AlertStatus.RESOLVED,
        isRead: true,
      },
      {
        userId: teacherUser1.id,
        title: 'Cierre del 2do Trimestre Próximo',
        message:
          'Recordatorio: La fecha límite para la consolidación de notas del 2do Trimestre en el sistema vence en 15 días.',
        severity: AlertSeverity.WARNING,
        status: AlertStatus.OPEN,
        isRead: false,
      },
      {
        userId: studentUser1.id,
        studentId: student1.id,
        title: 'Nueva Tarea Asignada en Matemática',
        message:
          'El Prof. Carlos Mendoza ha publicado la Práctica de Derivadas con entrega para pasado mañana.',
        severity: AlertSeverity.INFO,
        status: AlertStatus.OPEN,
        isRead: false,
      },
    ],
  });

  console.log('\n========================================================================');
  console.log(' ECOSISTEMA Y ELEMENTOS DE TODOS LOS ROLES CONFIGURADOS SATISFACTORIAMENTE');
  console.log('========================================================================\n');
}

main()
  .catch((e) => {
    console.error('Error durante la siembra de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

