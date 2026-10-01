dosimport { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { JwtPayload, UserRole } from '@academic/shared-types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private sanitizeExpiration(val: unknown, fallback: string): string | number {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return fallback;
    const clean = val.trim().replace(/^['"]|['"]$/g, '');
    if (!clean) return fallback;

    if (/^\d+$/.test(clean)) {
      const num = parseInt(clean, 10);
      if (num <= 31 && fallback.endsWith('d')) return `${num}d`;
      if (num <= 60 && fallback.endsWith('m')) return `${num}m`;
      return num;
    }
    return clean;
  }

  issueForUser(user: Pick<User, 'id' | 'email' | 'role' | 'firstName' | 'lastName'>): TokenPair {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as unknown as UserRole,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const rawAccess = this.configService.get<string>('jwt.accessExpiration', '15m');
    const rawRefresh = this.configService.get<string>('jwt.refreshExpiration', '7d');

    const accessExpiration = this.sanitizeExpiration(rawAccess, '15m') as JwtSignOptions['expiresIn'];
    const refreshExpiration = this.sanitizeExpiration(rawRefresh, '7d') as JwtSignOptions['expiresIn'];

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
      expiresIn: accessExpiration,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: refreshExpiration,
    });

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    return { accessToken, refreshToken, refreshExpiresAt };
  }
}
