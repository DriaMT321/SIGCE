import { PrismaClient, UserRole, Shift, EnrollmentStatus, Gender } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';

dotenv.config();

const prisma = new PrismaClient();

// Lista de nombres femeninos comunes que no terminan en 'A'
const KNOWN_FEMALE_FIRST_NAMES = new Set([
  'ANALIA', 'ANALY', 'BELEN', 'CARMEN', 'CRISTAL', 'ESTHER', 'GISSEL', 'GRISEL',
  'HEIDY', 'ITZEL', 'KAREN', 'LESLIE', 'LIZBETH', 'MARIBEL', 'MERCEDES', 'MIRIAM',
  'NOEMI', 'PILAR', 'RAQUEL', 'ROSARIO', 'RUTH', 'SHIRLEY', 'YOSELIN', 'YASMIN',
  'ABIGAIL', 'AILIN', 'NAZARETH', 'AYELEN', 'BETZABE', 'SARAHI', 'YOMARA', 'NAYELI'
]);

function inferGender(fullName: string): Gender {
  const firstName = (fullName || '').trim().split(' ')[0].toUpperCase();
  if (KNOWN_FEMALE_FIRST_NAMES.has(firstName) || firstName.endsWith('A')) {
    return Gender.FEMALE;
  }
  return Gender.MALE;
}

function parseCourseMeta(courseName: string): {
  name: string;
  gradeLevel: number;
  section: string;
  shift: Shift;
  maxCapacity: number;
} {
  const parts = courseName.split('-');
  const level = parts[0].trim();
  const rest = parts[1].trim(); // Ej: "Primero A", "Cuarto C"
  const match = rest.match(/^(Primero|Segundo|Tercero|Cuarto|Quinto|Sexto)\s+([A-Z])$/i);

  if (!match) {
    throw new Error(`Formato de curso no reconocido: ${courseName}`);
  }

  const gradeName = match[1].toLowerCase();
  const section = match[2].toUpperCase();

  const mapPrimSec: Record<string, number> = {
    primero: 1,
    segundo: 2,
    tercero: 3,
    cuarto: 4,
    quinto: 5,
    sexto: 6,
  };

  let gradeLevel = 1;
  if (level.includes('Inicial')) {
    gradeLevel = gradeName === 'primero' ? 1 : 2;
  } else if (level.includes('Primaria')) {
    gradeLevel = 2 + mapPrimSec[gradeName]; // 3..8
  } else if (level.includes('Secundaria')) {
    gradeLevel = 8 + mapPrimSec[gradeName]; // 9..14
  }

  return {
    name: courseName.trim(),
    gradeLevel,
    section,
    shift: Shift.MORNING,
    maxCapacity: 45,
  };
}

function parseBirthDate(dateStr: string): Date {
  const parts = (dateStr || '').trim().split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day, 12, 0, 0));
  }
  return new Date();
}

