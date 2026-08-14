import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '@academic/shared-types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const user = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>().user;
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado para validar permisos');
    }

    const grantedPermissions = await this.prisma.rolePermission.count({
      where: {
        role: user.role as unknown as PrismaUserRole,
        permission: { name: { in: requiredPermissions } },
      },
    });

    if (grantedPermissions !== requiredPermissions.length) {
      throw new ForbiddenException('El usuario no tiene los permisos requeridos');
    }

    return true;
  }
}
