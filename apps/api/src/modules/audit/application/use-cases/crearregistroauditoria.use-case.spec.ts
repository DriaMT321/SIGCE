import { casousocrearregistroauditoria } from './crearregistroauditoria.use-case';
import { repositorioregistroauditoria } from '../../domain/repositories/registroauditoria.repository.interface';
import { entidadregistroauditoria } from '../../domain/entities/registroauditoria.entity';
import { accionauditoria } from '@academic/shared-types';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';

describe('CreateAuditLogUseCase', () => {
  let usocaso: casousocrearregistroauditoria;
  let simuladorepo: jest.Mocked<repositorioregistroauditoria>;
  let contextocorrelacion: contextoidentificadorcorrelacionlocal;

  beforeEach(() => {
    simuladorepo = {
      crear: jest.fn().mockImplementation(async (entidad: entidadregistroauditoria) => entidad),
      buscartodos: jest.fn(),
      buscarporidentificador: jest.fn(),
    };
    contextocorrelacion = new contextoidentificadorcorrelacionlocal();
    usocaso = new casousocrearregistroauditoria(contextocorrelacion, simuladorepo);
  });

  it('debe registrar un evento de auditoría correctamente', async () => {
    const resultado = await usocaso.ejecutar({
      userId: 'user-123',
      action: accionauditoria.UPDATE,
      entity: 'Grade',
      entityId: 'grade-456',
      previousValue: { score: 70 },
      newValue: { score: 85 },
      ipAddress: '127.0.0.1',
    });

    expect(simuladorepo.crear).toHaveBeenCalledTimes(1);
    expect(resultado.entity).toBe('Grade');
    expect(resultado.action).toBe(accionauditoria.UPDATE);
    expect(resultado.previousValue).toEqual({ score: 70 });
    expect(resultado.newValue).toEqual({ score: 85 });
  });

  it('asocia el identificador de la petición cuando la operación no envía uno explícito', async () => {
    await contextocorrelacion.ejecutar('request-correlation-1', () =>
      usocaso.ejecutar({
        userId: 'user-123',
        action: accionauditoria.UPDATE,
        entity: 'Student',
        entityId: 'student-456',
      }),
    );

    expect(simuladorepo.crear).toHaveBeenCalledWith(
      expect.objectContaining({ correlationId: 'request-correlation-1' }),
    );
  });
});
