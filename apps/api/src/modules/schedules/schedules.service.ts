import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { PrismaService } from '../../common/database/prisma.service';
import { DayOfWeek } from '@prisma/client';

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

    const where: any = {};
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
          let scheduleData: any = null;
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
