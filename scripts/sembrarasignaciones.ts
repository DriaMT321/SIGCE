import { PrismaClient, AssignmentType, AssignmentStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  if (process.env.SIGCE_ALLOW_SAMPLE_ASSIGNMENT_SEED !== 'true') {
    throw new Error(
      'La carga crea tareas de muestra; define SIGCE_ALLOW_SAMPLE_ASSIGNMENT_SEED=true para autorizarla.',
    );
  }
  assertLocalDemoDatabaseTarget();

  console.log('Seeding sample assignments...');

  // Get active courses
  const courses = await prisma.course.findMany({
    include: {
      teacherSubjects: {
        include: {
          teacher: true,
          subject: true,
        },
      },
    },
    take: 5,
  });

  if (courses.length === 0) {
    console.log('No courses found.');
    return;
  }

  let createdCount = 0;

  for (const course of courses) {
    for (const ts of course.teacherSubjects.slice(0, 3)) {
      // Create 1 Tarea
      const dueDateTarea = new Date();
      dueDateTarea.setDate(dueDateTarea.getDate() + 3);
      dueDateTarea.setHours(18, 0, 0, 0);

      await prisma.assignment.create({
        data: {
          title: `Tarea: Ejercicios de Aplicación - ${ts.subject.name}`,
          type: AssignmentType.TAREA,
          description: `Resolver los ejercicios del 1 al 15 de la página 42 del libro de texto. Presentar en hojas membretadas con procedimientos claros y ordenados.`,
          dueDate: dueDateTarea,
          maxScore: 35,
          status: AssignmentStatus.PENDIENTE,
          courseId: course.id,
          subjectId: ts.subject.id,
          teacherId: ts.teacher.id,
        },
      });
      createdCount++;

      // Create 1 Examen
      const dueDateExamen = new Date();
      dueDateExamen.setDate(dueDateExamen.getDate() + 7);
      dueDateExamen.setHours(8, 30, 0, 0);

      await prisma.assignment.create({
        data: {
          title: `Examen Parcial: Unidades 1 y 2 - ${ts.subject.name}`,
          type: AssignmentType.EXAMEN,
          description: `Evaluación escrita individual sobre los contenidos avanzados durante las semanas 1 a 4. Material permitido: bolígrafo azul o negro y regla. Prohibido uso de celulares.`,
          dueDate: dueDateExamen,
          maxScore: 100,
          status: AssignmentStatus.PENDIENTE,
          courseId: course.id,
          subjectId: ts.subject.id,
          teacherId: ts.teacher.id,
        },
      });
      createdCount++;
    }
  }

  console.log(`Successfully created ${createdCount} sample assignments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
