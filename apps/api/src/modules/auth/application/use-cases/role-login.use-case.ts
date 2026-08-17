import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole as PrismaUserRole, type User } from '@prisma/client';
import { AuditAction } from '@academic/shared-types';
import { PrismaService } from '../../../../common/database/prisma.service';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { TokenService } from '../services/token.service';
import { hashRefreshToken } from '../services/token-hash';
import { LoginRole, RoleLoginDto } from '../dto/login.dto';

@Injectable()
export class RoleLoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createAuditLogUseCase: CreateAuditLogUseCase,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RoleLoginDto, ipAddress?: string, userAgent?: string) {
    const identifier = dto.identifier.trim();
    const user = await this.findUser(dto.role, identifier, dto.secondaryIdentifier?.trim());

    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Las credenciales no son válidas o la cuenta está inactiva');
    }

    if (dto.role === LoginRole.TEACHER || dto.role === LoginRole.ADMINISTRATIVE) {
      if (!dto.secret || !(await bcrypt.compare(dto.secret, user.passwordHash))) {
        throw new UnauthorizedException('Las credenciales no son válidas o la cuenta está inactiva');
      }
    }

    const tokenPair = this.tokenService.issueForUser(user);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashRefreshToken(tokenPair.refreshToken),
        expiresAt: tokenPair.refreshExpiresAt,
      },
    });

    await this.createAuditLogUseCase.execute({
      userId: user.id,
      action: AuditAction.LOGIN,
      entity: 'User',
      entityId: user.id,
      newValue: { email: user.email, role: user.role, loginRole: dto.role },
      ipAddress,
      userAgent,
    });

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private async findUser(role: LoginRole, identifier: string, secondaryIdentifier?: string): Promise<User | null> {
    switch (role) {
      case LoginRole.STUDENT: {
        const student = await this.prisma.student.findFirst({
          where: { rude: identifier, deletedAt: null, userId: { not: null } },
          include: { user: true },
        });
        return student?.user ?? null;
      }
      case LoginRole.TEACHER: {
        const teacher = await this.prisma.teacher.findFirst({
          where: {
            deletedAt: null,
            OR: [{ itemNumber: identifier }, { ci: identifier }],
          },
          include: { user: true },
        });
        return teacher?.user ?? null;
      }
      case LoginRole.FAMILY: {
        if (!secondaryIdentifier) return null;
        const parent = await this.prisma.parent.findFirst({
          where: { ci: identifier, phone: secondaryIdentifier, deletedAt: null },
          include: { user: true },
        });
        return parent?.user ?? null;
      }
      case LoginRole.ADMINISTRATIVE:
        return this.prisma.user.findFirst({
          where: {
            OR: [{ email: identifier.toLowerCase() }, { id: identifier }],
            role: { in: [PrismaUserRole.ADMIN, PrismaUserRole.DIRECTOR, PrismaUserRole.SECRETARY] },
          },
        });
    }
  }
}
