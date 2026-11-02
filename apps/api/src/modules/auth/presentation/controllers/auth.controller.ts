import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Inject,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { casousoiniciarsesion } from '../../application/use-cases/acceso.use-case';
import { casousorenovartoken } from '../../application/use-cases/renovaciontoken.use-case';
import { casousorevocartokenrenovacion } from '../../application/use-cases/revocarrenovaciontoken.use-case';
import { casousoiniciarsesionporrol } from '../../application/use-cases/rolacceso.use-case';
import { dtoiniciosesion } from '../dto/acceso.dto';
import {
  dtoactivarcuentaestudiante,
  dtotokenrenovacion,
  dtoiniciosesionporrol,
} from '../dto/acceso.dto';
import { publico } from '../../../../common/decorators/publico.decorator';
import {
  tokenlimitadorintentosautenticacion,
  limitadorintentosautenticacionpuerto,
} from '../../application/ports/limitadorintentosautenticacion.port';
import { casousoactivarcuentaestudiante } from '../../application/use-cases/activarcuentaestudiante.use-case';

const constantewebrefreshcookie = 'sigce_refresh';
const constantewebmarcadorheader = '1';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginusocaso: casousoiniciarsesion,
    private readonly refreshtokenusocaso: casousorenovartoken,
    private readonly revokerefreshtokenusocaso: casousorevocartokenrenovacion,
    private readonly rolloginusocaso: casousoiniciarsesionporrol,
    private readonly activateestudiantecuenta: casousoactivarcuentaestudiante,
    @Inject(tokenlimitadorintentosautenticacion)
    private readonly ratelimitador: limitadorintentosautenticacionpuerto,
    private readonly configuracionservicio: ConfigService,
  ) {}

  @publico()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async iniciarsesion(@Body() dto: dtoiniciosesion, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const agenteusuario = req.headers['user-agent'];

    await this.ratelimitador.verificariniciosesion(ip || 'unknown');
    const resultado = await this.loginusocaso.ejecutar(dto, ip, agenteusuario);

    return {
      statusCode: 200,
      message: 'Inicio de sesión exitoso',
      data: resultado,
    };
  }

  @publico()
  @Post('role-login')
  @HttpCode(HttpStatus.OK)
  async iniciarsesionporrol(@Body() dto: dtoiniciosesionporrol, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const agenteusuario = req.headers['user-agent'];

    await this.ratelimitador.verificariniciosesion(ip || 'unknown');
    const resultado = await this.rolloginusocaso.ejecutar(dto, ip, agenteusuario);

    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      data: resultado,
    };
  }

  @publico()
  @Post('student/activate')
  @HttpCode(HttpStatus.OK)
  async activarestudiante(@Body() dto: dtoactivarcuentaestudiante, @Req() req: Request) {
    const resultado = await this.activateestudiantecuenta.ejecutar({
      activationToken: dto.activationToken,
      newPassword: dto.newPassword,
      ipAddress: req.ip || req.socket.remoteAddress,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Cuenta estudiantil activada. Ya puedes iniciar sesión.',
      data: resultado,
    };
  }

  @publico()
  @Post('web/role-login')
  @HttpCode(HttpStatus.OK)
  async iniciarsesionwebporrol(
    @Body() dto: dtoiniciosesionporrol,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.afirmarwebsolicitud(req);
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const agenteusuario = req.headers['user-agent'];
    await this.ratelimitador.verificariniciosesion(ip);
    const resultado = await this.rolloginusocaso.ejecutar(dto, ip, agenteusuario);
    this.establecerrefreshcookie(req, res, resultado.refreshToken, resultado.refreshExpiresAt);

    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      data: { accessToken: resultado.accessToken, user: resultado.user },
    };
  }

  @publico()
  @Post('web/refresh')
  @HttpCode(HttpStatus.OK)
  async renovarsesionweb(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.afirmarwebsolicitud(req);
    const tokenrenovacion = this.leerrefreshcookie(req);
    if (!tokenrenovacion) throw new UnauthorizedException('Sesión web expirada');
    const resultado = await this.refreshtokenusocaso.ejecutar({ refreshToken: tokenrenovacion });
    this.establecerrefreshcookie(req, res, resultado.refreshToken, resultado.refreshExpiresAt);
    return {
      statusCode: HttpStatus.OK,
      message: 'Sesión renovada',
      data: { accessToken: resultado.accessToken, user: resultado.user },
    };
  }

  @publico()
  @Post('web/revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revocarsesionweb(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.afirmarwebsolicitud(req);
    const tokenrenovacion = this.leerrefreshcookie(req);
    if (tokenrenovacion)
      await this.revokerefreshtokenusocaso.ejecutar({ refreshToken: tokenrenovacion });
    this.clearrefreshcookie(req, res);
  }

  @publico()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async renovartoken(@Body() dto: dtotokenrenovacion) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens renovados exitosamente',
      data: await this.refreshtokenusocaso.ejecutar(dto),
    };
  }

  @publico()
  @Post('revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revocartoken(@Body() dto: dtotokenrenovacion): Promise<void> {
    await this.revokerefreshtokenusocaso.ejecutar(dto);
  }

  private afirmarwebsolicitud(req: Request): void {
    const origin = req.get('origin');
    const allowedorigins = this.configuracionservicio.get<string[]>('corsOrigins', []);
    if (
      !origin ||
      !allowedorigins.includes(origin) ||
      req.get('x-sigce-web') !== constantewebmarcadorheader
    ) {
      throw new ForbiddenException('Solicitud web no autorizada');
    }
  }

  private leerrefreshcookie(req: Request): string | null {
    const cookieheader = req.headers.cookie;
    if (!cookieheader) return null;
    const nombrecookie = this.obtenernombrecookieweb(req);
    const elemento = cookieheader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${nombrecookie}=`));
    if (!elemento) return null;
    try {
      return decodeURIComponent(elemento.slice(nombrecookie.length + 1));
    } catch {
      return null;
    }
  }

  private obtenernombrecookieweb(req: Request): string {
    const identificadorpestana = req.get('x-sigce-tab')?.trim();
    if (!identificadorpestana) return constantewebrefreshcookie;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identificadorpestana)) {
      throw new ForbiddenException('La sesión de esta pestaña no es válida.');
    }
    return `${constantewebrefreshcookie}_${identificadorpestana.toLowerCase()}`;
  }

  private establecerrefreshcookie(
    req: Request,
    res: Response,
    tokenrenovacion: string,
    venceen: Date,
  ): void {
    const nombrecookie = this.obtenernombrecookieweb(req);
    const samesite = this.configuracionservicio.get<'lax' | 'strict' | 'none'>(
      'webCookieSameSite',
      'lax',
    );
    const esproduction = this.configuracionservicio.get<string>('nodeEnv') === 'production';
    const venceenseconds = Math.max(0, Math.floor((venceen.getTime() - Date.now()) / 1000));
    const segments = [
      `${nombrecookie}=${encodeURIComponent(tokenrenovacion)}`,
      'Path=/api/v1/auth/web',
      'HttpOnly',
      `SameSite=${samesite[0].toUpperCase()}${samesite.slice(1)}`,
      `Max-Age=${venceenseconds}`,
    ];
    if (esproduction || samesite === 'none') segments.push('Secure');
    res.setHeader('Set-Cookie', segments.join('; '));
  }

  private clearrefreshcookie(req: Request, res: Response): void {
    const nombrecookie = this.obtenernombrecookieweb(req);
    const samesite = this.configuracionservicio.get<'lax' | 'strict' | 'none'>(
      'webCookieSameSite',
      'lax',
    );
    const esproduction = this.configuracionservicio.get<string>('nodeEnv') === 'production';
    const segments = [
      `${nombrecookie}=`,
      'Path=/api/v1/auth/web',
      'HttpOnly',
      `SameSite=${samesite[0].toUpperCase()}${samesite.slice(1)}`,
      'Max-Age=0',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ];
    if (esproduction || samesite === 'none') segments.push('Secure');
    res.setHeader('Set-Cookie', segments.join('; '));
  }
}
