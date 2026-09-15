import { PrismaClient, UserRole } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function run() {
  console.log('===============================================================');
  console.log('ROLLBACK CONTROLADO DE DATOS EXTRAÍDOS (ESTUDIANTES Y DOCENTES)');
  console.log('===============================================================\n');

  console.log('Eliminando registros generados por la inyección...');

  // 1. Eliminar matrículas
  const deletedEnrollments = await prisma.enrollment.deleteMany({});
  console.log(` Matrículas eliminadas: ${deletedEnrollments.count}`);

  // 2. Eliminar estudiantes
  const deletedStudents = await prisma.student.deleteMany({});
  console.log(` Estudiantes eliminados: ${deletedStudents.count}`);

  // 3. Eliminar asignaciones docentes y docentes
  const deletedTeacherSubjects = await prisma.teacherSubject.deleteMany({});
  console.log(` Asignaciones docente-materia eliminadas: ${deletedTeacherSubjects.count}`);

  const deletedTeachers = await prisma.teacher.deleteMany({});
  console.log(` Docentes eliminados: ${deletedTeachers.count}`);

  // 4. Eliminar usuarios con rol TEACHER
  const deletedTeacherUsers = await prisma.user.deleteMany({
    where: { role: UserRole.TEACHER },
  });
  console.log(` Cuentas de usuario de docentes eliminadas: ${deletedTeacherUsers.count}`);

  // 5. Eliminar cursos (opcional, solo los creados)
  const deletedCourses = await prisma.course.deleteMany({});
  console.log(` Cursos eliminados: ${deletedCourses.count}`);

  console.log('\n Rollback finalizado. Los usuarios administradores y la estructura base se mantienen intactos.');
}

run()
  .catch((err) => {
    console.error('Error durante el rollback:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