async function run() {
  console.log('===============================================================');
  console.log('INICIANDO INYECCIÓN DE DATOS EXTRAÍDOS (DOCENTES Y ESTUDIANTES)');
  console.log('===============================================================\n');

  const startTime = Date.now();

  // 1. Obtener Gestión Académica Activa (2026)
  const currentYear = 2026;
  const academicYear = await prisma.academicYear.findUnique({
    where: { year: currentYear },
  });

  if (!academicYear) {
    throw new Error(`No se encontró la Gestión Académica ${currentYear} en la base de datos.`);
  }

  console.log(`[1/5] Gestión Académica activa identificada: "${academicYear.name}" (ID: ${academicYear.id})`);

  // 2. Cargar archivos JSON
  const teachersPath = path.resolve(__dirname, '../profesores_extraidos.json');
  const studentsPath = path.resolve(__dirname, '../estudiantes_extraidos.json');

  if (!fs.existsSync(teachersPath) || !fs.existsSync(studentsPath)) {
    throw new Error('No se encontraron los archivos JSON extraídos en el directorio raíz.');
  }

  const teachersRaw = JSON.parse(fs.readFileSync(teachersPath, 'utf-8'));
  const studentsRaw = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));

  // 3. Procesar y registrar Cursos
  console.log('\n[2/5] Procesando y sincronizando Cursos...');
  const courseMap = new Map<string, string>(); // courseName -> courseId
  let coursesCreated = 0;

  for (let i = 1; i < studentsRaw.length; i++) {
    const rawCourse = studentsRaw[i];
    const courseMeta = parseCourseMeta(rawCourse.curso);

    const course = await prisma.course.upsert({
      where: {
        academicYearId_gradeLevel_section_shift: {
          academicYearId: academicYear.id,
          gradeLevel: courseMeta.gradeLevel,
          section: courseMeta.section,
          shift: courseMeta.shift,
        },
      },
      update: {
        name: courseMeta.name,
        maxCapacity: courseMeta.maxCapacity,
      },
      create: {
        academicYearId: academicYear.id,
        name: courseMeta.name,
        gradeLevel: courseMeta.gradeLevel,
        section: courseMeta.section,
        shift: courseMeta.shift,
        maxCapacity: courseMeta.maxCapacity,
      },
    });

    courseMap.set(courseMeta.name, course.id);
    coursesCreated++;
  }
  console.log(`  -> ${coursesCreated} cursos verificados/creados correctamente en Gestión 2026.`);

  // 4. Procesar y registrar Docentes
  console.log('\n[3/5] Procesando y registrando Docentes...');
  const teacherRows = teachersRaw[0]?.datos?.slice(1) || [];
  let teachersProcessed = 0;
  const defaultTeacherPassword = 'Docente2026!';
  const teacherPasswordHash = await bcrypt.hash(defaultTeacherPassword, 10);

  for (const row of teacherRows) {
    // ['1', '3918213', 'ALVAREZ', 'ROJAS', 'MAURA MARILUZ', 'MAESTRA/O', ...]
    const itemNo = (row[0] || '').trim();
    const ci = (row[1] || '').trim();
    const paterno = (row[2] || '').trim();
    const materno = (row[3] || '').trim();
    const nombres = (row[4] || '').trim();
    const cargo = (row[5] || 'MAESTRA/O').trim();

    if (!ci || !nombres) continue;

    const lastName = [paterno, materno].filter(Boolean).join(' ') || 'SIN APELLIDO';
    const email = `docente.${ci}@sigce.edu.bo`.toLowerCase();

    // Crear/actualizar usuario docente
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: nombres,
        lastName,
        role: UserRole.TEACHER,
        isActive: true,
      },
      create: {
        email,
        passwordHash: teacherPasswordHash,
        firstName: nombres,
        lastName,
        role: UserRole.TEACHER,
        isActive: true,
      },
    });

    // Crear/actualizar registro de Teacher
    await prisma.teacher.upsert({
      where: { ci },
      update: {
        firstName: nombres,
        lastName,
        specialty: cargo,
        itemNumber: itemNo,
        userId: user.id,
      },
      create: {
        userId: user.id,
        ci,
        firstName: nombres,
        lastName,
        specialty: cargo,
        itemNumber: itemNo,
      },
    });

    teachersProcessed++;
  }
  console.log(`  -> ${teachersProcessed} docentes y cuentas de usuario creados/actualizados con éxito.`);

  // 5. Procesar Estudiantes y Matrículas
  console.log('\n[4/5] Procesando Estudiantes y Matrículas por Curso...');
  let totalStudents = 0;
  let totalEnrollments = 0;

  for (let i = 1; i < studentsRaw.length; i++) {
    const rawCourse = studentsRaw[i];
    const courseMeta = parseCourseMeta(rawCourse.curso);
    const courseId = courseMap.get(courseMeta.name);

    if (!courseId) {
      console.warn(`  [ADVERTENCIA] No se encontró el curso: ${courseMeta.name}`);
      continue;
    }

    const studentRows = rawCourse.datos.slice(1);
    for (const row of studentRows) {
      // ['#', 'CÓDIGO RUDE', 'C.I.', 'PATERNO', 'MATERNO', 'NOMBRE(S)', 'FECHA NAC.', 'ESTADO DE MATRÍCULA', 'Obs. SEGIP']
      const rude = (row[1] || '').trim();
      let ci = (row[2] || '').trim();
      const paterno = (row[3] || '').trim();
      const materno = (row[4] || '').trim();
      const nombres = (row[5] || '').trim();
      const fechaNacStr = (row[6] || '').trim();

      if (!rude) continue;

      // Si no tiene CI provisto por SEGIP, asignar provisorio único basado en su RUDE
      if (!ci) {
        ci = `S/CI-${rude}`;
      }

      const lastName = [paterno, materno].filter(Boolean).join(' ') || 'SIN APELLIDO';
      const birthDate = parseBirthDate(fechaNacStr);
      const gender = inferGender(nombres);

      // Crear o actualizar Estudiante
      const student = await prisma.student.upsert({
        where: { rude },
        update: {
          ci,
          firstName: nombres,
          lastName,
          birthDate,
          gender,
          isActive: true,
        },
        create: {
          rude,
          ci,
          firstName: nombres,
          lastName,
          birthDate,
          gender,
          isActive: true,
        },
      });
      totalStudents++;

      // Crear o actualizar Matrícula en el curso para la gestión 2026
      await prisma.enrollment.upsert({
        where: {
          studentId_academicYearId: {
            studentId: student.id,
            academicYearId: academicYear.id,
          },
        },
        update: {
          courseId,
          status: EnrollmentStatus.ACTIVE,
        },
        create: {
          studentId: student.id,
          courseId,
          academicYearId: academicYear.id,
          status: EnrollmentStatus.ACTIVE,
        },
      });
      totalEnrollments++;
    }
  }

  const elapsedSecs = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n[5/5] Resumen de Inyección Finalizada:');
  console.log('---------------------------------------------------------------');
  console.log(` Cursos Registrados:     ${coursesCreated}`);
  console.log(` Docentes Registrados:   ${teachersProcessed} (Cuentas activas @sigce.edu.bo)`);
  console.log(` Estudiantes Registrados:${totalStudents}`);
  console.log(` Matrículas Generadas:   ${totalEnrollments} (Estado: ACTIVE)`);
  console.log(` Tiempo transcurrido:    ${elapsedSecs} segundos`);
  console.log('---------------------------------------------------------------');
  console.log(' Inyección completada exitosamente sin inconsistencias.');
}

run()
  .catch((err) => {
    console.error('\n Error fatal en la inyección de datos:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
