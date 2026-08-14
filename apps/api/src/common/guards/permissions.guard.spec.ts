import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../database/prisma.service';
import { PermissionsGuard } from './permissions.guard';

function createContext(): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 'user-1', role: 'ADMIN' } }),
    }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  it('permite el acceso cuando el rol posee todos los permisos requeridos', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['users:read', 'audit:read']),
    };
    const prisma = {
      rolePermission: { count: jest.fn().mockResolvedValue(2) },
    };
    const guard = new PermissionsGuard(
      reflector as unknown as Reflector,
      prisma as unknown as PrismaService,
    );

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
  });

  it('rechaza el acceso cuando falta un permiso', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['users:read']) };
    const prisma = { rolePermission: { count: jest.fn().mockResolvedValue(0) } };
    const guard = new PermissionsGuard(
      reflector as unknown as Reflector,
      prisma as unknown as PrismaService,
    );

    await expect(guard.canActivate(createContext())).rejects.toThrow('permisos requeridos');
  });
});
