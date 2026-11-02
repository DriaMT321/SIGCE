import { PrismaClient, UserRole, Shift, EnrollmentStatus, Gender } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';
import {
  generarcorreodocentedemo,
  generarhashcontrasenaaleatoria,
  obtenerestadoimportado,
  obtenergeneroimportado,
  parsearfechanacimiento,
} from './datosimportacion';

dotenv.config();

const prisma = new PrismaClient();

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

async function run() {
  if (process.env.SIGCE_ALLOW_EXTRACTED_DATA_INJECTION !== 'true') {
    throw new Error(
      'La inyección modifica la base de datos; define SIGCE_ALLOW_EXTRACTED_DATA_INJECTION=true para autorizarla.',
    );
  }
  assertLocalDemoDatabaseTarget();

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

  console.log(
    `[1/5] Gestión Académica activa identificada: "${academicYear.name}" (ID: ${academicYear.id})`,
  );

  // 2. Cargar archivos JSON
  const teachersPath = path.resolve(__dirname, '../profesores_extraidos.json');
  const studentsPath = path.resolve(__dirname, '../estudiantes_extraidos.json');

  if (!fs.existsSync(teachersPath) || !fs.existsSync(studentsPath)) {
    throw new Error('No se encontraron los archivos JSON extraídos en el directorio raíz.');
  }

  const teachersRaw = JSON.parse(fs.readFileSync(teachersPath, 'utf-8'));
  const studentsRaw = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));

  for (const curso of studentsRaw.slice(1)) {
    for (const fila of curso.datos.slice(1)) {
      if ((fila[1] || '').trim()) {
        parsearfechanacimiento(fila[6]);
        obtenerestadoimportado(curso.datos[0] ?? [], fila);
      }
    }
  }

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
    const email = generarcorreodocentedemo(nombres, lastName, ci);

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
        passwordHash: generarhashcontrasenaaleatoria(),
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
  console.log(
    `  -> ${teachersProcessed} docentes y cuentas de usuario creados/actualizados con éxito.`,
  );

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
      const birthDate = parsearfechanacimiento(fechaNacStr);
      const gender = obtenergeneroimportado(rawCourse.datos[0] ?? [], row) as Gender;
      const enrollmentStatus = obtenerestadoimportado(
        rawCourse.datos[0] ?? [],
        row,
      ) as EnrollmentStatus;

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
          status: enrollmentStatus,
        },
        create: {
          studentId: student.id,
          courseId,
          academicYearId: academicYear.id,
          status: enrollmentStatus,
        },
      });
      totalEnrollments++;
    }
  }

  const elapsedSecs = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n[5/5] Resumen de Inyección Finalizada:');
  console.log('---------------------------------------------------------------');
  console.log(` Cursos Registrados:     ${coursesCreated}`);
  console.log(` Docentes Registrados:   ${teachersProcessed} (correos de muestra Gmail/Hotmail)`);
  console.log(` Estudiantes Registrados:${totalStudents}`);
  console.log(` Matrículas Generadas:   ${totalEnrollments} (Estado de origen conservado)`);
  console.log(` Tiempo transcurrido:    ${elapsedSecs} segundos`);
  console.log('---------------------------------------------------------------');
  console.log(
    'Las cuentas nuevas tienen claves aleatorias no divulgadas; un administrador debe asignar sus claves.',
  );
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
