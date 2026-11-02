import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { servicioprisma } from '../database/prisma.service';
import { guardiapermisos } from './permisos.guard';

function crearcontexto(): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 'user-1', role: 'ADMINISTRATIVE' } }),
    }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  it('permite el acceso cuando el rol posee todos los permisos requeridos', async () => {
    const lectormetadatos = {
      getAllAndOverride: jest.fn().mockReturnValue(['users:read', 'audit:read']),
    };
    const clienteprisma = {
      rolePermission: { count: jest.fn().mockResolvedValue(2) },
    };
    const guard = new guardiapermisos(
      lectormetadatos as unknown as Reflector,
      clienteprisma as unknown as servicioprisma,
    );

    await expect(guard.canActivate(crearcontexto())).resolves.toBe(true);
  });

  it('rechaza el acceso cuando falta un permiso', async () => {
    const lectormetadatos = { getAllAndOverride: jest.fn().mockReturnValue(['users:read']) };
    const clienteprisma = { rolePermission: { count: jest.fn().mockResolvedValue(0) } };
    const guard = new guardiapermisos(
      lectormetadatos as unknown as Reflector,
      clienteprisma as unknown as servicioprisma,
    );

    await expect(guard.canActivate(crearcontexto())).rejects.toThrow('permisos requeridos');
  });
});
