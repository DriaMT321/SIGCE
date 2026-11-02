import { errornoautorizado } from '../../../../core/application/aplicacionerror';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { repositorioautenticacion } from '../../domain/repositories/autenticacion.repository.interface';
import { casousocrearregistroauditoria } from '../../../audit/application/use-cases/crearregistroauditoria.use-case';
import { roliniciosesion, dtoiniciosesionporrol } from '../dto/acceso.dto';
import { emisortokenspuerto } from '../ports/tokenemisor.port';
import { casousoiniciarsesionporrol } from './rolacceso.use-case';

describe('RoleLoginUseCase: acceso de estudiante', () => {
  const validosecreto = 'ClaveAsignada2026';
  const usuarioestudiante = {
    id: 'student-user-1',
    email: 'estudiante.sim1@sigce.edu.bo',
    firstName: 'Ana',
    lastName: 'Pérez',
    role: UserRole.STUDENT,
    isActive: true,
    deletedAt: null,
    passwordHash: '',
  };
  const partokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    refreshExpiresAt: new Date(Date.now() + 60_000),
  };
  const repositorio = {
    buscarporidentificadoryrol: jest.fn(),
    creartokenrenovacion: jest.fn().mockResolvedValue(undefined),
  };
  const auditoria = { ejecutar: jest.fn().mockResolvedValue({}) };
  const serviciotokens = { emitirparausuario: jest.fn().mockReturnValue(partokens) };
  const seguridadcredenciales = {
    verificarcontrasena: (contrasena: string, hashcontrasena: string) =>
      bcrypt.compare(contrasena, hashcontrasena),
    resumirtoken: (token: string) => `hash:${token}`,
    resumircontrasena: jest.fn(),
    generartoken: jest.fn(),
  };
  const usocaso = new casousoiniciarsesionporrol(
    repositorio as unknown as repositorioautenticacion,
    auditoria as unknown as casousocrearregistroauditoria,
    serviciotokens as unknown as emisortokenspuerto,
    seguridadcredenciales,
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    repositorio.buscarporidentificadoryrol.mockResolvedValue({
      ...usuarioestudiante,
      passwordHash: await bcrypt.hash(validosecreto, 4),
    });
  });

  it.each(Object.values(roliniciosesion))(
    'exige contraseña para el rol %s antes de emitir tokens',
    async (rol) => {
      await expect(usocaso.ejecutar({ role: rol, identifier: 'cuenta-prueba' })).rejects.toThrow(
        errornoautorizado,
      );

      expect(serviciotokens.emitirparausuario).not.toHaveBeenCalled();
      expect(repositorio.creartokenrenovacion).not.toHaveBeenCalled();
    },
  );

  it('rechaza RUDE/CI sin la clave asignada y no emite tokens', async () => {
    await expect(
      usocaso.ejecutar({
        role: roliniciosesion.STUDENT,
        identifier: 'SIM-2026-001',
      } satisfies dtoiniciosesionporrol),
    ).rejects.toThrow(errornoautorizado);

    expect(repositorio.buscarporidentificadoryrol).toHaveBeenCalledWith(
      roliniciosesion.STUDENT,
      'SIM-2026-001',
      undefined,
    );
    expect(serviciotokens.emitirparausuario).not.toHaveBeenCalled();
    expect(repositorio.creartokenrenovacion).not.toHaveBeenCalled();
    expect(auditoria.ejecutar).not.toHaveBeenCalled();
  });

  it('rechaza una clave incorrecta sin guardar sesión', async () => {
    await expect(
      usocaso.ejecutar({
        role: roliniciosesion.STUDENT,
        identifier: 'SIM-2026-001',
        secret: 'ClaveIncorrecta',
      } satisfies dtoiniciosesionporrol),
    ).rejects.toThrow(errornoautorizado);

    expect(serviciotokens.emitirparausuario).not.toHaveBeenCalled();
    expect(repositorio.creartokenrenovacion).not.toHaveBeenCalled();
  });

  it('acepta la clave asignada y registra la sesión', async () => {
    const resultado = await usocaso.ejecutar({
      role: roliniciosesion.STUDENT,
      identifier: 'SIM-2026-001',
      secret: validosecreto,
    } satisfies dtoiniciosesionporrol);

    expect(resultado.accessToken).toBe(partokens.accessToken);
    expect(resultado.user.id).toBe(usuarioestudiante.id);
    expect(repositorio.creartokenrenovacion).toHaveBeenCalledTimes(1);
    expect(auditoria.ejecutar).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: usuarioestudiante.id,
        newValue: expect.objectContaining({ loginRole: roliniciosesion.STUDENT }),
      }),
    );
  });

  it('rechaza el acceso familiar si solo se presentan CI y teléfono', async () => {
    repositorio.buscarporidentificadoryrol.mockResolvedValue({
      ...usuarioestudiante,
      passwordHash: await bcrypt.hash(validosecreto, 4),
    });

    await expect(
      usocaso.ejecutar({
        role: roliniciosesion.FAMILY,
        identifier: '1234567',
        secondaryIdentifier: '70000000',
      } satisfies dtoiniciosesionporrol),
    ).rejects.toThrow(errornoautorizado);

    expect(repositorio.buscarporidentificadoryrol).toHaveBeenCalledWith(
      roliniciosesion.FAMILY,
      '1234567',
      '70000000',
    );
    expect(serviciotokens.emitirparausuario).not.toHaveBeenCalled();
  });

  it('valida la contraseña familiar antes de emitir tokens', async () => {
    repositorio.buscarporidentificadoryrol.mockResolvedValue({
      ...usuarioestudiante,
      passwordHash: await bcrypt.hash(validosecreto, 4),
    });

    const resultado = await usocaso.ejecutar({
      role: roliniciosesion.FAMILY,
      identifier: '1234567',
      secondaryIdentifier: '70000000',
      secret: validosecreto,
    } satisfies dtoiniciosesionporrol);

    expect(resultado.accessToken).toBe(partokens.accessToken);
    expect(serviciotokens.emitirparausuario).toHaveBeenCalledTimes(1);
    expect(repositorio.creartokenrenovacion).toHaveBeenCalledTimes(1);
  });
});
