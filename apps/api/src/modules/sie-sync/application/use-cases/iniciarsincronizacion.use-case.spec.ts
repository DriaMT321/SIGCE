import { casousoiniciarsincronizacionsie } from './iniciarsincronizacion.use-case';
import type { repositoriosincronizacionsie } from '../ports/repositoriosincronizacionsie';
import type { puertocolasincronizacionsie } from '../ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from '../ports/publicadorprogresosincronizacionsie.port';

describe('TriggerSieSyncUseCase', () => {
  const filtros = {
    idgestionacademica: 'year-1',
    numeroperiodo: 1,
    claveidempotencia: 'request-key-1',
    solicitadoporid: 'user-1',
    confirmarenvio: true,
    huellaprevia: 'f'.repeat(64),
    cantidadcalificacionesesperada: 2,
  };

  it('encola el lote confirmado y publica el progreso después de encolarlo', async () => {
    const repositorio: jest.Mocked<repositoriosincronizacionsie> = {
      creardesdecalificaciones: jest.fn().mockResolvedValue({
        synchronization: { id: 'sync-1', status: 'QUEUED', totalItems: 2 } as never,
        jobs: [
          {
            synchronizationId: 'sync-1',
            itemId: 'item-1',
            studentRude: 'RUDE-1',
            academicYear: 2026,
            periodNumber: 1,
            subjectCode: 'MAT',
            localGrade: 85,
          },
          {
            synchronizationId: 'sync-1',
            itemId: 'item-2',
            studentRude: 'RUDE-2',
            academicYear: 2026,
            periodNumber: 1,
            subjectCode: 'LEN',
            localGrade: 78,
          },
        ],
        reutilizado: false,
      }),
      buscarporidentificador: jest.fn(),
      buscartodos: jest.fn(),
      buscartrabajosencola: jest.fn(),
      reintentarelementofallido: jest.fn(),
      reanudarsincronizacionpausada: jest.fn(),
      previsualizardesdecalificaciones: jest.fn(),
      resolverdiscrepancia: jest.fn(),
      resolvergrupodiscrepancias: jest.fn(),
    };
    const cola: jest.Mocked<puertocolasincronizacionsie> = {
      encolar: jest.fn().mockResolvedValue(['item-1', 'item-2']),
    };
    const publicador: jest.Mocked<puertopublicadorprogresosincronizacionsie> = {
      publicarencolados: jest.fn(),
    };
    const usocaso = new casousoiniciarsincronizacionsie(repositorio, cola, publicador);

    const resultado = await usocaso.ejecutar(filtros);

    expect(repositorio.creardesdecalificaciones).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmSend: true,
        academicYearId: 'year-1',
        expectedFingerprint: 'f'.repeat(64),
        requestedById: 'user-1',
        idempotencyKey: 'request-key-1',
        syncType: 'GRADES',
      }),
    );
    expect(cola.encolar).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ itemId: 'item-1' }),
        expect.objectContaining({ itemId: 'item-2' }),
      ]),
    );
    expect(publicador.publicarencolados).toHaveBeenCalledWith({
      synchronizationId: 'sync-1',
      total: 2,
    });
    expect(resultado).toEqual(
      expect.objectContaining({ synchronizationId: 'sync-1', totalItems: 2, status: 'QUEUED' }),
    );
  });

  it('rechaza el envío si no hubo confirmación expresa', async () => {
    const repositorio = {
      creardesdecalificaciones: jest.fn(),
    } as unknown as repositoriosincronizacionsie;
    const cola = { encolar: jest.fn() } as unknown as puertocolasincronizacionsie;
    const publicador = {
      publicarencolados: jest.fn(),
    } as unknown as puertopublicadorprogresosincronizacionsie;
    const usocaso = new casousoiniciarsincronizacionsie(repositorio, cola, publicador);

    await expect(usocaso.ejecutar({ ...filtros, confirmarenvio: false })).rejects.toThrow(
      'Debe confirmar el resumen',
    );
    expect(repositorio.creardesdecalificaciones).not.toHaveBeenCalled();
    expect(cola.encolar).not.toHaveBeenCalled();
  });

  it('no encola si no hay notas elegibles', async () => {
    const repositorio = {
      creardesdecalificaciones: jest.fn().mockResolvedValue(null),
    } as unknown as repositoriosincronizacionsie;
    const cola = { encolar: jest.fn() } as unknown as puertocolasincronizacionsie;
    const publicador = {
      publicarencolados: jest.fn(),
    } as unknown as puertopublicadorprogresosincronizacionsie;
    const usocaso = new casousoiniciarsincronizacionsie(repositorio, cola, publicador);

    await expect(usocaso.ejecutar(filtros)).rejects.toThrow('No existen calificaciones aptas');
    expect(cola.encolar).not.toHaveBeenCalled();
  });

  it('devuelve el lote previo sin duplicarlo cuando se repite la clave', async () => {
    const repositorio = {
      creardesdecalificaciones: jest.fn().mockResolvedValue({
        synchronization: { id: 'sync-1', status: 'VERIFIED', totalItems: 2 },
        jobs: [],
        reutilizado: true,
      }),
    } as unknown as repositoriosincronizacionsie;
    const cola = { encolar: jest.fn() } as unknown as puertocolasincronizacionsie;
    const publicador = {
      publicarencolados: jest.fn(),
    } as unknown as puertopublicadorprogresosincronizacionsie;
    const usocaso = new casousoiniciarsincronizacionsie(repositorio, cola, publicador);

    await expect(usocaso.ejecutar(filtros)).resolves.toMatchObject({
      synchronizationId: 'sync-1',
      status: 'VERIFIED',
      totalItems: 2,
    });
    expect(cola.encolar).not.toHaveBeenCalled();
    expect(publicador.publicarencolados).not.toHaveBeenCalled();
  });

  it('exige reducir el lote cuando excede el tamaño operativo', async () => {
    const repositorio = {
      creardesdecalificaciones: jest.fn(),
    } as unknown as repositoriosincronizacionsie;
    const cola = { encolar: jest.fn() } as unknown as puertocolasincronizacionsie;
    const publicador = {
      publicarencolados: jest.fn(),
    } as unknown as puertopublicadorprogresosincronizacionsie;
    const usocaso = new casousoiniciarsincronizacionsie(repositorio, cola, publicador);

    await expect(
      usocaso.ejecutar({ ...filtros, cantidadcalificacionesesperada: 51 }),
    ).rejects.toThrow('máximo de 50 calificaciones');
    expect(repositorio.creardesdecalificaciones).not.toHaveBeenCalled();
    expect(cola.encolar).not.toHaveBeenCalled();
  });
});
