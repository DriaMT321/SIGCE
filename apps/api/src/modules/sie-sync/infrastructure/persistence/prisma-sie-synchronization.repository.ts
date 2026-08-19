import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../common/database/prisma.service';
import { SieSyncStatus } from '@academic/shared-types';
import { CreateSynchronizationInput, ISieSynchronizationRepository } from '../../domain/repositories/sie-synchronization.repository.interface';

@Injectable()
export class PrismaSieSynchronizationRepository implements ISieSynchronizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.sieSynchronization.findUnique({
      where: { id },
      include: { items: { include: { student: true, subject: true, period: true } } },
    });
  }

  async findAll(limit: number, offset: number) {
    const [items, total] = await Promise.all([
      this.prisma.sieSynchronization.findMany({ where: {}, orderBy: { createdAt: 'desc' }, skip: offset, take: limit, include: { items: { include: { student: true, subject: true, period: true } } } }),
      this.prisma.sieSynchronization.count(),
    ]);
    return { items, total };
  }

  async createFromGrades(input: CreateSynchronizationInput) {
    const gradeWhere: Prisma.GradeWhereInput = {
      ...(input.courseId ? { enrollment: { courseId: input.courseId } } : {}),
      ...(input.subjectId ? { subjectId: input.subjectId } : {}),
      period: {
        academicYear: { isActive: true },
        ...(input.periodNumber ? { number: input.periodNumber } : {}),
      },
    };
    const grades = await this.prisma.grade.findMany({
      where: gradeWhere,
      orderBy: [{ student: { lastName: 'asc' } }, { subject: { name: 'asc' } }],
      take: 500,
      include: { student: true, subject: true, period: { include: { academicYear: true } } },
    });

    if (!grades.length) return null;

    const synchronization = await this.prisma.sieSynchronization.create({
      data: {
        requestedById: input.requestedById,
        syncType: input.syncType,
        status: SieSyncStatus.QUEUED,
        totalItems: grades.length,
        items: {
          create: grades.map((grade) => ({
            studentId: grade.studentId,
            subjectId: grade.subjectId,
            periodId: grade.periodId,
            localValue: grade.value,
            status: SieSyncStatus.QUEUED,
          })),
        },
      },
      include: { items: { include: { student: true, subject: true, period: true } } },
    });

    const jobs = synchronization.items.map((item, index) => {
      const grade = grades[index];
      return {
        synchronizationId: synchronization.id,
        itemId: item.id,
        studentRude: grade.student.rude,
        studentCi: grade.student.ci,
        academicYear: grade.period.academicYear.year,
        periodNumber: grade.period.number,
        subjectCode: grade.subject.code,
        localGrade: grade.value,
      };
    });

    return { synchronization, jobs };
  }
}
