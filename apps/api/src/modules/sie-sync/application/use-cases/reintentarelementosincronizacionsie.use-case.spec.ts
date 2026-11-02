import { casousoreintentarelementosincronizacionsie } from './reintentarelementosincronizacionsie.use-case';
import type { puertocolasincronizacionsie } from '../ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from '../ports/publicadorprogresosincronizacionsie.port';

describe('RetrySieSyncItemUseCase', () => {
  it('registra el reintento antes de encolarlo y publica el progreso', async () => {
    const tarea = {
      synchronizationId: 'sync-1',
      itemId: 'item-1',
      studentRude: 'RUDE-1',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT',
      localGrade: 85,
    };
    const repositorio = { reintentarelementofallido: jest.fn().mockResolvedValue(tarea) };
    const cola: jest.Mocked<puertocolasincronizacionsie> = {
      encolar: jest.fn().mockResolvedValue(['item-1']),
    };
    const publicador: jest.Mocked<puertopublicadorprogresosincronizacionsie> = {
      publicarencolados: jest.fn(),
    };
    const usocaso = new casousoreintentarelementosincronizacionsie(
      repositorio as never,
      cola,
      publicador,
    );

    const resultado = await usocaso.ejecutar({
      itemId: 'item-1',
      userId: 'admin-1',
      reason: 'Se corrigió la configuración local.',
    });

    expect(repositorio.reintentarelementofallido).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: 'item-1', userId: 'admin-1' }),
    );
    expect(cola.encolar).toHaveBeenCalledWith([tarea]);
    expect(publicador.publicarencolados).toHaveBeenCalledWith({
      synchronizationId: 'sync-1',
      total: 1,
    });
    expect(resultado).toEqual({ synchronizationId: 'sync-1', itemId: 'item-1', jobId: 'item-1' });
  });
});
