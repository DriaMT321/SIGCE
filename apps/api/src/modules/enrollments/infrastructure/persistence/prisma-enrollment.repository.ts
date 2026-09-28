import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { EnrollmentEntity } from '../../domain/entities/enrollment.entity';
import { EnrollmentCreateData, EnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';

@Injectable()
export class PrismaEnrollmentRepository implements EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { academicYearId?: string; courseId?: string; studentId?: string; parentUserId?: string; limit: number; offset: number }) {
    const where = {
      ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
      ...(query.courseId ? { courseId: query.courseId } : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
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
      this.prisma.enrollment.findMany({ where, skip: query.offset, take: query.limit, orderBy: { createdAt: 'desc' }, include: { student: true, course: true, academicYear: true } }),
      this.prisma.enrollment.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string) {
    const item = await this.prisma.enrollment.findUnique({ where: { id }, include: { student: true, course: true, academicYear: true } });
    return item ? this.map(item) : null;
  }

  async create(data: EnrollmentCreateData) {
    const item = await this.prisma.enrollment.create({ data, include: { student: true, course: true, academicYear: true } });
    return this.map(item);
  }

  async updateStatus(id: string, status: string, remarks?: string) {
    try {
      const item = await this.prisma.enrollment.update({ where: { id }, data: { status: status as 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED' | 'WITHDRAWN', ...(remarks !== undefined ? { remarks } : {}) }, include: { student: true, course: true, academicYear: true } });
      return this.map(item);
    } catch {
      throw new NotFoundException('Matrícula no encontrada');
    }
  }

  private map(item: Awaited<ReturnType<PrismaService['enrollment']['findUnique']>> & { student?: unknown; course?: unknown; academicYear?: unknown }): EnrollmentEntity {
    const value = item as NonNullable<Awaited<ReturnType<PrismaService['enrollment']['findUnique']>>> & {
      student: { id: string; rude: string; firstName: string; lastName: string };
      course: { id: string; name: string; gradeLevel: number; section: string };
      academicYear: { id: string; year: number; name: string };
    };
    return {
      id: value.id,
      studentId: value.studentId,
      courseId: value.courseId,
      academicYearId: value.academicYearId,
      enrollmentDate: value.enrollmentDate,
      status: value.status,
      remarks: value.remarks,
      student: value.student,
      course: value.course,
      academicYear: value.academicYear,
    };
  }
}
