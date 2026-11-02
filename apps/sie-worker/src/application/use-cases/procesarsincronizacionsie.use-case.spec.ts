import { casousoprocesarsincronizacionsie } from './procesarsincronizacionsie.use-case';
import { puertoautomatizacionsie } from '../ports/automatizacionsie.port';
import { estadosincronizacionsie } from '@academic/domain-kernel';
import { trabajoprocesamientosie } from '../modelos/sincronizacion.model';
import { PrismaClient, SieSyncStatus as PrismaSieSyncStatus } from '@prisma/client';
import { errorautenticacionsierequerida } from '../../domain/errors/autenticacionsierequerida.error';
import { adaptadorprismaprocesamientosie } from '../../infrastructure/persistence/adaptadorprismaprocesamientosie.adapter';

const primerTrabajo: trabajoprocesamientosie = {
  synchronizationId: 'sync-1',
  itemId: 'item-1',
  studentRude: 'SIM-2026-001',
  academicYear: 2026,
  periodNumber: 1,
  subjectCode: 'MAT-SEC',
  localGrade: 85,
};

describe('CasoUsoProcesarSincronizacionSIE', () => {
  let casoUso: casousoprocesarsincronizacionsie;
  let puertoSimulado: jest.Mocked<puertoautomatizacionsie>;
  let prismaSimulado: {
    sieSynchronizationItem: { updateMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    sieSynchronization: { findUnique: jest.Mock; update: jest.Mock; updateMany: jest.Mock };
    sieDiscrepancyGroup: { upsert: jest.Mock };
    grade: { findFirst: jest.Mock };
    auditLog: { create: jest.Mock; findFirst: jest.Mock };
    $queryRaw: jest.Mock;
    $transaction: jest.Mock;
  };
  let contadores: {
    processedItems: number;
    discrepancyCount: number;
    errorCount: number;
    totalItems: number;
  };

  beforeEach(() => {
    contadores = { processedItems: 0, discrepancyCount: 0, errorCount: 0, totalItems: 2 };
    puertoSimulado = {
      inicializar: jest.fn(),
      procesarsincronizacioncalificacion: jest
        .fn()
        .mockImplementation(async (trabajo: trabajoprocesamientosie) => ({
          synchronizationId: trabajo.synchronizationId,
          itemId: trabajo.itemId,
          studentRude: trabajo.studentRude,
          localValue: trabajo.localGrade,
          sieValue: trabajo.localGrade,
          status: estadosincronizacionsie.VERIFIED,
          isMatched: true,
          source: 'LOCAL_SIE_SIMULATION',
          verifiedAt: new Date().toISOString(),
        })),
      cerrar: jest.fn(),
    };

    prismaSimulado = {
      sieSynchronizationItem: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue({
          id: 'item-1',
          studentId: 'student-1',
          subjectId: 'subject-1',
          periodId: 'period-1',
          status: PrismaSieSyncStatus.VERIFIED,
          localValue: 85,
          sieValue: 85,
          errorMessage: null,
          verifiedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      sieSynchronization: {
        findUnique: jest.fn().mockResolvedValue({ status: PrismaSieSyncStatus.PROCESSING }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        update: jest.fn().mockImplementation(
          async (argumentos: {
            data: {
              processedItems?: { increment: number };
              discrepancyCount?: { increment: number };
              errorCount?: { increment: number };
              status?: PrismaSieSyncStatus;
              pausedAt?: Date | null;
              pausedReason?: string | null;
              completedAt?: Date | null;
            };
          }) => {
            contadores.processedItems += argumentos.data.processedItems?.increment ?? 0;
            contadores.discrepancyCount += argumentos.data.discrepancyCount?.increment ?? 0;
            contadores.errorCount += argumentos.data.errorCount?.increment ?? 0;
            return { ...contadores, requestedById: 'actor-1' };
          },
        ),
      },
      sieDiscrepancyGroup: { upsert: jest.fn().mockResolvedValue({ id: 'group-1' }) },
      grade: { findFirst: jest.fn().mockResolvedValue({ enrollment: { courseId: 'course-1' } }) },
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
        findFirst: jest.fn().mockResolvedValue({
          newValue: { event: 'CONFIRMED_BEFORE_ENQUEUE', source: 'LOCAL_SIE_SIMULATION' },
        }),
      },
      $queryRaw: jest.fn().mockResolvedValue([{ status: PrismaSieSyncStatus.PROCESSING }]),
      $transaction: jest.fn(),
    };
    prismaSimulado.$transaction.mockImplementation(
      async (funcion: (transaccion: typeof prismaSimulado) => Promise<unknown>) =>
        funcion(prismaSimulado),
    );
    casoUso = new casousoprocesarsincronizacionsie(
      puertoSimulado,
      new adaptadorprismaprocesamientosie(prismaSimulado as unknown as PrismaClient),
      1,
      72,
    );
  });

  it('pausa el lote local antes de usar un adaptador configurado para el SIE real', async () => {
    const trabajadorreal = new casousoprocesarsincronizacionsie(
      puertoSimulado,
      new adaptadorprismaprocesamientosie(prismaSimulado as unknown as PrismaClient),
      1,
      72,
      'SIE_REAL',
    );

    await expect(trabajadorreal.ejecutar(primerTrabajo)).rejects.toThrow(
      'El lote quedó pausado porque su destino no coincide',
    );
    expect(puertoSimulado.procesarsincronizacioncalificacion).not.toHaveBeenCalled();
    expect(prismaSimulado.sieSynchronization.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'sync-1' }),
        data: expect.objectContaining({ status: PrismaSieSyncStatus.PAUSED }),
      }),
    );
  });

  it('pausa un lote cuyo destino no consta en su confirmación', async () => {
    prismaSimulado.auditLog.findFirst.mockResolvedValue(null);

    await expect(casoUso.ejecutar(primerTrabajo)).rejects.toThrow(
      'El lote quedó pausado porque su destino no coincide',
    );
    expect(puertoSimulado.procesarsincronizacioncalificacion).not.toHaveBeenCalled();
    expect(prismaSimulado.sieSynchronization.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: PrismaSieSyncStatus.PAUSED }),
      }),
    );
  });

  it('pausa un lote real si solamente está disponible el adaptador local', async () => {
    prismaSimulado.auditLog.findFirst.mockResolvedValue({
      newValue: { event: 'CONFIRMED_BEFORE_ENQUEUE', source: 'SIE_REAL' },
    });

    await expect(casoUso.ejecutar(primerTrabajo)).rejects.toThrow(
      'El lote quedó pausado porque su destino no coincide',
    );
    expect(puertoSimulado.procesarsincronizacioncalificacion).not.toHaveBeenCalled();
    expect(prismaSimulado.sieSynchronization.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: PrismaSieSyncStatus.PAUSED }),
      }),
    );
  });

  it('mantiene la sincronización en proceso hasta terminar todos los ítems', async () => {
    await casoUso.ejecutar(primerTrabajo);

    expect(contadores.processedItems).toBe(1);
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenCalledTimes(1);
    expect(prismaSimulado.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'actor-1',
          correlationId: 'sync-1',
          newValue: expect.objectContaining({ source: 'LOCAL_SIE_SIMULATION' }),
        }),
      }),
    );

    await casoUso.ejecutar({ ...primerTrabajo, itemId: 'item-2', studentRude: 'SIM-2026-002' });

    expect(contadores.processedItems).toBe(2);
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: PrismaSieSyncStatus.VERIFIED }),
      }),
    );
  });

  it('termina en DISCREPANCY si uno de los ítems difiere del valor local', async () => {
    contadores.totalItems = 1;
    puertoSimulado.procesarsincronizacioncalificacion.mockResolvedValueOnce({
      synchronizationId: primerTrabajo.synchronizationId,
      itemId: primerTrabajo.itemId,
      studentRude: primerTrabajo.studentRude,
      localValue: 84,
      sieValue: 85,
      status: estadosincronizacionsie.DISCREPANCY,
      isMatched: false,
      source: 'LOCAL_SIE_SIMULATION',
      errorMessage: 'La calificación local difiere de la página SIE simulada',
      verifiedAt: new Date().toISOString(),
    });

    const resultado = await casoUso.ejecutar({ ...primerTrabajo, localGrade: 84 });

    expect(resultado.sieValue).toBe(85);
    expect(contadores.discrepancyCount).toBe(1);
    expect(contadores.errorCount).toBe(0);
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: PrismaSieSyncStatus.DISCREPANCY }),
      }),
    );
  });

  it('espera al segundo ítem antes de cerrar una sincronización con errores', async () => {
    puertoSimulado.procesarsincronizacioncalificacion.mockResolvedValueOnce({
      synchronizationId: primerTrabajo.synchronizationId,
      itemId: primerTrabajo.itemId,
      studentRude: primerTrabajo.studentRude,
      localValue: 84,
      sieValue: 85,
      status: estadosincronizacionsie.DISCREPANCY,
      isMatched: false,
      source: 'LOCAL_SIE_SIMULATION',
      verifiedAt: new Date().toISOString(),
    });

    await casoUso.ejecutar({ ...primerTrabajo, localGrade: 84 });
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenCalledTimes(1);

    await casoUso.ejecutar({ ...primerTrabajo, itemId: 'item-2', studentRude: 'SIM-2026-002' });
    expect(contadores).toMatchObject({ processedItems: 2, discrepancyCount: 1, errorCount: 0 });
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: PrismaSieSyncStatus.DISCREPANCY }),
      }),
    );
  });

  it('agrupa discrepancias y pausa los ítems restantes cuando supera el umbral', async () => {
    puertoSimulado.procesarsincronizacioncalificacion.mockResolvedValueOnce({
      synchronizationId: primerTrabajo.synchronizationId,
      itemId: primerTrabajo.itemId,
      studentRude: primerTrabajo.studentRude,
      localValue: 84,
      sieValue: 85,
      status: estadosincronizacionsie.DISCREPANCY,
      isMatched: false,
      source: 'LOCAL_SIE_SIMULATION',
      verifiedAt: new Date().toISOString(),
    });
    const casoUsoConUmbral = new casousoprocesarsincronizacionsie(
      puertoSimulado,
      new adaptadorprismaprocesamientosie(prismaSimulado as unknown as PrismaClient),
      0.2,
      24,
    );

    await casoUsoConUmbral.ejecutar({ ...primerTrabajo, localGrade: 84 });

    expect(prismaSimulado.sieDiscrepancyGroup.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          synchronizationId_courseId_subjectId_periodId: {
            synchronizationId: 'sync-1',
            courseId: 'course-1',
            subjectId: 'subject-1',
            periodId: 'period-1',
          },
        },
        create: expect.objectContaining({ assignedToId: 'actor-1', dueAt: expect.any(Date) }),
      }),
    );
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PrismaSieSyncStatus.PAUSED,
          pausedAt: expect.any(Date),
        }),
      }),
    );
    expect(prismaSimulado.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newValue: expect.objectContaining({
            event: 'BATCH_PAUSED_FOR_DISCREPANCIES',
            threshold: 0.2,
          }),
        }),
      }),
    );
  });

  it('no procesa ni cambia un ítem mientras su lote está pausado', async () => {
    prismaSimulado.sieSynchronization.findUnique.mockResolvedValueOnce({
      status: PrismaSieSyncStatus.PAUSED,
    });

    const resultado = await casoUso.ejecutar(primerTrabajo);

    expect(resultado).toMatchObject({ status: estadosincronizacionsie.PAUSED, skipped: true });
    expect(prismaSimulado.sieSynchronizationItem.updateMany).not.toHaveBeenCalled();
    expect(puertoSimulado.procesarsincronizacioncalificacion).not.toHaveBeenCalled();
  });

  it('no reclama un ítem si el lote se pausó antes de tomarlo', async () => {
    prismaSimulado.$queryRaw.mockResolvedValueOnce([{ status: PrismaSieSyncStatus.PAUSED }]);
    const repositorio = new adaptadorprismaprocesamientosie(
      prismaSimulado as unknown as PrismaClient,
    );

    await expect(repositorio.reclamarelemento('sync-1', 'item-1')).resolves.toEqual({
      tipo: 'nodisponible',
    });
    expect(prismaSimulado.sieSynchronizationItem.updateMany).not.toHaveBeenCalled();
  });

  it('no entrega un segundo reclamo mientras el arrendamiento vigente pertenece a otro trabajo', async () => {
    const vencimiento = new Date(Date.now() + 60_000);
    prismaSimulado.$queryRaw.mockResolvedValueOnce([{ status: PrismaSieSyncStatus.PROCESSING }]);
    prismaSimulado.sieSynchronizationItem.updateMany.mockResolvedValueOnce({ count: 0 });
    prismaSimulado.sieSynchronizationItem.findUnique.mockResolvedValueOnce({
      status: PrismaSieSyncStatus.PROCESSING,
      processingLeaseUntil: vencimiento,
      updatedAt: new Date(),
    });
    const repositorio = new adaptadorprismaprocesamientosie(
      prismaSimulado as unknown as PrismaClient,
    );

    const reclamo = await repositorio.reclamarelemento('sync-1', 'item-1');

    expect(reclamo).toEqual({ tipo: 'ocupado', esperarmilisegundos: expect.any(Number) });
    expect(reclamo.tipo === 'ocupado' && reclamo.esperarmilisegundos).toBeGreaterThan(0);
    expect(prismaSimulado.sieSynchronizationItem.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'item-1',
          synchronizationId: 'sync-1',
          OR: expect.arrayContaining([
            expect.objectContaining({ status: PrismaSieSyncStatus.PROCESSING }),
          ]),
        }),
      }),
    );
  });

  it('recupera un ítem PROCESSING cuando venció su arrendamiento', async () => {
    prismaSimulado.$queryRaw.mockResolvedValueOnce([{ status: PrismaSieSyncStatus.PROCESSING }]);
    prismaSimulado.sieSynchronizationItem.updateMany.mockResolvedValueOnce({ count: 1 });
    const repositorio = new adaptadorprismaprocesamientosie(
      prismaSimulado as unknown as PrismaClient,
    );

    const reclamo = await repositorio.reclamarelemento('sync-1', 'item-1');

    expect(reclamo).toEqual({ tipo: 'reclamado', token: expect.any(String) });
    expect(prismaSimulado.sieSynchronizationItem.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              status: PrismaSieSyncStatus.PROCESSING,
              OR: expect.arrayContaining([
                expect.objectContaining({ processingLeaseUntil: expect.any(Object) }),
              ]),
            }),
          ]),
        }),
        data: expect.objectContaining({
          status: PrismaSieSyncStatus.PROCESSING,
          processingToken: expect.any(String),
          processingLeaseUntil: expect.any(Date),
        }),
      }),
    );
  });

  it('guarda el resultado de un trabajo en curso sin reabrir un lote pausado', async () => {
    prismaSimulado.sieSynchronization.findUnique.mockResolvedValueOnce({
      status: PrismaSieSyncStatus.PAUSED,
    });
    const repositorio = new adaptadorprismaprocesamientosie(
      prismaSimulado as unknown as PrismaClient,
    );

    await repositorio.guardarresultado({
      datostrabajo: primerTrabajo,
      tokenreclamo: 'claim-token-1',
      resultado: {
        synchronizationId: primerTrabajo.synchronizationId,
        itemId: primerTrabajo.itemId,
        studentRude: primerTrabajo.studentRude,
        localValue: primerTrabajo.localGrade,
        sieValue: primerTrabajo.localGrade,
        status: estadosincronizacionsie.VERIFIED,
        isMatched: true,
        source: 'LOCAL_SIE_SIMULATION',
        verifiedAt: new Date().toISOString(),
      },
      falloreintentable: false,
      umbralpausadiscrepancias: 0.2,
      plazorevisiondiscrepanciashoras: 72,
    });

    expect(prismaSimulado.sieSynchronization.update).toHaveBeenCalledTimes(1);
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ status: expect.anything() }),
      }),
    );
  });

  it('conserva null cuando la página no ofrece una calificación', async () => {
    contadores.totalItems = 1;
    puertoSimulado.procesarsincronizacioncalificacion.mockResolvedValueOnce({
      synchronizationId: primerTrabajo.synchronizationId,
      itemId: primerTrabajo.itemId,
      studentRude: primerTrabajo.studentRude,
      localValue: 85,
      sieValue: null,
      status: estadosincronizacionsie.FAILED,
      isMatched: false,
      source: 'LOCAL_SIE_SIMULATION',
      errorMessage: 'No se encontró la calificación',
      verifiedAt: new Date().toISOString(),
    });

    await casoUso.ejecutar(primerTrabajo);

    expect(prismaSimulado.sieSynchronizationItem.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sieValue: null }),
      }),
    );
    expect(contadores.errorCount).toBe(1);
  });

  it('reintenta un fallo transitorio del navegador antes del intento final', async () => {
    contadores.totalItems = 1;
    puertoSimulado.procesarsincronizacioncalificacion.mockRejectedValueOnce(
      new Error('Navegador no disponible'),
    );

    await expect(casoUso.ejecutar(primerTrabajo)).rejects.toThrow('Navegador no disponible');
    expect(prismaSimulado.sieSynchronizationItem.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'item-1',
          status: PrismaSieSyncStatus.PROCESSING,
          processingToken: expect.any(String),
        }),
        data: expect.objectContaining({
          status: PrismaSieSyncStatus.QUEUED,
          processingToken: null,
          processingLeaseUntil: null,
        }),
      }),
    );
    expect(contadores.errorCount).toBe(0);
  });

  it('registra el fallo técnico como FAILED solo al agotarse los intentos', async () => {
    contadores.totalItems = 1;
    puertoSimulado.procesarsincronizacioncalificacion.mockRejectedValueOnce(
      new Error('Navegador no disponible'),
    );

    const resultado = await casoUso.ejecutar(primerTrabajo, { esintentofinal: true });

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.FAILED,
      sieValue: null,
      source: 'LOCAL_SIE_SIMULATION',
      errorMessage: 'Navegador no disponible',
    });
    expect(contadores.errorCount).toBe(1);
  });

  it('pausa el lote y conserva AUTH_REQUIRED cuando el adaptador requiere autenticación', async () => {
    puertoSimulado.procesarsincronizacioncalificacion.mockRejectedValueOnce(
      new errorautenticacionsierequerida(),
    );

    const resultado = await casoUso.ejecutar(primerTrabajo);

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.AUTH_REQUIRED,
      source: 'LOCAL_SIE_SIMULATION',
      errorMessage: 'La autenticación del SIE requiere atención.',
      verifiedAt: null,
    });
    expect(prismaSimulado.sieSynchronizationItem.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: PrismaSieSyncStatus.AUTH_REQUIRED }),
      }),
    );
    expect(prismaSimulado.sieSynchronization.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PrismaSieSyncStatus.PAUSED,
          pausedReason: expect.stringContaining('revisar la autenticación'),
        }),
      }),
    );
    expect(contadores).toMatchObject({ processedItems: 0, errorCount: 0 });
    expect(prismaSimulado.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newValue: expect.objectContaining({ event: 'BATCH_PAUSED_FOR_AUTHENTICATION' }),
        }),
      }),
    );
  });

  it('no duplica contadores si el ítem ya fue finalizado', async () => {
    prismaSimulado.sieSynchronizationItem.updateMany.mockResolvedValueOnce({ count: 0 });

    const resultado = await casoUso.ejecutar(primerTrabajo);

    expect(resultado.status).toBe(estadosincronizacionsie.VERIFIED);
    expect(puertoSimulado.procesarsincronizacioncalificacion).not.toHaveBeenCalled();
    expect(contadores.processedItems).toBe(0);
    expect(prismaSimulado.auditLog.create).not.toHaveBeenCalled();
  });
});
