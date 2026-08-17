import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { AttendanceCreateData, AttendanceRepository, AttendanceUpdateData } from '../../domain/repositories/attendance.repository.interface';

@Injectable()
export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { studentId?: string; courseId?: string; from?: Date; to?: Date; parentUserId?: string; limit: number; offset: number }) {
    const where = {
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.courseId ? { courseId: query.courseId } : {}),
      ...(query.from || query.to ? { date: { ...(query.from ? { gte: query.from } : {}), ...(query.to ? { lte: query.to } : {}) } } : {}),
      ...(query.parentUserId ? { student: { studentParents: { some: { parent: { userId: query.parentUserId } } } } } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.attendance.findMany({ where, skip: query.offset, take: query.limit, orderBy: { date: 'desc' }, include: { student: true, course: true } }),
      this.prisma.attendance.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string) {
    const item = await this.prisma.attendance.findUnique({ where: { id }, include: { student: true, course: true } });
    return item ? this.map(item) : null;
  }

  async create(data: AttendanceCreateData) {
    const item = await this.prisma.attendance.create({ data: { ...data, status: data.status as 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED' }, include: { student: true, course: true } });
    return this.map(item);
  }

  async update(id: string, data: AttendanceUpdateData) {
    try {
      const item = await this.prisma.attendance.update({ where: { id }, data: { ...data, status: data.status as 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED' }, include: { student: true, course: true } });
      return this.map(item);
    } catch {
      throw new NotFoundException('Registro de asistencia no encontrado');
    }
  }

  private map(item: Awaited<ReturnType<PrismaService['attendance']['findUnique']>> & { student?: unknown; course?: unknown }): AttendanceEntity {
    const value = item as NonNullable<Awaited<ReturnType<PrismaService['attendance']['findUnique']>>> & {
      student: { id: string; rude: string; firstName: string; lastName: string };
      course: { id: string; name: string; gradeLevel: number; section: string };
    };
    return { id: value.id, studentId: value.studentId, courseId: value.courseId, registeredById: value.registeredById, date: value.date, status: value.status, justification: value.justification, student: value.student, course: value.course };
  }
}
