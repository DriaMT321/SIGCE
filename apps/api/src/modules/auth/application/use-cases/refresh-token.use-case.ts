import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../common/database/prisma.service';
import { JwtPayload } from '@academic/shared-types';
import { RefreshTokenDto } from '../dto/login.dto';
import { TokenService } from '../services/token.service';
import { hashRefreshToken } from '../services/token-hash';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashRefreshToken(dto.refreshToken) },
      include: { user: true },
    });
    const now = new Date();

    if (
      !storedToken ||
      storedToken.userId !== payload.sub ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= now ||
      !storedToken.user.isActive ||
      storedToken.user.deletedAt
    ) {
      throw new UnauthorizedException('Refresh token inválido, revocado o expirado');
    }

    const tokenPair = this.tokenService.issueForUser(storedToken.user);
    await this.prisma.$transaction(async (transaction) => {
      await transaction.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: now },
      });
      await transaction.refreshToken.create({
        data: {
          userId: storedToken.userId,
          token: hashRefreshToken(tokenPair.refreshToken),
          expiresAt: tokenPair.refreshExpiresAt,
        },
      });
    });

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        firstName: storedToken.user.firstName,
        lastName: storedToken.user.lastName,
        role: storedToken.user.role,
      },
    };
  }
}
