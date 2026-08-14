import { Injectable } from '@nestjs/common';
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

  issueForUser(user: Pick<User, 'id' | 'email' | 'role' | 'firstName' | 'lastName'>): TokenPair {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as unknown as UserRole,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessExpiration = this.configService.get<string>('jwt.accessExpiration', '15m') as JwtSignOptions['expiresIn'];
    const refreshExpiration = this.configService.get<string>('jwt.refreshExpiration', '7d') as JwtSignOptions['expiresIn'];
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
