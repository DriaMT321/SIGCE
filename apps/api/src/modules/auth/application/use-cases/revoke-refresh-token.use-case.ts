import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { RefreshTokenDto } from '../dto/login.dto';
import { hashRefreshToken } from '../services/token-hash';

@Injectable()
export class RevokeRefreshTokenUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: RefreshTokenDto): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        token: hashRefreshToken(dto.refreshToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }
}
