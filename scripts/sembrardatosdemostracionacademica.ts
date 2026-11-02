import {
  AnnouncementScope,
  AnnouncementUrgency,
  AssignmentStatus,
  AssignmentType,
  PrismaClient,
} from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index++) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function demonstrationGrade(studentRude: string, subjectId: string, periodNumber: number): number {
  const seed = hash(`${studentRude}:${subjectId}`);
  const band = seed % 100;
  let score: number;

  if (band < 7) score = 44 + (seed % 7);
  else if (band < 23) score = 51 + (seed % 15);
  else if (band < 83) score = 66 + (seed % 21);
  else score = 87 + (seed % 14);

  const trimesterAdjustment = periodNumber === 2 ? ((hash(`${seed}:progress`) % 9) - 4) : 0;
  return Math.max(1, Math.min(100, score + trimesterAdjustment));
}

function weeklyPeriods(subjectCode: string): number {
  if (/^(MAT|MAT-SEC|LC|LEN-SEC)$/.test(subjectCode)) return 5;
  if (/^(CNA|BIO-SEC|FIS-SEC|QUI-SEC|CSO|HIS-SEC)$/.test(subjectCode)) return 3;
  return 2;
}

async function main(): Promise<void> {
  assertLocalDemoDatabaseTarget();

  const academicYear = await prisma.academicYear.findUnique({
    where: { year: 2026 },
    select: { id: true, name: true },
  });
  if (!academicYear) throw new Error('No se encontró la gestión académica 2026.');

  const periods = await prisma.academicPeriod.findMany({
    where: { academicYearId: academicYear.id, number: { in: [1, 2] } },
    select: { id: true, number: true, name: true },
  });
  const periodByNumber = new Map(periods.map((period) => [period.number, period]));
  const firstTrimester = periodByNumber.get(1);
  const secondTrimester = periodByNumber.get(2);
  if (!firstTrimester || !secondTrimester) {
    throw new Error('Se necesitan los periodos existentes del primer y segundo trimestre.');
  }

  const courses = await prisma.course.findMany({
    where: { academicYearId: academicYear.id },
    include: {
      curriculumTopics: {
        where: { periodNumber: { in: [1, 2] } },
        select: { subjectId: true },
      },
      teacherSubjects: { select: { teacherId: true, subjectId: true } },
    },
    orderBy: [{ gradeLevel: 'asc' }, { section: 'asc' }],
  });
  const subjects = await prisma.subject.findMany({
    select: { id: true, name: true, code: true },
  });
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const teachers = await prisma.teacher.findMany({
    where: { deletedAt: null, user: { isActive: true, deletedAt: null } },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  const activeEnrollments = await prisma.enrollment.findMany({
    where: {
      academicYearId: academicYear.id,
      status: 'ACTIVE',
      student: { isActive: true, deletedAt: null },
    },
    select: { id: true, studentId: true, courseId: true, student: { select: { rude: true } } },
  });
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMINISTRATIVE', isActive: true, deletedAt: null },
    select: { id: true },
  });
  if (!teachers.length) throw new Error('No hay docentes activos para crear asignaciones de muestra.');
  if (!admin) throw new Error('No hay una cuenta administrativa activa para los comunicados de muestra.');

  const courseSubjects = new Map<string, string[]>();
  for (const course of courses) {
    courseSubjects.set(course.id, [...new Set(course.curriculumTopics.map((topic) => topic.subjectId))]);
  }

  const targetGradeKeys = new Set<string>();
  for (const enrollment of activeEnrollments) {
    for (const subjectId of courseSubjects.get(enrollment.courseId) ?? []) {
      targetGradeKeys.add(`${enrollment.studentId}:${subjectId}:${firstTrimester.id}`);
      targetGradeKeys.add(`${enrollment.studentId}:${subjectId}:${secondTrimester.id}`);
    }
  }
  const existingGrades = await prisma.grade.findMany({
    where: { periodId: { in: [firstTrimester.id, secondTrimester.id] } },
    select: { studentId: true, subjectId: true, periodId: true },
  });
  const existingGradeKeys = new Set(
    existingGrades.map((grade) => `${grade.studentId}:${grade.subjectId}:${grade.periodId}`),
  );
  const gradesToCreate: Array<{
    enrollmentId: string;
    studentId: string;
    subjectId: string;
    periodId: string;
    value: number;
    remarks: string;
  }> = [];

  for (const enrollment of activeEnrollments) {
    for (const subjectId of courseSubjects.get(enrollment.courseId) ?? []) {
      for (const period of [firstTrimester, secondTrimester]) {
        const key = `${enrollment.studentId}:${subjectId}:${period.id}`;
        if (existingGradeKeys.has(key)) continue;
        gradesToCreate.push({
          enrollmentId: enrollment.id,
          studentId: enrollment.studentId,
          subjectId,
          periodId: period.id,
          value: demonstrationGrade(enrollment.student.rude, subjectId, period.number),
          remarks: 'Muestra local de demostración',
        });
      }
    }
  }

  let assignmentsCreated = 0;
  const teacherByCourseSubject = new Map<string, string>();
  const teacherSubjectRows: Array<{
    teacherId: string;
    subjectId: string;
    courseId: string;
    academicYearId: string;
    weeklyPeriods: number;
  }> = [];
  let teacherIndex = 0;

  for (const course of courses) {
    const pairs = courseSubjects.get(course.id) ?? [];
    for (const subjectId of pairs) {
      const key = `${course.id}:${subjectId}`;
      const existingPair = course.teacherSubjects.find((row) => row.subjectId === subjectId);
      const subject = subjectById.get(subjectId);
      if (!subject) continue;

      let teacherId = existingPair?.teacherId;
      if (!teacherId) {
        teacherId = teachers[teacherIndex % teachers.length].id;
        teacherIndex++;
        teacherSubjectRows.push({
          teacherId,
          subjectId,
          courseId: course.id,
          academicYearId: academicYear.id,
          weeklyPeriods: weeklyPeriods(subject.code),
        });
      }
      teacherByCourseSubject.set(key, teacherId);
    }
  }

  if (teacherSubjectRows.length) {
    const result = await prisma.teacherSubject.createMany({ data: teacherSubjectRows, skipDuplicates: true });
    assignmentsCreated = result.count;
  }

  let activitiesCreated = 0;
  const activityDueDates = [new Date('2026-11-08T23:59:00-04:00'), new Date('2026-11-15T23:59:00-04:00')];
  for (const course of courses) {
    const courseSubjectIds = courseSubjects.get(course.id) ?? [];
    if (!courseSubjectIds.length) continue;
    const preferred = courseSubjectIds
      .map((id) => subjectById.get(id))
      .filter((subject): subject is NonNullable<typeof subject> => Boolean(subject))
      .sort((a, b) => {
        const priority = (code: string) => (/^(MAT|MAT-SEC|LC|LEN-SEC)$/.test(code) ? 0 : 1);
        return priority(a.code) - priority(b.code) || a.name.localeCompare(b.name, 'es');
      });
    const chosen = [preferred[0], preferred.find((subject) => subject.id !== preferred[0].id) ?? preferred[0]];
    const activitySpecs = [
      {
        title: `[Muestra local] Actividad de aplicación — ${chosen[0].name}`,
        type: AssignmentType.TAREA,
        dueDate: activityDueDates[0],
        maxScore: 35,
        description: 'Resolver una guía breve de aplicación de los contenidos trabajados y presentar el procedimiento en el cuaderno. Actividad creada para la demostración local.',
        subject: chosen[0],
      },
      {
        title: `[Muestra local] Evaluación de proceso — ${chosen[1].name}`,
        type: AssignmentType.EXAMEN,
        dueDate: activityDueDates[1],
        maxScore: 100,
        description: 'Evaluación individual de los contenidos del trimestre, con ejercicios de comprensión y aplicación. Registro creado para la demostración local.',
        subject: chosen[1],
      },
    ];

    for (const spec of activitySpecs) {
      const existing = await prisma.assignment.findFirst({
        where: { title: spec.title, courseId: course.id, deletedAt: null },
        select: { id: true },
      });
      if (existing) continue;
      const teacherId = teacherByCourseSubject.get(`${course.id}:${spec.subject.id}`);
      if (!teacherId) continue;
      await prisma.assignment.create({
        data: {
          title: spec.title,
          type: spec.type,
          dueDate: spec.dueDate,
          maxScore: spec.maxScore,
          status: AssignmentStatus.PENDIENTE,
          description: spec.description,
          courseId: course.id,
          subjectId: spec.subject.id,
          teacherId,
        },
      });
      activitiesCreated++;
    }
  }

  const notices = [
    {
      title: '[Muestra local] Seguimiento de actividades del segundo trimestre',
      content: 'Se recuerda revisar las actividades y fechas de evaluación publicadas para cada curso. Ante dudas sobre una entrega, consultar con el docente de la materia.',
      scope: AnnouncementScope.ALL_COURSES,
      urgency: AnnouncementUrgency.MEDIA,
    },
    {
      title: '[Muestra local] Reunión de seguimiento académico para familias',
      content: 'La unidad educativa invita a las familias a revisar el avance académico y mantener comunicación con los docentes. El horario de atención se coordina con secretaría.',
      scope: AnnouncementScope.ALL_PARENTS,
      urgency: AnnouncementUrgency.MEDIA,
    },
    {
      title: '[Muestra local] Coordinación docente del segundo trimestre',
      content: 'Se solicita mantener actualizados los registros de avance curricular y las actividades de cada curso para facilitar el seguimiento institucional.',
      scope: AnnouncementScope.ALL_TEACHERS,
      urgency: AnnouncementUrgency.BAJA,
    },
  ];
  let announcementsCreated = 0;
  for (const notice of notices) {
    const existing = await prisma.announcement.findFirst({
      where: { title: notice.title },
      select: { id: true },
    });
    if (existing) continue;
    await prisma.announcement.create({ data: { ...notice, createdById: admin.id } });
    announcementsCreated++;
  }

  let gradesCreated = 0;
  const batchSize = 1000;
  for (let index = 0; index < gradesToCreate.length; index += batchSize) {
    const batch = gradesToCreate.slice(index, index + batchSize);
    const result = await prisma.grade.createMany({ data: batch, skipDuplicates: true });
    gradesCreated += result.count;
  }

  const periodCounts = await Promise.all(
    [firstTrimester, secondTrimester].map(async (period) => ({
      period: period.name,
      grades: await prisma.grade.count({ where: { periodId: period.id } }),
    })),
  );

  console.log(
    JSON.stringify(
      {
        academicYear: academicYear.name,
        activeEnrollments: activeEnrollments.length,
        courses: courses.length,
        curricularStudentSubjectPairs: targetGradeKeys.size / 2,
        gradesCreated,
        teacherSubjectAssignmentsCreated: assignmentsCreated,
        activitiesCreated,
        announcementsCreated,
        periodCounts,
        note: 'Las notas existentes se conservaron; los nuevos registros y comunicados están identificados como muestra local.',
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
