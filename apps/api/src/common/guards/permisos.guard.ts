import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { servicioprisma } from '../database/prisma.service';
import { constanteclavepermisos } from '../decorators/permisos.decorator';
import { usuarioautenticado } from '@academic/shared-types';

@Injectable()
export class guardiapermisos implements CanActivate {
  constructor(
    private readonly lectormetadatos: Reflector,
    private readonly clienteprisma: servicioprisma,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const permisosrequeridos = this.lectormetadatos.getAllAndOverride<string[]>(
      constanteclavepermisos,
      [contexto.getHandler(), contexto.getClass()],
    );

    if (!permisosrequeridos || permisosrequeridos.length === 0) {
      return true;
    }

    const usuario = contexto.switchToHttp().getRequest<{ user?: usuarioautenticado }>().user;
    if (!usuario) {
      throw new ForbiddenException('Usuario no autenticado para validar permisos');
    }

    const permisosotorgados = await this.clienteprisma.rolePermission.count({
      where: {
        role: usuario.role as unknown as PrismaUserRole,
        permission: { name: { in: permisosrequeridos } },
      },
    });

    if (permisosotorgados !== permisosrequeridos.length) {
      throw new ForbiddenException('El usuario no tiene los permisos requeridos');
    }

    return true;
  }
}
