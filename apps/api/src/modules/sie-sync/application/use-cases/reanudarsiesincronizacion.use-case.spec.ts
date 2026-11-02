import { casousoreanudarsincronizacionsie } from './reanudarsiesincronizacion.use-case';
import type { puertocolasincronizacionsie } from '../ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from '../ports/publicadorprogresosincronizacionsie.port';

describe('ResumeSieSyncUseCase', () => {
  it('reencola las notas pendientes y publica el lote reanudado', async () => {
    const tarea = {
      synchronizationId: 'sync-1',
      itemId: 'item-2',
      studentRude: 'RUDE-2',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT',
      localGrade: 84,
    };
    const repositorio = {
      reanudarsincronizacionpausada: jest.fn().mockResolvedValue({
        synchronizationId: 'sync-1',
        totalItems: 3,
        status: 'QUEUED',
        jobs: [tarea],
      }),
    };
    const cola: jest.Mocked<puertocolasincronizacionsie> = {
      encolar: jest.fn().mockResolvedValue(['item-2']),
    };
    const publicador: jest.Mocked<puertopublicadorprogresosincronizacionsie> = {
      publicarencolados: jest.fn(),
    };
    const usocaso = new casousoreanudarsincronizacionsie(repositorio as never, cola, publicador);

    await expect(
      usocaso.ejecutar({
        synchronizationId: 'sync-1',
        userId: 'admin-1',
        reason: 'Se revisó el grupo de matemática.',
      }),
    ).resolves.toEqual({ synchronizationId: 'sync-1', jobIds: ['item-2'], status: 'QUEUED' });
    expect(cola.encolar).toHaveBeenCalledWith([tarea]);
    expect(publicador.publicarencolados).toHaveBeenCalledWith({
      synchronizationId: 'sync-1',
      total: 3,
    });
  });

  it('no crea trabajo ni anuncia una cola cuando quedan elementos en proceso', async () => {
    const repositorio = {
      reanudarsincronizacionpausada: jest.fn().mockResolvedValue({
        synchronizationId: 'sync-2',
        totalItems: 3,
        status: 'PROCESSING',
        jobs: [],
      }),
    };
    const cola: jest.Mocked<puertocolasincronizacionsie> = {
      encolar: jest.fn().mockResolvedValue([]),
    };
    const publicador: jest.Mocked<puertopublicadorprogresosincronizacionsie> = {
      publicarencolados: jest.fn(),
    };
    const usocaso = new casousoreanudarsincronizacionsie(repositorio as never, cola, publicador);

    await expect(
      usocaso.ejecutar({
        synchronizationId: 'sync-2',
        userId: 'admin-1',
        reason: 'Se resolvieron las discrepancias.',
      }),
    ).resolves.toEqual({ synchronizationId: 'sync-2', jobIds: [], status: 'PROCESSING' });
    expect(cola.encolar).not.toHaveBeenCalled();
    expect(publicador.publicarencolados).not.toHaveBeenCalled();
  });
});
