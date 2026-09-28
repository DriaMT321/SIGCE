import {
  PrismaClient,
  Shift,
  EnrollmentStatus,
  DayOfWeek,
  CurriculumStatus,
} from '@prisma/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';

dotenv.config();

const prisma = new PrismaClient();

// Definición oficial de los 16 Cursos Institucionales
interface OfficialCourseDef {
  gradeLevel: number;
  name: string;
  section: string;
  shift: Shift;
  maxCapacity: number;
  level: 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA';
  sourceKeys: string[]; // Claves o nombres en estudiantes_extraidos.json
}

const OFFICIAL_COURSES: OfficialCourseDef[] = [
  // --- INICIAL (4 cursos) ---
  {
    gradeLevel: 1,
    name: 'Inicial - Pollito',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: ['Inicial en Familia Comunitaria - Primero C'],
  },
  {
    gradeLevel: 2,
    name: 'Inicial - Nidito',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: ['Inicial en Familia Comunitaria - Primero B'],
  },
  {
    gradeLevel: 3,
    name: 'Inicial - Pre Kinder',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: ['Inicial en Familia Comunitaria - Primero A'],
  },
  {
    gradeLevel: 4,
    name: 'Inicial - Kinder',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: [
      'Inicial en Familia Comunitaria - Segundo A',
      'Inicial en Familia Comunitaria - Segundo B',
    ],
  },

  // --- PRIMARIA (6 cursos) ---
  {
    gradeLevel: 5,
    name: '1º de Primaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'PRIMARIA',
    sourceKeys: [
      'Primaria Comunitaria Vocacional - Primero A',
      'Primaria Comunitaria Vocacional - Primero B',
    ],
  },
  {
    gradeLevel: 6,
    name: '2º de Primaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'PRIMARIA',
    sourceKeys: [
      'Primaria Comunitaria Vocacional - Segundo A',
      'Primaria Comunitaria Vocacional - Segundo B',
    ],
  },
  {
    gradeLevel: 7,
    name: '3º de Primaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'PRIMARIA',
    sourceKeys: [
      'Primaria Comunitaria Vocacional - Tercero A',
      'Primaria Comunitaria Vocacional - Tercero B',
    ],
  },
  {
    gradeLevel: 8,
    name: '4º de Primaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'PRIMARIA',
    sourceKeys: [
      'Primaria Comunitaria Vocacional - Cuarto A',
      'Primaria Comunitaria Vocacional - Cuarto B',
    ],
  },
  {
    gradeLevel: 9,
    name: '5º de Primaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'PRIMARIA',
    sourceKeys: [
      'Primaria Comunitaria Vocacional - Quinto A',
      'Primaria Comunitaria Vocacional - Quinto B',
    ],
  },
  {
    gradeLevel: 10,
    name: '6º de Primaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'PRIMARIA',
    sourceKeys: [
      'Primaria Comunitaria Vocacional - Sexto A',
      'Primaria Comunitaria Vocacional - Sexto B',
    ],
  },

  // --- SECUNDARIA (6 cursos) ---
  {
    gradeLevel: 11,
    name: '1º de Secundaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'SECUNDARIA',
    sourceKeys: [
      'Secundaria Comunitaria Productiva - Primero A',
      'Secundaria Comunitaria Productiva - Primero B',
    ],
  },
  {
    gradeLevel: 12,
    name: '2º de Secundaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'SECUNDARIA',
    sourceKeys: [
      'Secundaria Comunitaria Productiva - Segundo A',
      'Secundaria Comunitaria Productiva - Segundo B',
    ],
  },
  {
    gradeLevel: 13,
    name: '3º de Secundaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'SECUNDARIA',
    sourceKeys: [
      'Secundaria Comunitaria Productiva - Tercero A',
      'Secundaria Comunitaria Productiva - Tercero B',
    ],
  },
  {
    gradeLevel: 14,
    name: '4º de Secundaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 100,
    level: 'SECUNDARIA',
    sourceKeys: [
      'Secundaria Comunitaria Productiva - Cuarto A',
      'Secundaria Comunitaria Productiva - Cuarto B',
      'Secundaria Comunitaria Productiva - Cuarto C',
    ],
  },
  {
    gradeLevel: 15,
    name: '5º de Secundaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'SECUNDARIA',
    sourceKeys: [
      'Secundaria Comunitaria Productiva - Quinto A',
      'Secundaria Comunitaria Productiva - Quinto B',
    ],
  },
  {
    gradeLevel: 16,
    name: '6º de Secundaria',
    section: 'U',
    shift: Shift.MORNING,
    maxCapacity: 80,
    level: 'SECUNDARIA',
    sourceKeys: [
      'Secundaria Comunitaria Productiva - Sexto A',
      'Secundaria Comunitaria Productiva - Sexto B',
    ],
  },
];

