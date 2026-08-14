import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../common/database/prisma.service';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { TokenService } from '../services/token.service';
import { RefreshTokenDto } from '../dto/login.dto';

describe('RefreshTokenUseCase', () => {
  it('rota un refresh token válido y revoca el anterior', async () => {
    const oldToken = {
      id: 'token-1',
      userId: 'user-1',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: 'user-1',
        email: 'admin@example.local',
        firstName: 'Admin',
        lastName: 'Local',
        role: 'ADMIN',
        isActive: true,
        deletedAt: null,
      },
    };
    const transaction = {
      refreshToken: {
        update: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      refreshToken: { findUnique: jest.fn().mockResolvedValue(oldToken) },
      $transaction: jest.fn(async (callback: (tx: typeof transaction) => Promise<void>) => callback(transaction)),
    };
    const jwtService = { verify: jest.fn().mockReturnValue({ sub: 'user-1' }) };
    const configService = { getOrThrow: jest.fn().mockReturnValue('refresh-secret') };
    const tokenService = {
      issueForUser: jest.fn().mockReturnValue({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        refreshExpiresAt: new Date(Date.now() + 604_800_000),
      }),
    };

    const useCase = new RefreshTokenUseCase(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
      tokenService as unknown as TokenService,
    );

    const result = await useCase.execute({ refreshToken: 'old-refresh' } satisfies RefreshTokenDto);

    expect(result.accessToken).toBe('new-access');
    expect(transaction.refreshToken.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'token-1' } }),
    );
    expect(transaction.refreshToken.create).toHaveBeenCalled();
  });
});
