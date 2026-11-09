import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { contenidotokenjwt } from '@academic/shared-types';
import { rolusuario } from '@academic/domain-kernel';
import { usuarioautenticacion } from '../../domain/repositories/autenticacion.repository.interface';
import { emisortokenspuerto, partokens } from '../../application/ports/tokenemisor.port';
import { cargatokenautenticacion } from '../../application/modelos/cargatoken.model';

@Injectable()
export class adaptadoremisiontokensjwt implements emisortokenspuerto {
  constructor(
    private readonly jwtservicio: JwtService,
    private readonly configuracionservicio: ConfigService,
  ) {}

  private sanitizeexpiration(valor: unknown, valoralternativo: string): string | number {
    if (typeof valor === 'number') return valor;
    if (typeof valor !== 'string') return valoralternativo;
    const valorlimpio = valor.trim().replace(/^['"]|['"]$/g, '');
    if (!valorlimpio) return valoralternativo;

    if (/^\d+$/.test(valorlimpio)) {
      const numero = parseInt(valorlimpio, 10);
      if (numero <= 31 && valoralternativo.endsWith('d')) return `${numero}d`;
      if (numero <= 60 && valoralternativo.endsWith('m')) return `${numero}m`;
      return numero;
    }
    return valorlimpio;
  }

  emitirparausuario(
    usuario: Pick<
      usuarioautenticacion,
      'id' | 'email' | 'role' | 'firstName' | 'lastName' | 'credentialVersion'
    >,
    sessionId = randomUUID(),
  ): partokens {
    const carga: contenidotokenjwt = {
      sub: usuario.id,
      sessionId,
      email: usuario.email,
      role: usuario.role as rolusuario,
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      credentialVersion: usuario.credentialVersion,
    };

    const crudoacceso = this.configuracionservicio.get<string>('jwt.accessExpiration', '15m');
    const crudorefresh = this.configuracionservicio.get<string>('jwt.refreshExpiration', '7d');

    const accesoexpiration = this.sanitizeexpiration(
      crudoacceso,
      '15m',
    ) as JwtSignOptions['expiresIn'];
    const refreshexpiration = this.sanitizeexpiration(
      crudorefresh,
      '7d',
    ) as JwtSignOptions['expiresIn'];

    const accesotoken = this.jwtservicio.sign(carga, {
      secret: this.configuracionservicio.getOrThrow<string>('jwt.accessSecret'),
      expiresIn: accesoexpiration,
    });
    const tokenrenovacion = this.jwtservicio.sign(carga, {
      secret: this.configuracionservicio.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: refreshexpiration,
      jwtid: randomUUID(),
    });

    const accessclaims = this.jwtservicio.decode(accesotoken) as { exp?: number } | null;
    if (!accessclaims?.exp)
      throw new Error('El access token no contiene una fecha de expiración');
    const accessvenceen = new Date(accessclaims.exp * 1000);

    const refreshclaims = this.jwtservicio.decode(tokenrenovacion) as { exp?: number } | null;
    if (!refreshclaims?.exp)
      throw new Error('El refresh token no contiene una fecha de expiración');
    const refreshvenceen = new Date(refreshclaims.exp * 1000);

    return {
      sessionId,
      accessToken: accesotoken,
      accessExpiresAt: accessvenceen,
      refreshToken: tokenrenovacion,
      refreshExpiresAt: refreshvenceen,
    };
  }

  verificartokenrenovacion(token: string): cargatokenautenticacion {
    const carga = this.jwtservicio.verify<contenidotokenjwt>(token, {
      secret: this.configuracionservicio.getOrThrow<string>('jwt.refreshSecret'),
    });
    return {
      sub: carga.sub,
      sessionId: carga.sessionId,
      email: carga.email,
      role: carga.role,
      firstName: carga.firstName,
      lastName: carga.lastName,
      credentialVersion: carga.credentialVersion,
    };
  }
}
