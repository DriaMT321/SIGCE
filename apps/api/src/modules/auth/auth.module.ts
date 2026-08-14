import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RevokeRefreshTokenUseCase } from './application/use-cases/revoke-refresh-token.use-case';
import { RoleLoginUseCase } from './application/use-cases/role-login.use-case';
import { TokenService } from './application/services/token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, RoleLoginUseCase, RefreshTokenUseCase, RevokeRefreshTokenUseCase, TokenService, JwtStrategy],
  exports: [LoginUseCase, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
