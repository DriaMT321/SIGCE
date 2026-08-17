import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../../common/database/prisma.service';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { TeacherCreateData, TeacherRepository, TeacherUpdateData } from '../../domain/repositories/teacher.repository.interface';

type TeacherWithUser = Prisma.TeacherGetPayload<{ include: { user: true } }>;

@Injectable()
export class PrismaTeacherRepository implements TeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { search?: string; limit: number; offset: number }) {
    const where: Prisma.TeacherWhereInput = {
      deletedAt: null,
      ...(query.search ? { OR: [{ ci: { contains: query.search, mode: 'insensitive' } }, { firstName: { contains: query.search, mode: 'insensitive' } }, { lastName: { contains: query.search, mode: 'insensitive' } }, { itemNumber: { contains: query.search, mode: 'insensitive' } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.teacher.findMany({ where, skip: query.offset, take: query.limit, orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }], include: { user: true } }),
      this.prisma.teacher.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string) {
    const teacher = await this.prisma.teacher.findFirst({ where: { id, deletedAt: null }, include: { user: true } });
    return teacher ? this.map(teacher) : null;
  }

  async create(data: TeacherCreateData) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const teacher = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { email: data.email.toLowerCase(), passwordHash, firstName: data.firstName, lastName: data.lastName, role: UserRole.TEACHER } });
      return tx.teacher.create({ data: { userId: user.id, ci: data.ci, firstName: data.firstName, lastName: data.lastName, specialty: data.specialty, phone: data.phone, itemNumber: data.itemNumber }, include: { user: true } });
    });
    return this.map(teacher);
  }

  async update(id: string, data: TeacherUpdateData) {
    const { password, email, firstName, lastName, ...teacherFields } = data;
    try {
      const teacher = await this.prisma.$transaction(async (tx) => {
        const current = await tx.teacher.findUnique({ where: { id } });
        if (!current) throw new NotFoundException('Docente no encontrado');
        if (password || email || firstName || lastName) {
          await tx.user.update({ where: { id: current.userId }, data: { ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}), ...(email ? { email: email.toLowerCase() } : {}), ...(firstName ? { firstName } : {}), ...(lastName ? { lastName } : {}) } });
        }
        return tx.teacher.update({ where: { id }, data: { ...teacherFields, ...(firstName ? { firstName } : {}), ...(lastName ? { lastName } : {}) }, include: { user: true } });
      });
      return this.map(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException('Docente no encontrado');
    }
  }

  private map(value: TeacherWithUser): TeacherEntity {
    return { id: value.id, userId: value.userId, ci: value.ci, firstName: value.firstName, lastName: value.lastName, specialty: value.specialty, phone: value.phone, itemNumber: value.itemNumber, email: value.user.email, createdAt: value.createdAt, updatedAt: value.updatedAt };
  }
}
