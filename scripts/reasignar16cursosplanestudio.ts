import { PrismaClient, Shift, EnrollmentStatus, DayOfWeek, CurriculumStatus } from '@prisma/client';
import { generateWeeklySchedule } from '../apps/api/src/modules/schedules/domain/services/generarhorariosemanal';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config();

const prisma = new PrismaClient();

// Grupos institucionales que se guardan dentro de los 14 grados formales
interface OfficialCourseDef {
  cohortIndex: number;
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
    cohortIndex: 1,
    name: 'Inicial - Pollito',
    section: 'A',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: ['Inicial en Familia Comunitaria - Primero C'],
  },
  {
    cohortIndex: 2,
    name: 'Inicial - Nidito',
    section: 'B',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: ['Inicial en Familia Comunitaria - Primero B'],
  },
  {
    cohortIndex: 3,
    name: 'Inicial - Pre Kinder',
    section: 'C',
    shift: Shift.MORNING,
    maxCapacity: 60,
    level: 'INICIAL',
    sourceKeys: ['Inicial en Familia Comunitaria - Primero A'],
  },
  {
    cohortIndex: 4,
    name: 'Inicial - Kinder',
    section: 'B',
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
    cohortIndex: 5,
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
    cohortIndex: 6,
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
    cohortIndex: 7,
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
    cohortIndex: 8,
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
    cohortIndex: 9,
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
    cohortIndex: 10,
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
    cohortIndex: 11,
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
    cohortIndex: 12,
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
    cohortIndex: 13,
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
    cohortIndex: 14,
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
    cohortIndex: 15,
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
    cohortIndex: 16,
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

function regularGradeLevelForCohort(cohortIndex: number): number {
  if (cohortIndex <= 3) return 1;
  if (cohortIndex === 4) return 2;
  return cohortIndex - 2;
}

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
  if (process.env.SIGCE_ALLOW_COURSE_REASSIGNMENT !== 'true') {
    throw new Error(
      'La reestructuración reemplaza asignaciones y cursos; define SIGCE_ALLOW_COURSE_REASSIGNMENT=true para autorizarla.',
    );
  }
  assertLocalDemoDatabaseTarget();

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
        OR: [{ code: s.code }, { name: s.name }],
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
  const officialCourseMap = new Map<number, string>(); // cohortIndex -> courseId
  const officialCourseEntries: Array<{ definition: OfficialCourseDef; courseId: string }> = [];

  for (const c of OFFICIAL_COURSES) {
    const gradeLevel = regularGradeLevelForCohort(c.cohortIndex);
    const course = await prisma.course.upsert({
      where: {
        academicYearId_gradeLevel_section_shift: {
          academicYearId: academicYear.id,
          gradeLevel,
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
        gradeLevel,
        section: c.section,
        shift: c.shift,
        maxCapacity: c.maxCapacity,
      },
    });
    officialCourseMap.set(c.cohortIndex, course.id);
    officialCourseEntries.push({ definition: c, courseId: course.id });
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
      rawToOfficialGrade.set(sk.trim().toLowerCase(), oc.cohortIndex);
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

  // Los índices de grupo preservan las asignaciones del conjunto institucional;
  // al persistir se convierten al grado formal y sección correspondientes.
  const teacherAssignments: Array<{
    teacherIndex: number;
    cohortIndexes: number[];
    subjectCodes: string[];
    roleTitle: string;
  }> = [
    // --- INICIAL (Maestras de Aula) ---
    {
      teacherIndex: 0,
      cohortIndexes: [1],
      subjectCodes: ['DII'],
      roleTitle: 'Maestra Titular Pollito',
    },
    {
      teacherIndex: 1,
      cohortIndexes: [2],
      subjectCodes: ['DII'],
      roleTitle: 'Maestra Titular Nidito',
    },
    {
      teacherIndex: 2,
      cohortIndexes: [3],
      subjectCodes: ['DII'],
      roleTitle: 'Maestra Titular Pre Kinder',
    },
    {
      teacherIndex: 3,
      cohortIndexes: [4],
      subjectCodes: ['DII'],
      roleTitle: 'Maestra Titular Kinder',
    },

    // --- PRIMARIA (Maestras de Grado Titulares) ---
    {
      teacherIndex: 4,
      cohortIndexes: [5],
      subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'],
      roleTitle: 'Maestra Titular 1º Primaria',
    },
    {
      teacherIndex: 6,
      cohortIndexes: [6],
      subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'],
      roleTitle: 'Maestra Titular 2º Primaria',
    },
    {
      teacherIndex: 10,
      cohortIndexes: [7],
      subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'],
      roleTitle: 'Maestra Titular 3º Primaria',
    },
    {
      teacherIndex: 11,
      cohortIndexes: [8],
      subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'],
      roleTitle: 'Maestra Titular 4º Primaria',
    },
    {
      teacherIndex: 18,
      cohortIndexes: [9],
      subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'],
      roleTitle: 'Maestra Titular 5º Primaria',
    },
    {
      teacherIndex: 20,
      cohortIndexes: [10],
      subjectCodes: ['MAT', 'LC', 'CSO', 'CNA'],
      roleTitle: 'Maestra Titular 6º Primaria',
    },

    // --- PRIMARIA (Especialistas de Rama Técnica y Expresión) ---
    {
      teacherIndex: 5,
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      subjectCodes: ['EFD'],
      roleTitle: 'Educación Física Primaria',
    },
    {
      teacherIndex: 14,
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      subjectCodes: ['EMU'],
      roleTitle: 'Educación Musical Primaria',
    },
    {
      teacherIndex: 22,
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      subjectCodes: ['APV'],
      roleTitle: 'Artes Plásticas Primaria',
    },
    {
      teacherIndex: 23,
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      subjectCodes: ['LEX'],
      roleTitle: 'Inglés Primaria',
    },
    {
      teacherIndex: 27,
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      subjectCodes: ['TTG'],
      roleTitle: 'Técnica Tecnológica Primaria',
    },
    {
      teacherIndex: 30,
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      subjectCodes: ['VER'],
      roleTitle: 'Valores y Religión Primaria',
    },

    // --- SECUNDARIA (Especialistas por Área) ---
    {
      teacherIndex: 7,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['EFD'],
      roleTitle: 'Educación Física Secundaria',
    },
    {
      teacherIndex: 8,
      cohortIndexes: [11, 12, 13],
      subjectCodes: ['MAT'],
      roleTitle: 'Matemática 1º-3º Secundaria',
    },
    {
      teacherIndex: 29,
      cohortIndexes: [14, 15, 16],
      subjectCodes: ['MAT'],
      roleTitle: 'Matemática 4º-6º Secundaria',
    },
    {
      teacherIndex: 9,
      cohortIndexes: [13, 14, 15, 16],
      subjectCodes: ['FIS'],
      roleTitle: 'Física Secundaria',
    },
    {
      teacherIndex: 15,
      cohortIndexes: [13, 14, 15, 16],
      subjectCodes: ['QUI'],
      roleTitle: 'Química Secundaria',
    },
    {
      teacherIndex: 24,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['BIO'],
      roleTitle: 'Biología - Geografía',
    },
    {
      teacherIndex: 33,
      cohortIndexes: [11, 12],
      subjectCodes: ['CNA'],
      roleTitle: 'Ciencias Naturales 1º-2º Secundaria',
    },
    {
      teacherIndex: 17,
      cohortIndexes: [11, 12, 13],
      subjectCodes: ['LC'],
      roleTitle: 'Lengua Castellana 1º-3º',
    },
    {
      teacherIndex: 32,
      cohortIndexes: [14, 15, 16],
      subjectCodes: ['LC'],
      roleTitle: 'Lengua Castellana 4º-6º',
    },
    {
      teacherIndex: 13,
      cohortIndexes: [11, 12, 13],
      subjectCodes: ['CSO'],
      roleTitle: 'Ciencias Sociales 1º-3º',
    },
    {
      teacherIndex: 31,
      cohortIndexes: [14, 15, 16],
      subjectCodes: ['CSO'],
      roleTitle: 'Ciencias Sociales e Historia 4º-6º',
    },
    {
      teacherIndex: 19,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['LEX'],
      roleTitle: 'Inglés Secundaria',
    },
    {
      teacherIndex: 28,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['LO'],
      roleTitle: 'Lengua Originaria',
    },
    {
      teacherIndex: 21,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['CFS'],
      roleTitle: 'Filosofía y Psicología',
    },
    {
      teacherIndex: 26,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['VER'],
      roleTitle: 'Valores y Religión Secundaria',
    },
    {
      teacherIndex: 25,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['APV'],
      roleTitle: 'Artes Plásticas Secundaria',
    },
    {
      teacherIndex: 12,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['EMU'],
      roleTitle: 'Educación Musical Secundaria',
    },
    {
      teacherIndex: 16,
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      subjectCodes: ['TTG'],
      roleTitle: 'Técnica Tecnológica Secundaria',
    },
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

    for (const gl of asgn.cohortIndexes) {
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
  console.log(
    `  -> ${totalTeacherSubjects} asignaciones docentes-materia-curso creadas para los 34 profesores.`,
  );

  // 6. Generación de Horarios Semanales (Class Schedules)
  console.log('\n[6/6] Generando Horarios Semanales Estructurados (Lunes a Viernes)...');
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
  const generatedSchedules = [];
  const occupiedTeacherSlots: Array<{ teacherId: string; dayOfWeek: string; periodIndex: number }> =
    [];
  for (const { definition: courseDef, courseId } of officialCourseEntries) {
    const availableTS = tsByCourse.get(courseId) || [];
    if (availableTS.length === 0) continue;

    const regularGradeLevel = regularGradeLevelForCohort(courseDef.cohortIndex);
    const generated = generateWeeklySchedule(
      regularGradeLevel,
      courseDef.shift as Parameters<typeof generateWeeklySchedule>[1],
      availableTS.map((assignment) => ({
        subject: assignment.subject,
        teacher: assignment.teacher,
      })),
      occupiedTeacherSlots,
    );

    for (const slot of generated.slots) {
      const assignment = availableTS.find(
        (candidate) =>
          candidate.subjectId === slot.subjectId && candidate.teacherId === slot.teacherId,
      );
      if (!assignment)
        throw new Error('La generación produjo una asignación que no existe en el curso.');

      let classroom = `Aula ${courseDef.name}`;
      if (assignment.subject.code === 'EFD') classroom = 'Cancha Polideportiva';
      else if (['FIS', 'QUI', 'BIO'].includes(assignment.subject.code))
        classroom = 'Laboratorio de Ciencias';
      else if (assignment.subject.code === 'EMU') classroom = 'Sala de Música';
      else if (assignment.subject.code === 'TTG') classroom = 'Taller Tecnológico / Cómputo';
      else if (courseDef.level === 'INICIAL')
        classroom = `Pabellón Infantil - Sala ${courseDef.name.replace('Inicial - ', '')}`;

      generatedSchedules.push({
        academicYearId: academicYear.id,
        courseId,
        subjectId: slot.subjectId,
        teacherId: slot.teacherId,
        dayOfWeek: DayOfWeek[slot.dayOfWeek],
        startTime: slot.startTime,
        endTime: slot.endTime,
        periodIndex: slot.periodIndex,
        classroom,
      });
      occupiedTeacherSlots.push({
        teacherId: slot.teacherId,
        dayOfWeek: slot.dayOfWeek,
        periodIndex: slot.periodIndex,
      });
    }
  }
  await prisma.$transaction([
    prisma.classSchedule.deleteMany({ where: { academicYearId: academicYear.id } }),
    prisma.classSchedule.createMany({ data: generatedSchedules }),
  ]);
  totalSchedules = generatedSchedules.length;
  console.log(
    `  -> ${totalSchedules} sesiones de clase semanales programadas sin solapar docentes.`,
  );

  // 7. Avance Curricular y Temarios según Planes de Estudio (4095.pdf y 4096.pdf)
  console.log('\n[Extra] Insertando Avance Curricular y Contenidos según 4095.pdf y 4096.pdf...');
  await prisma.curriculumTopic.deleteMany({ where: { academicYearId: academicYear.id } });

  // Temarios representativos extraídos de 4095.pdf (Primaria) y 4096.pdf (Secundaria)
  const CURRICULUM_DATA: Array<{
    subjectCode: string;
    cohortIndexes: number[];
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
      cohortIndexes: [5, 6, 7],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 1,
      unitTitle: 'Números y Operaciones en la Comunidad',
      title: 'Lectura, escritura y descomposición de números naturales y valor posicional',
      description:
        'Aplica el razonamiento lógico en operaciones de adición y sustracción vinculadas a la vida cotidiana.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'MAT',
      cohortIndexes: [5, 6, 7],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 2,
      unitTitle: 'Geometría y Medidas del Entorno',
      title: 'Cálculo de perímetros, áreas y resolución de problemas con figuras planas',
      description:
        'Reconoce y aplica medidas convencionales y del contexto en situaciones productivas.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 65,
    },
    {
      subjectCode: 'MAT',
      cohortIndexes: [5, 6, 7],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 3,
      unitTitle: 'Fracciones y Estadística Básica',
      title:
        'Fracciones homogéneas, números decimales y representación en tablas y gráficos de barras',
      description: 'Organiza datos de su realidad escolar en tablas de frecuencia y pictogramas.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- PRIMARIA: LENGUA CASTELLANA ---
    {
      subjectCode: 'LC',
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      campo: 'Comunidad y Sociedad',
      periodNumber: 1,
      unitTitle: 'Lectura Comprensiva y Expresión Oral',
      title:
        'Textos narrativos, cuentos regionales y reglas gramaticales básicas (sustantivos y adjetivos)',
      description:
        'Desarrolla habilidades de comprensión lectora literal e inferencial en textos de la comunidad.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'LC',
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      campo: 'Comunidad y Sociedad',
      periodNumber: 2,
      unitTitle: 'Producción de Textos y Ortografía',
      title: 'Textos instructivos, cartas, uso de signos de puntuación y acentuación diacrítica',
      description:
        'Redacta textos creativos con coherencia, cohesión y respeto a las normas ortográficas.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 70,
    },
    {
      subjectCode: 'LC',
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      campo: 'Comunidad y Sociedad',
      periodNumber: 3,
      unitTitle: 'Expresión Literaria y Poética',
      title: 'Poesía, leyendas, teatro escolar y oratoria comunitaria',
      description:
        'Interpreta y produce obras teatrales breves y poemas valorando la identidad cultural.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- PRIMARIA: CIENCIAS NATURALES ---
    {
      subjectCode: 'CNA',
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      campo: 'Vida Tierra Territorio',
      periodNumber: 1,
      unitTitle: 'La Madre Tierra y el Cuerpo Humano',
      title:
        'Sistemas del cuerpo humano (digestivo, respiratorio, circulatorio) y nutrición saludable',
      description:
        'Comprende el funcionamiento del cuerpo y practica hábitos de higiene y vida saludable.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'CNA',
      cohortIndexes: [5, 6, 7, 8, 9, 10],
      campo: 'Vida Tierra Territorio',
      periodNumber: 2,
      unitTitle: 'Biodiversidad y Ecosistemas de Bolivia',
      title: 'Pisos ecológicos, flora, fauna y conservación de recursos hídricos en el entorno',
      description:
        'Valora y protege la biodiversidad local promoviendo el reciclaje y cuidado del agua.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 60,
    },

    // --- SECUNDARIA: FÍSICA ---
    {
      subjectCode: 'FIS',
      cohortIndexes: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 1,
      unitTitle: 'Magnitudes Físicas y Análisis Vectorial',
      title:
        'Sistemas de unidades internacionales, conversión y suma vectorial analítica y gráfica',
      description:
        'Aplica el método científico en la cuantificación y medición de fenómenos mecánicos.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'FIS',
      cohortIndexes: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 2,
      unitTitle: 'Cinemática en Una y Dos Dimensiones',
      title:
        'Movimiento Rectilíneo Uniforme (MRU), MRUV y caída libre en la experimentación de laboratorio',
      description:
        'Resuelve problemas prácticos de velocidad, aceleración y trayectorias parabólicas.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 55,
    },
    {
      subjectCode: 'FIS',
      cohortIndexes: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 3,
      unitTitle: 'Dinámica, Trabajo Mecánico y Energía',
      title: 'Leyes de Newton, rozamiento, conservación de la energía mecánica y potencia aplicada',
      description:
        'Modela fuerzas aplicadas a mecanismos productivos y energías renovables en la región.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- SECUNDARIA: QUÍMICA ---
    {
      subjectCode: 'QUI',
      cohortIndexes: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 1,
      unitTitle: 'Estructura Atómica y Tabla Periódica',
      title: 'Modelos atómicos, configuración electrónica, enlace químico y propiedades periódicas',
      description:
        'Reconoce la estructura de la materia y clasifica elementos por electronegatividad.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'QUI',
      cohortIndexes: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 2,
      unitTitle: 'Nomenclatura Inorgánica y Reacciones Químicas',
      title:
        'Óxidos, hidróxidos, ácidos, sales oxisales y balanceo de ecuaciones por tanteo y redox',
      description:
        'Formula compuestos químicos inorgánicos respetando las normas IUPAC tradicionales.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 60,
    },
    {
      subjectCode: 'QUI',
      cohortIndexes: [13, 14, 15, 16],
      campo: 'Vida Tierra Territorio',
      periodNumber: 3,
      unitTitle: 'Estequiometría y Soluciones Químicas',
      title:
        'Leyes ponderales, reactivo limitante, molaridad, normalidad y aplicaciones industriales',
      description:
        'Calcula proporciones de masa y volumen en mezclas químicas de interés comunitario.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- SECUNDARIA: MATEMÁTICA ---
    {
      subjectCode: 'MAT',
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 1,
      unitTitle: 'Álgebra y Factorización Polinómica',
      title:
        'Productos notables, métodos de factorización y simplificación de fracciones algebraicas',
      description:
        'Domina las herramientas algebraicas fundamentales para la resolución de ecuaciones.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'MAT',
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 2,
      unitTitle: 'Ecuaciones, Sistemas y Trigonometría',
      title:
        'Sistemas de ecuaciones lineales 2x2 y 3x3, funciones trigonométricas y teoremas del seno y coseno',
      description:
        'Aplica razones trigonométricas en levantamientos topográficos y situaciones reales.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 75,
    },
    {
      subjectCode: 'MAT',
      cohortIndexes: [11, 12, 13, 14, 15, 16],
      campo: 'Ciencia, Tecnología y Producción',
      periodNumber: 3,
      unitTitle: 'Geometría Analítica y Nociones de Cálculo',
      title:
        'Ecuación de la recta, cónicas (circunferencia, parábola), límites y derivadas elementales',
      description:
        'Modela gráficamente curvas en el plano cartesiano con criterio matemático riguroso.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },

    // --- INICIAL: DESARROLLO INTEGRAL ---
    {
      subjectCode: 'DII',
      cohortIndexes: [1, 2, 3, 4],
      campo: 'Desarrollo Integral Infantil',
      periodNumber: 1,
      unitTitle: 'Adaptación, Convivencia y Psicomotricidad',
      title:
        'Expresión oral, nociones espaciales, hábitos de higiene y rondas infantiles comunitarias',
      description: 'Fortalece la autonomía, motricidad gruesa y socialización en el aula infantil.',
      status: CurriculumStatus.COMPLETADO,
      progressPercent: 100,
    },
    {
      subjectCode: 'DII',
      cohortIndexes: [1, 2, 3, 4],
      campo: 'Desarrollo Integral Infantil',
      periodNumber: 2,
      unitTitle: 'Desarrollo Sensorial, Colores y Coordinación',
      title:
        'Motricidad fina, rasgado, modelado con plastilina, discriminación auditiva y colores primarios',
      description: 'Estimula la creatividad plástica y coordinación visomotriz mediante el juego.',
      status: CurriculumStatus.EN_DESARROLLO,
      progressPercent: 70,
    },
    {
      subjectCode: 'DII',
      cohortIndexes: [1, 2, 3, 4],
      campo: 'Desarrollo Integral Infantil',
      periodNumber: 3,
      unitTitle: 'Iniciación al Pensamiento Lógico y Conteo',
      title:
        'Asociación número-cantidad (1 al 10), secuencias de patrones, lateralidad y cuidado del entorno',
      description:
        'Prepara para la lectoescritura y el pensamiento lógico-matemático de primer grado.',
      status: CurriculumStatus.PLANIFICADO,
      progressPercent: 0,
    },
  ];

  let totalTopicsCreated = 0;
  for (const item of CURRICULUM_DATA) {
    const subjectId = subjectMap.get(item.subjectCode);
    if (!subjectId) continue;

    for (const gl of item.cohortIndexes) {
      const courseId = officialCourseMap.get(gl);
      const gradeLevel = regularGradeLevelForCohort(gl);

      await prisma.curriculumTopic.create({
        data: {
          academicYearId: academicYear.id,
          subjectId,
          courseId,
          gradeLevel,
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
  console.log(
    `  -> ${totalTopicsCreated} temas de avance curricular registrados según R.M. 1040/2022.`,
  );

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
