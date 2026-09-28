import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { GradeEntity } from '../../domain/entities/grade.entity';
import { GradeCreateData, GradeRepository, GradeUpdateData } from '../../domain/repositories/grade.repository.interface';

@Injectable()
export class PrismaGradeRepository implements GradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { studentId?: string; enrollmentId?: string; periodId?: string; parentUserId?: string; limit: number; offset: number }) {
    const where = {
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.enrollmentId ? { enrollmentId: query.enrollmentId } : {}),
      ...(query.periodId ? { periodId: query.periodId } : {}),
      ...(query.parentUserId
        ? {
            student: {
              OR: [
                { studentParents: { some: { parent: { userId: query.parentUserId } } } },
                { userId: query.parentUserId },
              ],
            },
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.grade.findMany({ where, skip: query.offset, take: query.limit, orderBy: [{ period: { number: 'asc' } }, { subject: { name: 'asc' } }], include: { student: true, subject: true, period: true } }),
      this.prisma.grade.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string) {
    const item = await this.prisma.grade.findUnique({ where: { id }, include: { student: true, subject: true, period: true } });
    return item ? this.map(item) : null;
  }

  async create(data: GradeCreateData) {
    const item = await this.prisma.grade.create({ data, include: { student: true, subject: true, period: true } });
    return this.map(item);
  }

  async update(id: string, data: GradeUpdateData) {
    try {
      const item = await this.prisma.grade.update({ where: { id }, data, include: { student: true, subject: true, period: true } });
      return this.map(item);
    } catch {
      throw new NotFoundException('Calificación no encontrada');
    }
  }

  private map(item: Awaited<ReturnType<PrismaService['grade']['findUnique']>> & { student?: unknown; subject?: unknown; period?: unknown }): GradeEntity {
    const value = item as NonNullable<Awaited<ReturnType<PrismaService['grade']['findUnique']>>> & {
      student: { id: string; rude: string; firstName: string; lastName: string };
      subject: { id: string; code: string; name: string };
      period: { id: string; name: string; number: number };
    };
    return { id: value.id, enrollmentId: value.enrollmentId, studentId: value.studentId, subjectId: value.subjectId, periodId: value.periodId, value: value.value, remarks: value.remarks, updatedAt: value.updatedAt, student: value.student, subject: value.subject, period: value.period };
  }
}
