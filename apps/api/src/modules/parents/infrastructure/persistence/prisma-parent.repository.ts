import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../../common/database/prisma.service';
import { ParentEntity } from '../../domain/entities/parent.entity';
import { ParentCreateData, ParentRepository, ParentUpdateData } from '../../domain/repositories/parent.repository.interface';

type ParentWithRelations = Prisma.ParentGetPayload<{ include: { user: true; studentParents: { include: { student: true } } } }>;

@Injectable()
export class PrismaParentRepository implements ParentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { search?: string; limit: number; offset: number }) {
    const where: Prisma.ParentWhereInput = {
      deletedAt: null,
      ...(query.search ? { OR: [{ ci: { contains: query.search, mode: 'insensitive' } }, { firstName: { contains: query.search, mode: 'insensitive' } }, { lastName: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.parent.findMany({ where, skip: query.offset, take: query.limit, orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }], include: { user: true, studentParents: { include: { student: true } } } }),
      this.prisma.parent.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string) {
    const parent = await this.prisma.parent.findFirst({ where: { id, deletedAt: null }, include: { user: true, studentParents: { include: { student: true } } } });
    return parent ? this.map(parent) : null;
  }

  async create(data: ParentCreateData) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const parent = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { email: data.email.toLowerCase(), passwordHash, firstName: data.firstName, lastName: data.lastName, role: UserRole.PARENT } });
      return tx.parent.create({ data: { userId: user.id, ci: data.ci, firstName: data.firstName, lastName: data.lastName, phone: data.phone, address: data.address, occupation: data.occupation }, include: { user: true, studentParents: { include: { student: true } } } });
    });
    return this.map(parent);
  }

  async update(id: string, data: ParentUpdateData) {
    const { password, email, firstName, lastName, ...parentFields } = data;
    try {
      const parent = await this.prisma.$transaction(async (tx) => {
        const current = await tx.parent.findUnique({ where: { id } });
        if (!current) throw new NotFoundException('Familiar no encontrado');
        if (password || email || firstName || lastName) {
          await tx.user.update({ where: { id: current.userId }, data: { ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}), ...(email ? { email: email.toLowerCase() } : {}), ...(firstName ? { firstName } : {}), ...(lastName ? { lastName } : {}) } });
        }
        return tx.parent.update({ where: { id }, data: { ...parentFields, ...(firstName ? { firstName } : {}), ...(lastName ? { lastName } : {}) }, include: { user: true, studentParents: { include: { student: true } } } });
      });
      return this.map(parent);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException('Familiar no encontrado');
    }
  }

  private map(value: ParentWithRelations): ParentEntity {
    return { id: value.id, userId: value.userId, ci: value.ci, firstName: value.firstName, lastName: value.lastName, phone: value.phone, email: value.email, address: value.address, occupation: value.occupation, students: value.studentParents.map(({ student }) => ({ id: student.id, rude: student.rude, firstName: student.firstName, lastName: student.lastName })), createdAt: value.createdAt, updatedAt: value.updatedAt };
  }
}
