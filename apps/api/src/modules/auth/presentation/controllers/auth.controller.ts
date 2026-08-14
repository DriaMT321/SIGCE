import { Body, Controller, Post, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RevokeRefreshTokenUseCase } from '../../application/use-cases/revoke-refresh-token.use-case';
import { RoleLoginUseCase } from '../../application/use-cases/role-login.use-case';
import { LoginDto } from '../../application/dto/login.dto';
import { RefreshTokenDto, RoleLoginDto } from '../../application/dto/login.dto';
import { Public } from '../../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly revokeRefreshTokenUseCase: RevokeRefreshTokenUseCase,
    private readonly roleLoginUseCase: RoleLoginUseCase,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await this.loginUseCase.execute(dto, ip, userAgent);

    return {
      statusCode: 200,
      message: 'Inicio de sesión exitoso',
      data: result,
    };
  }

  @Public()
  @Post('role-login')
  @HttpCode(HttpStatus.OK)
  async roleLogin(@Body() dto: RoleLoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      data: await this.roleLoginUseCase.execute(dto, ip, userAgent),
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens renovados exitosamente',
      data: await this.refreshTokenUseCase.execute(dto),
    };
  }

  @Public()
  @Post('revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.revokeRefreshTokenUseCase.execute(dto);
  }
}
