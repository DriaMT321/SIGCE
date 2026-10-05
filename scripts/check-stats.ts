import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const roles = await prisma.user.groupBy({ by: ['role'], _count: { id: true } });
  const teachers = await prisma.teacher.count();
  const students = await prisma.student.count();
  const parents = await prisma.parent.count();
  const courses = await prisma.course.count();
  const subjects = await prisma.subject.count();
  const enrollments = await prisma.enrollment.count();
  const grades = await prisma.grade.count();
  const attendances = await prisma.attendance.count();
  const academicYears = await prisma.academicYear.count();
  const periods = await prisma.academicPeriod.count();

  console.log('--- RECUENTO DE LA BASE DE DATOS ACTUAL ---');
  console.log(`Usuarios totales: ${users}`);
  console.log('Por roles:', roles.map(r => `${r.role}: ${r._count.id}`).join(', '));
  console.log(`Docentes (perfiles): ${teachers}`);
  console.log(`Estudiantes (perfiles): ${students}`);
  console.log(`Padres/Tutores: ${parents}`);
  console.log(`Cursos: ${courses}`);
  console.log(`Materias: ${subjects}`);
  console.log(`Matrículas (Enrollments): ${enrollments}`);
  console.log(`Calificaciones registradas: ${grades}`);
  console.log(`Asistencias registradas: ${attendances}`);
  console.log(`Años académicos: ${academicYears}`);
  console.log(`Periodos/Trimestres: ${periods}`);
}

main().finally(() => prisma.$disconnect());
