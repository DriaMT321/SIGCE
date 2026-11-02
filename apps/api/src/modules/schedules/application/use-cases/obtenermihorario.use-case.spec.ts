import { rolusuario } from '@academic/domain-kernel';
import type { repositoriohorarios } from '../../domain/repositories/horario.repository.interface';
import { casousoobtenermihorario } from './obtenermihorario.use-case';

describe('casousoobtenermihorario', () => {
  it('loads teacher schedules from the active academic year', async () => {
    const repositorio = {
      buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-1'),
      obtenerhorariodocente: jest.fn().mockResolvedValue({
        teacher: { id: 'teacher-1', firstName: 'Ana', lastName: 'Rojas' },
        schedules: [],
        assignments: [],
      }),
    } as unknown as repositoriohorarios;
    const caso = new casousoobtenermihorario(repositorio);

    await caso.ejecutar({ id: 'user-teacher-1', role: rolusuario.TEACHER });

    expect(repositorio.obtenerhorariodocente).toHaveBeenCalledWith('teacher-1', true);
  });
});
