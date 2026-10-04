import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Prisma, UserRole } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../../application/dto/create-user.dto';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: UserEntity[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (params?.role && params.role !== 'ALL') {
      where.role = params.role as UserRole;
    }

    if (params?.search?.trim()) {
      const term = params.search.trim();
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [rawUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: params?.limit ?? 50,
        skip: params?.offset ?? 0,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const items = rawUsers.map(
      (u) =>
        new UserEntity(
          u.id,
          u.email,
          u.firstName,
          u.lastName,
          u.role as unknown as UserEntity['role'],
          u.isActive,
          u.createdAt,
          u.updatedAt,
          u.deletedAt,
        ),
    );

    return { items, total };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const u = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!u) return null;

    return new UserEntity(
      u.id,
      u.email,
      u.firstName,
      u.lastName,
      u.role as unknown as UserEntity['role'],
      u.isActive,
      u.createdAt,
      u.updatedAt,
      u.deletedAt,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const u = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!u) return null;

    return new UserEntity(
      u.id,
      u.email,
      u.firstName,
      u.lastName,
      u.role as unknown as UserEntity['role'],
      u.isActive,
      u.createdAt,
      u.updatedAt,
      u.deletedAt,
    );
  }

  async create(data: CreateUserDto & { passwordHash: string }): Promise<UserEntity> {
    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role as unknown as UserRole,
        },
      });

      if (data.role === 'TEACHER') {
        const fallbackCi = data.ci || `DOC-${Date.now().toString().slice(-6)}`;
        await tx.teacher.create({
          data: {
            userId: user.id,
            ci: fallbackCi,
            firstName: data.firstName,
            lastName: data.lastName,
            specialty: data.specialty || 'Docencia General',
            phone: data.phone,
            itemNumber: data.itemNumber,
          },
        });
      } else if (data.role === 'PARENT') {
        const fallbackCi = data.ci || `FAM-${Date.now().toString().slice(-6)}`;
        await tx.parent.create({
          data: {
            userId: user.id,
            ci: fallbackCi,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || '70000000',
            address: data.address,
            occupation: data.occupation,
          },
        });
      }

      return user;
    });

    return new UserEntity(
      createdUser.id,
      createdUser.email,
      createdUser.firstName,
      createdUser.lastName,
      createdUser.role as unknown as UserEntity['role'],
      createdUser.isActive,
      createdUser.createdAt,
      createdUser.updatedAt,
      createdUser.deletedAt,
    );
  }

  async update(id: string, data: UpdateUserDto & { passwordHash?: string }): Promise<UserEntity> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.firstName ? { firstName: data.firstName } : {}),
        ...(data.lastName ? { lastName: data.lastName } : {}),
        ...(data.passwordHash ? { passwordHash: data.passwordHash } : {}),
        ...(typeof data.isActive === 'boolean' ? { isActive: data.isActive } : {}),
      },
    });

    return new UserEntity(
      updated.id,
      updated.email,
      updated.firstName,
      updated.lastName,
      updated.role as unknown as UserEntity['role'],
      updated.isActive,
      updated.createdAt,
      updated.updatedAt,
      updated.deletedAt,
    );
  }
}
