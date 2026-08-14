import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../../common/database/prisma.service';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { AuditAction } from '@academic/shared-types';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from '../services/token.service';
import { hashRefreshToken } from '../services/token-hash';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createAuditLogUseCase: CreateAuditLogUseCase,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Credenciales inválidas o cuenta inactiva');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas o cuenta inactiva');
    }

    const tokenPair = this.tokenService.issueForUser(user);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashRefreshToken(tokenPair.refreshToken),
        expiresAt: tokenPair.refreshExpiresAt,
      },
    });

    // Registrar en auditoría
    await this.createAuditLogUseCase.execute({
      userId: user.id,
      action: AuditAction.LOGIN,
      entity: 'User',
      entityId: user.id,
      newValue: { email: user.email, role: user.role },
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
}
