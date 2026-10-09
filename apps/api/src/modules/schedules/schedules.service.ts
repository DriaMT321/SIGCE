import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { PrismaService } from '../../common/database/prisma.service';
import { DayOfWeek, Prisma } from '@prisma/client';

export interface CreateScheduleInput {
  courseId: string;
  subjectId: string;
  teacherId: string;
  academicYearId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  periodIndex: number;
  classroom?: string;
}

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: {
    courseId?: string;
    teacherId?: string;
    dayOfWeek?: DayOfWeek;
    academicYearId?: string;
  }) {
    // If no academicYearId provided, use active year
    let yearId = filters.academicYearId;
    if (!yearId) {
      const activeYear = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      yearId = activeYear?.id;
    }

    const where: Prisma.ClassScheduleWhereInput = {};
    if (yearId) where.academicYearId = yearId;
    if (filters.courseId) where.courseId = filters.courseId;
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.dayOfWeek) where.dayOfWeek = filters.dayOfWeek;

    return this.prisma.classSchedule.findMany({
      where,
      include: {
        course: true,
        subject: true,
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { periodIndex: 'asc' },
      ],
    });
  }

  async getCourseSchedule(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const schedules = await this.prisma.classSchedule.findMany({
      where: { courseId },
      include: {
        subject: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { periodIndex: 'asc' },
      ],
    });

    const teacherSubjects = await this.prisma.teacherSubject.findMany({
      where: { courseId },
      include: {
        subject: true,
        teacher: true,
      },
      orderBy: { subject: { name: 'asc' } },
    });

    return {
      course,
      schedules,
      teacherSubjects,
    };
  }

  async getTeacherSchedule(teacherId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });
    if (!teacher) throw new NotFoundException('Docente no encontrado');

    const schedules = await this.prisma.classSchedule.findMany({
      where: { teacherId },
      include: {
        subject: true,
        course: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { periodIndex: 'asc' },
      ],
    });

    const assignments = await this.prisma.teacherSubject.findMany({
      where: { teacherId },
      include: {
        course: true,
        subject: true,
      },
      orderBy: [
        { course: { gradeLevel: 'asc' } },
        { subject: { name: 'asc' } },
      ],
    });

    return {
      teacher,
      schedules,
      assignments,
    };
  }

  async getMySchedule(user: AuthenticatedUser) {
    if (user.role === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (!teacher) {
        throw new NotFoundException('Docente no encontrado para este usuario');
      }
      const data = await this.getTeacherSchedule(teacher.id);
      return {
        type: 'teacher',
        ...data,
      };
    }

    // Estudiante vinculado directamente por userId
    const student = await this.prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        enrollments: {
          where: { status: 'ACTIVE' },
          include: { course: true },
          take: 1,
        },
      },
    });

    if (student) {
      const enrollment = student.enrollments[0];
      if (!enrollment) {
        return {
          type: 'student',
          student: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            rude: student.rude,
            ci: student.ci,
          },
          course: null,
          schedules: [],
          teacherSubjects: [],
          message: 'El estudiante no cuenta con una matrícula activa en la gestión actual.',
        };
      }

      const scheduleData = await this.getCourseSchedule(enrollment.courseId);
      return {
        type: 'student',
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          rude: student.rude,
          ci: student.ci,
        },
        course: scheduleData.course,
        schedules: scheduleData.schedules,
        teacherSubjects: scheduleData.teacherSubjects,
      };
    }

    // Padre de familia o tutor vinculado por userId
    const parent = await this.prisma.parent.findUnique({
      where: { userId: user.id },
      include: {
        studentParents: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: { status: 'ACTIVE' },
                  include: { course: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (parent) {
      const childrenWithSchedules = await Promise.all(
        parent.studentParents.map(async (sp) => {
          const child = sp.student;
          const enrollment = child.enrollments[0];
          let scheduleData: Awaited<ReturnType<SchedulesService['getCourseSchedule']>> | null = null;
          if (enrollment?.courseId) {
            scheduleData = await this.getCourseSchedule(enrollment.courseId);
          }
          return {
            student: {
              id: child.id,
              firstName: child.firstName,
              lastName: child.lastName,
              rude: child.rude,
              ci: child.ci,
            },
            relationship: sp.relationship,
            course: scheduleData?.course ?? null,
            schedules: scheduleData?.schedules ?? [],
            teacherSubjects: scheduleData?.teacherSubjects ?? [],
          };
        }),
      );

      const firstChild = childrenWithSchedules[0];

      return {
        type: 'parent',
        parent: {
          id: parent.id,
          firstName: parent.firstName,
          lastName: parent.lastName,
          ci: parent.ci,
        },
        children: childrenWithSchedules,
        course: firstChild?.course ?? null,
        schedules: firstChild?.schedules ?? [],
        teacherSubjects: firstChild?.teacherSubjects ?? [],
      };
    }

    return {
      type: 'administrative',
      course: null,
      schedules: [],
      teacherSubjects: [],
    };
  }

  async upsert(data: CreateScheduleInput) {
    let yearId = data.academicYearId;
    if (!yearId) {
      const activeYear = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      if (!activeYear) throw new NotFoundException('No hay una gestión académica activa');
      yearId = activeYear.id;
    }

    const existing = await this.prisma.classSchedule.findFirst({
      where: {
        courseId: data.courseId,
        academicYearId: yearId,
        dayOfWeek: data.dayOfWeek,
        periodIndex: data.periodIndex,
      },
    });

    if (existing) {
      return this.prisma.classSchedule.update({
        where: { id: existing.id },
        data: {
          subjectId: data.subjectId,
          teacherId: data.teacherId,
          startTime: data.startTime,
          endTime: data.endTime,
          classroom: data.classroom,
        },
        include: {
          course: true,
          subject: true,
          teacher: true,
        },
      });
    }

    return this.prisma.classSchedule.create({
      data: {
        ...data,
        academicYearId: yearId,
      },
      include: {
        course: true,
        subject: true,
        teacher: true,
      },
    });
  }

  async generateAuto(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { academicYear: true },
    });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const yearId = course.academicYearId;

    // 1. Obtener asignaciones de materias y profesores del curso
    const teacherSubjects = await this.prisma.teacherSubject.findMany({
      where: { courseId },
      include: {
        subject: true,
        teacher: true,
      },
    });

    // Si el curso no tiene materias asignadas en TeacherSubject, buscar materias generales del nivel
    let subjectTeachers = teacherSubjects.map((ts) => ({
      subject: ts.subject,
      teacher: ts.teacher,
    }));

    if (subjectTeachers.length === 0) {
      const allSubjects = await this.prisma.subject.findMany({ take: 10 });
      const allTeachers = await this.prisma.teacher.findMany({ take: 10 });
      if (allSubjects.length === 0 || allTeachers.length === 0) {
        throw new NotFoundException('No hay materias o docentes registrados en el sistema');
      }
      subjectTeachers = allSubjects.map((s, idx) => ({
        subject: s,
        teacher: allTeachers[idx % allTeachers.length],
      }));
    }

    // 2. Horas semanales requeridas por materia según normativa ministerial (30 periodos/semana)
    const TOTAL_PERIODS = 30;
    const subjectQuotas: Array<{ subject: { id: string; name: string; code: string }; teacher: { id: string; firstName: string; lastName: string }; periodsNeeded: number }> = [];

    const majorSubjectPatterns = ['MAT', 'LEN', 'LIT', 'ESP'];
    const mediumSubjectPatterns = ['CN', 'SOC', 'CS', 'FIS', 'QUI', 'BIO'];

    const numSubjects = subjectTeachers.length;

    subjectTeachers.forEach((st) => {
      const code = (st.subject.code || '').toUpperCase();
      let quota = 2;
      if (majorSubjectPatterns.some((p) => code.includes(p))) {
        quota = 5;
      } else if (mediumSubjectPatterns.some((p) => code.includes(p))) {
        quota = 4;
      } else {
        quota = Math.max(2, Math.floor(TOTAL_PERIODS / numSubjects));
      }
      subjectQuotas.push({ subject: st.subject, teacher: st.teacher, periodsNeeded: quota });
    });

    // Ajustar si la suma difiere de 30
    let currentTotal = subjectQuotas.reduce((acc, q) => acc + q.periodsNeeded, 0);
    while (currentTotal > TOTAL_PERIODS) {
      const largest = subjectQuotas.reduce((max, q) => (q.periodsNeeded > max.periodsNeeded ? q : max), subjectQuotas[0]);
      if (largest.periodsNeeded > 2) {
        largest.periodsNeeded--;
        currentTotal--;
      } else break;
    }
    while (currentTotal < TOTAL_PERIODS) {
      const smallest = subjectQuotas.reduce((min, q) => (q.periodsNeeded < min.periodsNeeded ? q : min), subjectQuotas[0]);
      smallest.periodsNeeded++;
      currentTotal++;
    }

    // 3. Estructura horaria estándar de 6 periodos por día
    const DAYS: DayOfWeek[] = [
      DayOfWeek.LUNES,
      DayOfWeek.MARTES,
      DayOfWeek.MIERCOLES,
      DayOfWeek.JUEVES,
      DayOfWeek.VIERNES,
    ];

    const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
      1: { start: '07:30', end: '08:15' },
      2: { start: '08:15', end: '09:00' },
      3: { start: '09:15', end: '10:00' },
      4: { start: '10:00', end: '10:45' },
      5: { start: '11:00', end: '11:45' },
      6: { start: '11:45', end: '12:30' },
    };

    // 4. Obtener horarios de otros cursos para evitar colisiones de docentes
    const otherSchedules = await this.prisma.classSchedule.findMany({
      where: {
        academicYearId: yearId,
        courseId: { not: courseId },
      },
      select: {
        teacherId: true,
        dayOfWeek: true,
        periodIndex: true,
      },
    });

    const teacherBusyMap = new Set<string>();
    otherSchedules.forEach((s) => {
      teacherBusyMap.add(`${s.teacherId}_${s.dayOfWeek}_${s.periodIndex}`);
    });

    // 5. Algoritmo de asignación y resolución de restricciones
    const generatedSlots: Array<{
      courseId: string;
      subjectId: string;
      teacherId: string;
      academicYearId: string;
      dayOfWeek: DayOfWeek;
      periodIndex: number;
      startTime: string;
      endTime: string;
      classroom: string;
    }> = [];

    const daySubjectCount = new Map<string, number>();

    const periodTokens: Array<{ subject: { id: string; name: string; code: string }; teacher: { id: string; firstName: string; lastName: string } }> = [];
    subjectQuotas.forEach((sq) => {
      for (let k = 0; k < sq.periodsNeeded; k++) {
        periodTokens.push({ subject: sq.subject, teacher: sq.teacher });
      }
    });

    periodTokens.sort((a, b) => {
      const qA = subjectQuotas.find((sq) => sq.subject.id === a.subject.id)?.periodsNeeded || 0;
      const qB = subjectQuotas.find((sq) => sq.subject.id === b.subject.id)?.periodsNeeded || 0;
      return qB - qA;
    });

    for (const day of DAYS) {
      for (let pIdx = 1; pIdx <= 6; pIdx++) {
        let chosenIndex = -1;

        for (let i = 0; i < periodTokens.length; i++) {
          const cand = periodTokens[i];
          const countOnDay = daySubjectCount.get(`${day}_${cand.subject.id}`) || 0;
          if (countOnDay >= 2) continue;

          const isBusy = teacherBusyMap.has(`${cand.teacher.id}_${day}_${pIdx}`);
          if (isBusy) continue;

          chosenIndex = i;
          break;
        }

        if (chosenIndex === -1 && periodTokens.length > 0) {
          chosenIndex = 0;
        }

        if (chosenIndex >= 0) {
          const token = periodTokens.splice(chosenIndex, 1)[0];
          const times = PERIOD_TIMES[pIdx];

          generatedSlots.push({
            courseId,
            subjectId: token.subject.id,
            teacherId: token.teacher.id,
            academicYearId: yearId,
            dayOfWeek: day,
            periodIndex: pIdx,
            startTime: times.start,
            endTime: times.end,
            classroom: `Aula ${course.name}`,
          });

          daySubjectCount.set(`${day}_${token.subject.id}`, (daySubjectCount.get(`${day}_${token.subject.id}`) || 0) + 1);
          teacherBusyMap.add(`${token.teacher.id}_${day}_${pIdx}`);
        }
      }
    }

    // 6. Transacción atómica: limpiar horario anterior del curso e insertar el nuevo
    await this.prisma.$transaction([
      this.prisma.classSchedule.deleteMany({ where: { courseId } }),
      this.prisma.classSchedule.createMany({
        data: generatedSlots,
      }),
    ]);

    return {
      message: `Horario generado automáticamente con éxito (${generatedSlots.length} periodos semanales)`,
      totalSlots: generatedSlots.length,
      distribution: subjectQuotas.map((sq) => ({
        subjectName: sq.subject.name,
        code: sq.subject.code,
        teacherName: `${sq.teacher.firstName} ${sq.teacher.lastName}`,
        periods: sq.periodsNeeded,
      })),
    };
  }

  async create(data: CreateScheduleInput) {
    let yearId = data.academicYearId;
    if (!yearId) {
      const activeYear = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      if (!activeYear) throw new NotFoundException('No hay una gestión académica activa');
      yearId = activeYear.id;
    }

    return this.prisma.classSchedule.create({
      data: {
        ...data,
        academicYearId: yearId,
      },
      include: {
        course: true,
        subject: true,
        teacher: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.classSchedule.delete({
      where: { id },
    });
  }
}
