import { Body, Controller, Post, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from '../../application/dto/login.dto';
import { Public } from '../../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

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
}
