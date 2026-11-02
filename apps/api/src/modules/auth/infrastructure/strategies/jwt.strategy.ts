import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { contenidotokenjwt, usuarioautenticado } from '@academic/shared-types';

@Injectable()
export class estrategiajwt extends PassportStrategy(Strategy) {
  constructor(
    private readonly configuracionservicio: ConfigService,
    private readonly prisma: servicioprisma,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuracionservicio.getOrThrow<string>('jwt.accessSecret'),
    });
  }

  async validate(carga: contenidotokenjwt): Promise<usuarioautenticado> {
    if (!carga.sessionId) throw new UnauthorizedException('Sesión no válida');
    const sesion = await this.prisma.authSession.findFirst({
      where: { id: carga.sessionId, userId: carga.sub, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true },
    });
    if (!sesion) throw new UnauthorizedException('Sesión cerrada o expirada');
    const usuario = await this.prisma.user.findUnique({
      where: { id: carga.sub },
    });

    if (
      !usuario ||
      !usuario.isActive ||
      usuario.deletedAt ||
      usuario.passwordSetupRequired ||
      ((carga.credentialVersion !== undefined || usuario.credentialVersion !== 0) &&
        carga.credentialVersion !== usuario.credentialVersion)
    ) {
      throw new UnauthorizedException('Usuario no autorizado o inactivo');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role as unknown as usuarioautenticado['role'],
      firstName: usuario.firstName,
      lastName: usuario.lastName,
    };
  }
}
