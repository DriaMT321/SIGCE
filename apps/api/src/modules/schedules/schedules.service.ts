import { Injectable, NotFoundException } from '@nestjs/common';
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
