import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolusuario } from '@academic/shared-types';
import { constanteclaveroles } from '../decorators/roles.decorator';

@Injectable()
export class guardiaroles implements CanActivate {
  constructor(private lectormetadatos: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const rolesrequeridos = this.lectormetadatos.getAllAndOverride<rolusuario[]>(
      constanteclaveroles,
      [contexto.getHandler(), contexto.getClass()],
    );

    if (!rolesrequeridos || rolesrequeridos.length === 0) {
      return true;
    }

    const { user: usuario } = contexto.switchToHttp().getRequest();

    if (!usuario) {
      throw new ForbiddenException('Usuario no autenticado para validar permisos de rol');
    }

    const tienerol = rolesrequeridos.includes(usuario.role);
    if (!tienerol) {
      throw new ForbiddenException(
        `Acceso denegado: Se requiere uno de los roles [${rolesrequeridos.join(', ')}], pero el usuario tiene rol [${usuario.role}]`,
      );
    }

    return true;
  }
}