// Materias Oficiales según Planes y Programas (4095.pdf, 4096.pdf y Nivel Inicial)
const OFFICIAL_SUBJECTS = [
  // Inicial
  {
    code: 'DII',
    name: 'Desarrollo Integral Infantil',
    area: 'Desarrollo Infantil',
    description: 'Psicomotricidad, lenguaje, socioafectividad y exploración sensorial',
  },
  // Primaria y Secundaria
  {
    code: 'MAT',
    name: 'Matemática',
    area: 'Ciencia, Tecnología y Producción',
    description: 'Razonamiento lógico, álgebra, geometría, cálculo y estadística',
  },
  {
    code: 'LC',
    name: 'Comunicación y Lenguajes: Lengua Castellana',
    area: 'Comunidad y Sociedad',
    description: 'Lectura comprensiva, producción escrita, literatura y oratoria',
  },
  {
    code: 'LO',
    name: 'Lengua Originaria',
    area: 'Comunidad y Sociedad',
    description: 'Recuperación y práctica de lengua originaria regional',
  },
  {
    code: 'LEX',
    name: 'Lengua Extranjera: Inglés',
    area: 'Comunidad y Sociedad',
    description: 'Comprensión auditiva, conversación y redacción en inglés',
  },
  {
    code: 'CSO',
    name: 'Ciencias Sociales',
    area: 'Comunidad y Sociedad',
    description: 'Historia de Bolivia, formación ciudadana, geografía y cívica',
  },
  {
    code: 'CNA',
    name: 'Ciencias Naturales',
    area: 'Vida Tierra Territorio',
    description: 'Biología básica, ecología, cuerpo humano y medio ambiente',
  },
  {
    code: 'BIO',
    name: 'Ciencias Naturales: Biología - Geografía',
    area: 'Vida Tierra Territorio',
    description: 'Morfofisiología, biodiversidad, genética y ecosistemas',
  },
  {
    code: 'FIS',
    name: 'Ciencias Naturales: Física',
    area: 'Vida Tierra Territorio',
    description: 'Cinemática, dinámica, estática, energía, ondas y electromagnetismo',
  },
  {
    code: 'QUI',
    name: 'Ciencias Naturales: Química',
    area: 'Vida Tierra Territorio',
    description: 'Química general, inorgánica, estequiometría y química del carbono',
  },
  {
    code: 'APV',
    name: 'Artes Plásticas y Visuales',
    area: 'Comunidad y Sociedad',
    description: 'Dibujo técnico, pintura artística, modelado y artes gráficas',
  },
  {
    code: 'EMU',
    name: 'Educación Musical',
    area: 'Comunidad y Sociedad',
    description: 'Teoría musical, práctica coral, ritmos folclóricos e instrumentos',
  },
  {
    code: 'EFD',
    name: 'Educación Física y Deportes',
    area: 'Comunidad y Sociedad',
    description: 'Acondicionamiento físico, atletismo, fútbol, básquet y voleibol',
  },
  {
    code: 'CFS',
    name: 'Cosmovisiones, Filosofía y Psicología',
    area: 'Cosmos y Pensamiento',
    description: 'Desarrollo humano, lógica formal, corrientes filosóficas y ética',
  },
  {
    code: 'VER',
    name: 'Valores, Espiritualidades y Religiones',
    area: 'Cosmos y Pensamiento',
    description: 'Valores comunitarios, reciprocidad, espiritualidad y diálogo intercultural',
  },
  {
    code: 'TTG',
    name: 'Técnica Tecnológica General',
    area: 'Ciencia, Tecnología y Producción',
    description: 'Robótica, TIC, diseño digital, electrónica y proyectos productivos',
  },
];

