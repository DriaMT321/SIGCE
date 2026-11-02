import { repositorioalertas } from '../../domain/repositories/alerta.repository.interface';
import {
  casousoevaluaralertasestudiante,
  casousoprocesarevaluacionesalertaspendientes,
} from './alerta.use-cases';

describe('Process alert evaluation outbox', () => {
  it('evaluates and marks claimed jobs as completed', async () => {
    const repositorio = {
      reclamarevaluacionespendientes: jest
        .fn()
        .mockResolvedValue([{ id: 'job-1', studentId: 'student-1', attempts: 0 }]),
      completarevaluacionpendiente: jest.fn().mockResolvedValue(undefined),
      reintentarevaluacionpendiente: jest.fn(),
    } as unknown as jest.Mocked<repositorioalertas>;
    const evaluador = {
      ejecutar: jest.fn().mockResolvedValue(undefined),
    } as unknown as casousoevaluaralertasestudiante;
    const ahora = new Date('2026-10-23T12:00:00.000Z');

    const resultado = await new casousoprocesarevaluacionesalertaspendientes(
      repositorio,
      evaluador,
    ).ejecutar(10, ahora);

    expect(resultado).toEqual({ processed: 1, retried: 0 });
    expect(repositorio.reclamarevaluacionespendientes).toHaveBeenCalledWith(
      10,
      ahora,
      new Date('2026-10-23T11:55:00.000Z'),
    );
    expect(evaluador.ejecutar).toHaveBeenCalledWith('student-1');
    expect(repositorio.completarevaluacionpendiente).toHaveBeenCalledWith('job-1');
  });

  it('schedules failed jobs with bounded exponential backoff', async () => {
    const repositorio = {
      reclamarevaluacionespendientes: jest
        .fn()
        .mockResolvedValue([{ id: 'job-2', studentId: 'student-2', attempts: 2 }]),
      completarevaluacionpendiente: jest.fn(),
      reintentarevaluacionpendiente: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<repositorioalertas>;
    const evaluador = {
      ejecutar: jest.fn().mockRejectedValue(new Error('temporary failure')),
    } as unknown as casousoevaluaralertasestudiante;
    const ahora = new Date('2026-10-23T12:00:00.000Z');

    const resultado = await new casousoprocesarevaluacionesalertaspendientes(
      repositorio,
      evaluador,
    ).ejecutar(10, ahora);

    expect(resultado).toEqual({ processed: 0, retried: 1 });
    expect(repositorio.reintentarevaluacionpendiente).toHaveBeenCalledWith(
      'job-2',
      3,
      'temporary failure',
      new Date('2026-10-23T12:00:08.000Z'),
    );
  });
});
