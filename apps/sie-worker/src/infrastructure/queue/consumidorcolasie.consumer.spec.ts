import { UnrecoverableError, Worker } from 'bullmq';
import { estadosincronizacionsie } from '@academic/domain-kernel';
import { consumidorcolasie } from './consumidorcolasie.consumer';
import { casousoprocesarsincronizacionsie } from '../../application/use-cases/procesarsincronizacionsie.use-case';
import { publicadoreventossie } from '../../application/ports/publicadoreventossie.port';
import { errordestinosincronizacionincompatible } from '../../domain/errors/destinosincronizacionincompatible.error';

jest.mock('bullmq', () => ({
  ...jest.requireActual('bullmq'),
  Worker: jest.fn(),
}));

describe('consumidor de la cola SIE', () => {
  let procesar: (job: unknown) => Promise<unknown>;
  let casouso: { validardestino: jest.Mock; ejecutar: jest.Mock };
  let publicador: { publicar: jest.Mock };
  const job = {
    id: 'item-1',
    name: 'sync-grade-sie',
    data: {
      synchronizationId: 'sync-1',
      itemId: 'item-1',
      studentRude: 'SIM-1',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT',
      localGrade: 85,
    },
    opts: { attempts: 3 },
    attemptsMade: 0,
  };

  beforeEach(() => {
    casouso = { validardestino: jest.fn(), ejecutar: jest.fn() };
    publicador = { publicar: jest.fn().mockResolvedValue(undefined) };
    (Worker as unknown as jest.Mock).mockImplementation((_cola, manejador) => {
      procesar = manejador;
      return { on: jest.fn(), close: jest.fn() };
    });
    new consumidorcolasie(
      casouso as unknown as casousoprocesarsincronizacionsie,
      publicador as unknown as publicadoreventossie,
    ).iniciar();
  });

  it('detiene un destino incompatible antes de publicar un origen incorrecto', async () => {
    casouso.validardestino.mockRejectedValue(new errordestinosincronizacionincompatible());

    await expect(procesar(job)).rejects.toBeInstanceOf(UnrecoverableError);
    expect(casouso.ejecutar).not.toHaveBeenCalled();
    expect(publicador.publicar).not.toHaveBeenCalled();
  });

  it('publica el resultado cuando el destino es compatible', async () => {
    casouso.validardestino.mockResolvedValue(undefined);
    casouso.ejecutar.mockResolvedValue({
      synchronizationId: 'sync-1',
      itemId: 'item-1',
      studentRude: 'SIM-1',
      localValue: 85,
      sieValue: 85,
      status: estadosincronizacionsie.VERIFIED,
      isMatched: true,
      source: 'LOCAL_SIE_SIMULATION',
      verifiedAt: '2026-01-01T00:00:00.000Z',
    });

    await procesar(job);
    expect(casouso.ejecutar).toHaveBeenCalledTimes(1);
    expect(publicador.publicar).toHaveBeenCalledWith(
      'sie.sync.verified',
      expect.objectContaining({ source: 'LOCAL_SIE_SIMULATION' }),
    );
  });
});