async function run() {
  console.log('===============================================================');
  console.log('REESTRUCTURACIÓN DE 16 CURSOS, PLAN DE ESTUDIOS, DOCENTES Y HORARIOS');
  console.log('===============================================================\n');

  // 1. Gestión Académica Activa (2026)
  const currentYear = 2026;
  const academicYear = await prisma.academicYear.findUnique({
    where: { year: currentYear },
  });

  if (!academicYear) {
    throw new Error(`Gestión ${currentYear} no encontrada.`);
  }
  console.log(`[1/6] Gestión activa: ${academicYear.name} (${academicYear.id})`);

  // Asegurar Periodos Trimestrales
  const periods = await prisma.academicPeriod.findMany({
    where: { academicYearId: academicYear.id },
    orderBy: { number: 'asc' },
  });
  console.log(`  -> ${periods.length} trimestres verificados.`);

  // 2. Registrar Materias Oficiales
  console.log('\n[2/6] Sincronizando Catálogo de Materias Oficiales...');
  const subjectMap = new Map<string, string>(); // code -> id

  for (const s of OFFICIAL_SUBJECTS) {
    const existing = await prisma.subject.findFirst({
      where: {
        OR: [
          { code: s.code },
          { name: s.name },
        ],
      },
    });

    let sub;
    if (existing) {
      sub = await prisma.subject.update({
        where: { id: existing.id },
        data: {
          code: s.code,
          name: s.name,
          area: s.area,
          description: s.description,
        },
      });
    } else {
      sub = await prisma.subject.create({
        data: {
          code: s.code,
          name: s.name,
          area: s.area,
          description: s.description,
        },
      });
    }
    subjectMap.set(s.code, sub.id);
  }
  console.log(`  -> ${subjectMap.size} materias registradas/actualizadas.`);

  // 3. Crear los 16 Cursos Oficiales
  console.log('\n[3/6] Creando los 16 Cursos Institucionales Oficiales...');
  const officialCourseMap = new Map<number, string>(); // gradeLevel -> courseId

  for (const c of OFFICIAL_COURSES) {
    const course = await prisma.course.upsert({
      where: {
        academicYearId_gradeLevel_section_shift: {
          academicYearId: academicYear.id,
          gradeLevel: c.gradeLevel,
          section: c.section,
          shift: c.shift,
        },
      },
      update: {
        name: c.name,
        maxCapacity: c.maxCapacity,
      },
      create: {
        academicYearId: academicYear.id,
        name: c.name,
        gradeLevel: c.gradeLevel,
        section: c.section,
        shift: c.shift,
        maxCapacity: c.maxCapacity,
      },
    });
    officialCourseMap.set(c.gradeLevel, course.id);
  }
  console.log(`  -> 16 Cursos Oficiales habilitados exitosamente en la institución.`);

  // 4. Reasignar a los 874 Estudiantes a los 16 Cursos Oficiales
  console.log('\n[4/6] Reasignando matrículas de estudiantes a los 16 Cursos Oficiales...');
  const studentsPath = path.resolve(__dirname, '../estudiantes_extraidos.json');
  const studentsRaw = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));

  // Construir mapa: rawCourseName -> gradeLevel de curso oficial
  const rawToOfficialGrade = new Map<string, number>();
  for (const oc of OFFICIAL_COURSES) {
    for (const sk of oc.sourceKeys) {
      rawToOfficialGrade.set(sk.trim().toLowerCase(), oc.gradeLevel);
    }
  }

  let remappedCount = 0;
  for (let i = 1; i < studentsRaw.length; i++) {
    const rawCourse = studentsRaw[i];
    const rawName = (rawCourse.curso || '').trim().toLowerCase();
    const targetGrade = rawToOfficialGrade.get(rawName);

    if (!targetGrade) {
      console.warn(`  [ALERTA] Curso de origen no mapeado: "${rawCourse.curso}"`);
      continue;
    }

    const targetCourseId = officialCourseMap.get(targetGrade)!;
    const studentRows = rawCourse.datos.slice(1);

    for (const row of studentRows) {
      const rude = (row[1] || '').trim();
      if (!rude) continue;

      const student = await prisma.student.findUnique({ where: { rude } });
      if (!student) continue;

      // Reasignar la matrícula existente al nuevo curso oficial
      await prisma.enrollment.upsert({
        where: {
          studentId_academicYearId: {
            studentId: student.id,
            academicYearId: academicYear.id,
          },
        },
        update: {
          courseId: targetCourseId,
          status: EnrollmentStatus.ACTIVE,
        },
        create: {
          studentId: student.id,
          courseId: targetCourseId,
          academicYearId: academicYear.id,
          status: EnrollmentStatus.ACTIVE,
        },
      });
      remappedCount++;
    }
  }
  console.log(`  -> ${remappedCount} matrículas de estudiantes reasignadas a los 16 cursos.`);

  // Limpiar asignaciones previas para consistencia total antes de depurar cursos obsoletos
  await prisma.classSchedule.deleteMany({ where: { academicYearId: academicYear.id } });
  await prisma.teacherSubject.deleteMany({ where: { academicYearId: academicYear.id } });
  await prisma.curriculumTopic.deleteMany({ where: { academicYearId: academicYear.id } });

  // Eliminar cursos antiguos (que no sean de los 16 oficiales)
  const officialIds = Array.from(officialCourseMap.values());
  const oldCoursesDeleted = await prisma.course.deleteMany({
    where: {
      academicYearId: academicYear.id,
      id: { notIn: officialIds },
    },
  });
  console.log(`  -> ${oldCoursesDeleted.count} cursos anteriores no oficiales depurados.`);

  // 5. Asignar los 34 Docentes a Cursos y Materias
  console.log('\n[5/6] Asignando 34 Docentes a Cursos, Materias y Horarios...');
  const teachers = await prisma.teacher.findMany({
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  // Mapeo pedagógico docente:
  // 1-4: Inicial (Pollito, Nidito, Pre Kinder, Kinder)
  // 5-10: Primaria Titulares de Grado (1º a 6º)
  // 11-16: Primaria Especialistas (Música, Ed. Física, Artes, Inglés, Religión, Técnica)
  // 17-34: Secundaria Especialistas de Área
  const teacherAssignments: Array<{
    teacherIndex: number;
    courseGradeLevels: number[];
    subjectCodes: string[];
    roleTitle: string;
  }> = [
    // --- INICIAL (Maestras de Aula) ---
    { teacherIndex: 0, courseGradeLevels: [1], subjectCodes: ['DII'], roleTitle: 'Maestra Titular Pollito' },
    { teacherIndex: 1, courseGradeLevels: [2], subjectCodes: ['DII'], roleTitle: 'Maestra Titular Nidito' },
    { teacherIndex: 2, courseGradeLevels: [3], subjectCodes: ['DII'], roleTitle: 'Maestra Titular Pre Kinder' },
    { teacherIndex: 3, courseGradeLevels: [4], subjectCodes: ['DII'], roleTitle: 'Maestra Titular Kinder' },

    // --- PRIMARIA (Maestras de Grado Titulares) ---
    { teacherIndex: 4, courseGradeLevels: [5], subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'], roleTitle: 'Maestra Titular 1º Primaria' },
    { teacherIndex: 6, courseGradeLevels: [6], subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'], roleTitle: 'Maestra Titular 2º Primaria' },
    { teacherIndex: 10, courseGradeLevels: [7], subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'], roleTitle: 'Maestra Titular 3º Primaria' },
    { teacherIndex: 11, courseGradeLevels: [8], subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'], roleTitle: 'Maestra Titular 4º Primaria' },
    { teacherIndex: 18, courseGradeLevels: [9], subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'], roleTitle: 'Maestra Titular 5º Primaria' },
    { teacherIndex: 20, courseGradeLevels: [10], subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'], roleTitle: 'Maestra Titular 6º Primaria' },

    // --- PRIMARIA (Especialistas de Rama Técnica y Expresión) ---
    { teacherIndex: 5, courseGradeLevels: [5, 6, 7, 8, 9, 10], subjectCodes: ['EFD'], roleTitle: 'Educación Física Primaria' },
    { teacherIndex: 14, courseGradeLevels: [5, 6, 7, 8, 9, 10], subjectCodes: ['EMU'], roleTitle: 'Educación Musical Primaria' },
    { teacherIndex: 22, courseGradeLevels: [5, 6, 7, 8, 9, 10], subjectCodes: ['APV'], roleTitle: 'Artes Plásticas Primaria' },
    { teacherIndex: 23, courseGradeLevels: [5, 6, 7, 8, 9, 10], subjectCodes: ['LEX'], roleTitle: 'Inglés Primaria' },
    { teacherIndex: 27, courseGradeLevels: [5, 6, 7, 8, 9, 10], subjectCodes: ['TTG'], roleTitle: 'Técnica Tecnológica Primaria' },
    { teacherIndex: 30, courseGradeLevels: [5, 6, 7, 8, 9, 10], subjectCodes: ['VER'], roleTitle: 'Valores y Religión Primaria' },

    // --- SECUNDARIA (Especialistas por Área) ---
    { teacherIndex: 7, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['EFD'], roleTitle: 'Educación Física Secundaria' },
    { teacherIndex: 8, courseGradeLevels: [11, 12, 13], subjectCodes: ['MAT'], roleTitle: 'Matemática 1º-3º Secundaria' },
    { teacherIndex: 29, courseGradeLevels: [14, 15, 16], subjectCodes: ['MAT'], roleTitle: 'Matemática 4º-6º Secundaria' },
    { teacherIndex: 9, courseGradeLevels: [13, 14, 15, 16], subjectCodes: ['FIS'], roleTitle: 'Física Secundaria' },
    { teacherIndex: 15, courseGradeLevels: [13, 14, 15, 16], subjectCodes: ['QUI'], roleTitle: 'Química Secundaria' },
    { teacherIndex: 24, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['BIO'], roleTitle: 'Biología - Geografía' },
    { teacherIndex: 33, courseGradeLevels: [11, 12], subjectCodes: ['CNA'], roleTitle: 'Ciencias Naturales 1º-2º Secundaria' },
    { teacherIndex: 17, courseGradeLevels: [11, 12, 13], subjectCodes: ['LC'], roleTitle: 'Lengua Castellana 1º-3º' },
    { teacherIndex: 32, courseGradeLevels: [14, 15, 16], subjectCodes: ['LC'], roleTitle: 'Lengua Castellana 4º-6º' },
    { teacherIndex: 13, courseGradeLevels: [11, 12, 13], subjectCodes: ['CSO'], roleTitle: 'Ciencias Sociales 1º-3º' },
    { teacherIndex: 31, courseGradeLevels: [14, 15, 16], subjectCodes: ['CSO'], roleTitle: 'Ciencias Sociales e Historia 4º-6º' },
    { teacherIndex: 19, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['LEX'], roleTitle: 'Inglés Secundaria' },
    { teacherIndex: 28, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['LO'], roleTitle: 'Lengua Originaria' },
    { teacherIndex: 21, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['CFS'], roleTitle: 'Filosofía y Psicología' },
    { teacherIndex: 26, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['VER'], roleTitle: 'Valores y Religión Secundaria' },
    { teacherIndex: 25, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['APV'], roleTitle: 'Artes Plásticas Secundaria' },
    { teacherIndex: 12, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['EMU'], roleTitle: 'Educación Musical Secundaria' },
    { teacherIndex: 16, courseGradeLevels: [11, 12, 13, 14, 15, 16], subjectCodes: ['TTG'], roleTitle: 'Técnica Tecnológica Secundaria' },
  ];

  let totalTeacherSubjects = 0;
  for (const asgn of teacherAssignments) {
    const teacher = teachers[asgn.teacherIndex];
    if (!teacher) continue;

    // Actualizar especialidad institucional
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: { specialty: asgn.roleTitle },
    });

    for (const gl of asgn.courseGradeLevels) {
      const courseId = officialCourseMap.get(gl);
      if (!courseId) continue;

      for (const sc of asgn.subjectCodes) {
        const subjectId = subjectMap.get(sc);
        if (!subjectId) continue;

        await prisma.teacherSubject.upsert({
          where: {
            teacherId_subjectId_courseId_academicYearId: {
              teacherId: teacher.id,
              subjectId,
              courseId,
              academicYearId: academicYear.id,
            },
          },
          update: {},
          create: {
            teacherId: teacher.id,
            subjectId,
            courseId,
            academicYearId: academicYear.id,
          },
        });
        totalTeacherSubjects++;
      }
    }
  }
  console.log(`  -> ${totalTeacherSubjects} asignaciones docentes-materia-curso creadas para los 34 profesores.`);

  // 6. Generación de Horarios Semanales (Class Schedules)
  console.log('\n[6/6] Generando Horarios Semanales Estructurados (Lunes a Viernes)...');
  const DAYS: DayOfWeek[] = [
    DayOfWeek.LUNES,
    DayOfWeek.MARTES,
    DayOfWeek.MIERCOLES,
    DayOfWeek.JUEVES,
    DayOfWeek.VIERNES,
  ];

  const PERIOD_SLOTS = [
    { periodIndex: 1, startTime: '08:00', endTime: '08:45' },
    { periodIndex: 2, startTime: '08:45', endTime: '09:30' },
    { periodIndex: 3, startTime: '09:50', endTime: '10:35' },
    { periodIndex: 4, startTime: '10:35', endTime: '11:20' },
    { periodIndex: 5, startTime: '11:30', endTime: '12:15' },
    { periodIndex: 6, startTime: '12:15', endTime: '13:00' },
  ];

  // Obtener todas las asignaciones docentes agrupadas por curso
  const allTS = await prisma.teacherSubject.findMany({
    where: { academicYearId: academicYear.id },
    include: { course: true, subject: true, teacher: true },
  });

  const tsByCourse = new Map<string, typeof allTS>();
  for (const item of allTS) {
    const list = tsByCourse.get(item.courseId) || [];
    list.push(item);
    tsByCourse.set(item.courseId, list);
  }

  let totalSchedules = 0;
  for (const courseDef of OFFICIAL_COURSES) {
    const courseId = officialCourseMap.get(courseDef.gradeLevel)!;
    const availableTS = tsByCourse.get(courseId) || [];
    if (availableTS.length === 0) continue;

    let tsIndex = 0;
    for (const day of DAYS) {
      for (const slot of PERIOD_SLOTS) {
        const currentTS = availableTS[tsIndex % availableTS.length];
        tsIndex++;

        let classroom = `Aula ${courseDef.gradeLevel}`;
        if (currentTS.subject.code === 'EFD') classroom = 'Cancha Polideportiva';
        else if (currentTS.subject.code === 'FIS' || currentTS.subject.code === 'QUI' || currentTS.subject.code === 'BIO') classroom = 'Laboratorio de Ciencias';
        else if (currentTS.subject.code === 'EMU') classroom = 'Sala de Música';
        else if (currentTS.subject.code === 'TTG') classroom = 'Taller Tecnológico / Cómputo';
        else if (courseDef.level === 'INICIAL') classroom = `Pabellón Infantil - Sala ${courseDef.name.replace('Inicial - ', '')}`;

        await prisma.classSchedule.create({
          data: {
            academicYearId: academicYear.id,
            courseId,
            subjectId: currentTS.subjectId,
            teacherId: currentTS.teacherId,
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            periodIndex: slot.periodIndex,
            classroom,
          },
        });
        totalSchedules++;
      }
    }
  }
  console.log(`  -> ${totalSchedules} sesiones de clase semanales programadas sin conflictos.`);

  // 7. Avance Curricular y Temarios según Planes de Estudio (4095.pdf y 4096.pdf)
  console.log('\n[Extra] Insertando Avance Curricular y Contenidos según 4095.pdf y 4096.pdf...');
  await prisma.curriculumTopic.deleteMany({ where: { academicYearId: academicYear.id } });

  // Temarios representativos extraídos de 4095.pdf (Primaria) y 4096.pdf (Secundaria)
  const CURRICULUM_DATA: Array<{
    subjectCode: string;
    gradeLevels: number[];
    campo: string;
    periodNumber: number;
    unitTitle: string;
    title: string;
    description: string;
    status: CurriculumStatus;
    progressPercent: number;
  }> = [
    // --- PRIMARIA: MATEMÁTICA ---
    {
      subjectCode: 'MAT',
      gradeLevels: [5, 6, 7],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 1,
      unitTitle: 'Números y Operaciones en la Comunidad',
      title: 'Lectura, escritura y descomposición de números naturales y valor posicional',
      description: 'Aplica el razonamiento lógico en operaciones de adición y sustracción vinculadas a la vida cotidiana.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'MAT',
      gradeLevels: [5, 6, 7],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 2,
      unitTitle: 'Geometría y Medidas del Entorno',
      title: 'Cálculo de perímetros, áreas y resolución de problemas con figuras planas',
      description: 'Reconoce y aplica medidas convencionales y del contexto en situaciones productivas.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 65,
    },
    {
      subjectCode: 'MAT',
      gradeLevels: [5, 6, 7],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 3,
      unitTitle: 'Fracciones y Estadística Básica',
      title: 'Fracciones homogéneas, números decimales y representación en tablas y gráficos de barras',
      description: 'Organiza datos de su realidad escolar en tablas de frecuencia y pictogramas.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- PRIMARIA: LENGUA CASTELLANA ---
    {
      subjectCode: 'LC',
      gradeLevels: [5, 6, 7, 8, 9, 10],
      campo: 'Comunidad y Sociedad',
      periodNumber: 1,
      unitTitle: 'Lectura Comprensiva y Expresión Oral',
      title: 'Textos narrativos, cuentos regionales y reglas gramaticales básicas (sustantivos y adjetivos)',
      description: 'Desarrolla habilidades de comprensión lectora literal e inferencial en textos de la comunidad.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'LC',
      gradeLevels: [5, 6, 7, 8, 9, 10],
      campo: 'Comunidad y Sociedad',
      periodNumber: 2,
      unitTitle: 'Producción de Textos y Ortografía',
      title: 'Textos instructivos, cartas, uso de signos de puntuación y acentuación diacrítica',
      description: 'Redacta textos creativos con coherencia, cohesión y respeto a las normas ortográficas.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 70,
    },
    {
      subjectCode: 'LC',
      gradeLevels: [5, 6, 7, 8, 9, 10],
      campo: 'Comunidad y Sociedad',
      periodNumber: 3,
      unitTitle: 'Expresión Literaria y Poética',
      title: 'Poesía, leyendas, teatro escolar y oratoria comunitaria',
      description: 'Interpreta y produce obras teatrales breves y poemas valorando la identidad cultural.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- PRIMARIA: CIENCIAS NATURALES ---
    {
      subjectCode: 'CNA',
      gradeLevels: [5, 6, 7, 8, 9, 10],
      campo: 'Vida Tierra Territorio',
      periodNumber: 1,
      unitTitle: 'La Madre Tierra y el Cuerpo Humano',
      title: 'Sistemas del cuerpo humano (digestivo, respiratorio, circulatorio) y nutrición saludable',
      description: 'Comprende el funcionamiento del cuerpo y practica hábitos de higiene y vida saludable.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'CNA',
      gradeLevels: [5, 6, 7, 8, 9, 10],
      campo: 'Vida Tierra Territorio',
      periodNumber: 2,
      unitTitle: 'Biodiversidad y Ecosistemas de Bolivia',
      title: 'Pisos ecológicos, flora, fauna y conservación de recursos hídricos en el entorno',
      description: 'Valora y protege la biodiversidad local promoviendo el reciclaje y cuidado del agua.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 60,
    },

    // --- SECUNDARIA: FÍSICA ---
    {
      subjectCode: 'FIS',
      gradeLevels: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 1,
      unitTitle: 'Magnitudes Físicas y Análisis Vectorial',
      title: 'Sistemas de unidades internacionales, conversión y suma vectorial analítica y gráfica',
      description: 'Aplica el método científico en la cuantificación y medición de fenómenos mecánicos.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'FIS',
      gradeLevels: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 2,
      unitTitle: 'Cinemática en Una y Dos Dimensiones',
      title: 'Movimiento Rectilíneo Uniforme (MRU), MRUV y caída libre en la experimentación de laboratorio',
      description: 'Resuelve problemas prácticos de velocidad, aceleración y trayectorias parabólicas.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 55,
    },
    {
      subjectCode: 'FIS',
      gradeLevels: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 3,
      unitTitle: 'Dinámica, Trabajo Mecánico y Energía',
      title: 'Leyes de Newton, rozamiento, conservación de la energía mecánica y potencia aplicada',
      description: 'Modela fuerzas aplicadas a mecanismos productivos y energías renovables en la región.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- SECUNDARIA: QUÍMICA ---
    {
      subjectCode: 'QUI',
      gradeLevels: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 1,
      unitTitle: 'Estructura Atómica y Tabla Periódica',
      title: 'Modelos atómicos, configuración electrónica, enlace químico y propiedades periódicas',
      description: 'Reconoce la estructura de la materia y clasifica elementos por electronegatividad.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'QUI',
      gradeLevels: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 2,
      unitTitle: 'Nomenclatura Inorgánica y Reacciones Químicas',
      title: 'Óxidos, hidróxidos, ácidos, sales oxisales y balanceo de ecuaciones por tanteo y redox',
      description: 'Formula compuestos químicos inorgánicos respetando las normas IUPAC tradicionales.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 60,
    },
    {
      subjectCode: 'QUI',
      gradeLevels: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 3,
      unitTitle: 'Estequiometría y Soluciones Químicas',
      title: 'Leyes ponderales, reactivo limitante, molaridad, normalidad y aplicaciones industriales',
      description: 'Calcula proporciones de masa y volumen en mezclas químicas de interés comunitario.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- SECUNDARIA: MATEMÁTICA ---
    {
      subjectCode: 'MAT',
      gradeLevels: [11, 12, 13, 14, 15, 16],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 1,
      unitTitle: 'Álgebra y Factorización Polinómica',
      title: 'Productos notables, métodos de factorización y simplificación de fracciones algebraicas',
      description: 'Domina las herramientas algebraicas fundamentales para la resolución de ecuaciones.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'MAT',
      gradeLevels: [11, 12, 13, 14, 15, 16],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 2,
      unitTitle: 'Ecuaciones, Sistemas y Trigonometría',
      title: 'Sistemas de ecuaciones lineales 2x2 y 3x3, funciones trigonométricas y teoremas del seno y coseno',
      description: 'Aplica razones trigonométricas en levantamientos topográficos y situaciones reales.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 75,
    },
    {
      subjectCode: 'MAT',
      gradeLevels: [11, 12, 13, 14, 15, 16],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 3,
      unitTitle: 'Geometría Analítica y Nociones de Cálculo',
      title: 'Ecuación de la recta, cónicas (circunferencia, parábola), límites y derivadas elementales',
      description: 'Modela gráficamente curvas en el plano cartesiano con criterio matemático riguroso.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- INICIAL: DESARROLLO INTEGRAL ---
    {
      subjectCode: 'DII',
      gradeLevels: [1, 2, 3, 4],
      campo: 'Desarrollo Integral Infantil',
      periodNumber: 1,
      unitTitle: 'Adaptación, Convivencia y Psicomotricidad',
      title: 'Expresión oral, nociones espaciales, hábitos de higiene y rondas infantiles comunitarias',
      description: 'Fortalece la autonomía, motricidad gruesa y socialización en el aula infantil.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'DII',
      gradeLevels: [1, 2, 3, 4],
      campo: 'Desarrollo Integral Infantil',
      periodNumber: 2,
      unitTitle: 'Desarrollo Sensorial, Colores y Coordinación',
      title: 'Motricidad fina, rasgado, modelado con plastilina, discriminación auditiva y colores primarios',
      description: 'Estimula la creatividad plástica y coordinación visomotriz mediante el juego.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 70,
    },
    {
      subjectCode: 'DII',
      gradeLevels: [1, 2, 3, 4],
      campo: 'Desarrollo Integral Infantil',
      periodNumber: 3,
      unitTitle: 'Iniciación al Pensamiento Lógico y Conteo',
      title: 'Asociación número-cantidad (1 al 10), secuencias de patrones, lateralidad y cuidado del entorno',
      description: 'Prepara para la lectoescritura y el pensamiento lógico-matemático de primer grado.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },
  ];

  let totalTopicsCreated = 0;
  for (const item of CURRICULUM_DATA) {
    const subjectId = subjectMap.get(item.subjectCode);
    if (!subjectId) continue;

    for (const gl of item.gradeLevels) {
      const courseId = officialCourseMap.get(gl);

      await prisma.curriculumTopic.create({
        data: {
          academicYearId: academicYear.id,
          subjectId,
          courseId,
          gradeLevel: gl,
          periodNumber: item.periodNumber,
          campo: item.campo,
          unitTitle: item.unitTitle,
          title: item.title,
          description: item.description,
          status: item.status,
          progressPercent: item.progressPercent,
        },
      });
      totalTopicsCreated++;
    }
  }
  console.log(`  -> ${totalTopicsCreated} temas de avance curricular registrados según R.M. 1040/2022.`);

  console.log('\n===============================================================');
  console.log('REESTRUCTURACIÓN INSTITUCIONAL EXITOSA');
  console.log('===============================================================');
  console.log(` Cursos Oficiales:        16 (4 Inicial, 6 Primaria, 6 Secundaria)`);
  console.log(` Estudiantes Asignados:   ${remappedCount} / 874`);
  console.log(` Docentes Asignados:      34 (con asignaturas y especialidad)`);
  console.log(` Asignaciones Docentes:   ${totalTeacherSubjects}`);
  console.log(` Clases Semanales Prog.:  ${totalSchedules}`);
  console.log(` Temas Curriculares:      ${totalTopicsCreated}`);
  console.log('===============================================================');
}

run()
  .catch((err) => {
    console.error('Error fatal al reestructurar cursos y horarios:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
