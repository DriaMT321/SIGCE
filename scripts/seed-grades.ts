import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generador pseudo-aleatorio determinista basado en el RUDE
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function seedGrades() {
  console.log('===============================================================');
  console.log('GENERANDO CALIFICACIONES REALISTAS PARA GESTIÓN 2026');
  console.log('===============================================================\n');

  const academicYear = await prisma.academicYear.findUnique({ where: { year: 2026 } });
  if (!academicYear) throw new Error('Gestión 2026 no encontrada');

  const period1 = await prisma.academicPeriod.findFirst({
    where: { academicYearId: academicYear.id, number: 1 },
  });
  if (!period1) throw new Error('1er Trimestre no encontrado');

  const subjects = await prisma.subject.findMany();
  if (subjects.length === 0) throw new Error('No hay materias registradas');

  const enrollments = await prisma.enrollment.findMany({
    where: { academicYearId: academicYear.id },
    include: { student: true, course: true },
  });

  console.log(`Matrículas encontradas: ${enrollments.length}`);
  console.log(`Materias disponibles: ${subjects.length}`);
  console.log(`Periodo: ${period1.name}`);

  // Generar notas para cada estudiante en cada materia del 1er Trimestre
  const gradesToCreate: Array<{
    enrollmentId: string;
    studentId: string;
    subjectId: string;
    periodId: string;
    value: number;
    remarks: string;
  }> = [];

  for (const enr of enrollments) {
    const seedVal = hashString(enr.student.rude + enr.courseId);

    // Asignar entre 4 y 7 materias según el nivel
    const subjectsToGrade = enr.course.name.includes('Inicial')
      ? subjects.slice(0, 3)
      : enr.course.name.includes('Primaria')
      ? subjects.slice(0, 5)
      : subjects;

    subjectsToGrade.forEach((subj, idx) => {
      // Distribución realista: 85% aprobados (55-98), 10% destacados (90-100), 5% en riesgo (42-50)
      const variant = (seedVal + idx * 17) % 100;
      let val: number;
      let remark = 'Desarrollo Óptimo';

      if (variant < 5) {
        val = 45 + (variant % 6); // 45..50 (En desarrollo / apoyo)
        remark = 'Requiere Apoyo Pedagógico';
      } else if (variant < 25) {
        val = 55 + (variant % 14); // 55..68 (Aceptable)
        remark = 'Desarrollo Aceptable';
      } else if (variant < 75) {
        val = 70 + (variant % 18); // 70..87 (Óptimo)
        remark = 'Desarrollo Óptimo';
      } else {
        val = 88 + (variant % 13); // 88..100 (Pleno)
        remark = 'Desarrollo Pleno';
      }

      gradesToCreate.push({
        enrollmentId: enr.id,
        studentId: enr.studentId,
        subjectId: subj.id,
        periodId: period1.id,
        value: val,
        remarks: remark,
      });
    });
  }

  console.log(`\nInsertando ${gradesToCreate.length} calificaciones en la base de datos...`);
  
  // Limpiar notas previas del periodo si hubiese
  await prisma.grade.deleteMany({ where: { periodId: period1.id } });

  // Inserción en bloques (batch)
  const chunkSize = 500;
  for (let i = 0; i < gradesToCreate.length; i += chunkSize) {
    const chunk = gradesToCreate.slice(i, i + chunkSize);
    await prisma.grade.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  const totalCreated = await prisma.grade.count({ where: { periodId: period1.id } });
  console.log(`\n✅ ¡${totalCreated} calificaciones registradas exitosamente para Gestión 2026!`);

  // Calcular métricas
  const avg = await prisma.grade.aggregate({
    _avg: { value: true },
    where: { periodId: period1.id },
  });
  console.log(`Promedio institucional del 1er Trimestre: ${avg._avg.value?.toFixed(1)} / 100 pts`);
}

if (require.main === module) {
  seedGrades()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
