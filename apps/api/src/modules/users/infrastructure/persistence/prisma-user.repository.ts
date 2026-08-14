import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    role?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: UserEntity[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (params?.role) {
      where.role = params.role as UserRole;
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
}
