import { estadoinscripcion } from '@academic/shared-types';
import { repositorioinscripciones } from '../../domain/repositories/inscripcion.repository.interface';
import { casousoactualizarinscripcion, casousocrearinscripcion } from './inscripcion.use-cases';

const entrada = { studentId: 'student-1', courseId: 'course-1', academicYearId: 'year-1' };
const inscripcion = { id: 'enrollment-1', ...entrada };

describe('Enrollment use cases', () => {
  it('passes audit context into the atomic creation port', async () => {
    const repositorio = {
      crear: jest.fn().mockResolvedValue(inscripcion),
    } as unknown as jest.Mocked<repositorioinscripciones>;

    const resultado = await new casousocrearinscripcion(repositorio).ejecutar(
      entrada,
      'secretary-1',
      '127.0.0.1',
    );

    expect(resultado).toEqual(inscripcion);
    expect(repositorio.crear).toHaveBeenCalledWith(entrada, {
      userId: 'secretary-1',
      ipAddress: '127.0.0.1',
    });
  });

  it('passes audit context into the atomic status update port', async () => {
    const repositorio = {
      actualizarestado: jest.fn().mockResolvedValue(inscripcion),
    } as unknown as jest.Mocked<repositorioinscripciones>;

    await new casousoactualizarinscripcion(repositorio).ejecutar(
      'enrollment-1',
      { status: estadoinscripcion.INACTIVE },
      'secretary-1',
      '127.0.0.1',
    );

    expect(repositorio.actualizarestado).toHaveBeenCalledWith(
      'enrollment-1',
      estadoinscripcion.INACTIVE,
      undefined,
      {
        userId: 'secretary-1',
        ipAddress: '127.0.0.1',
      },
    );
  });
});
