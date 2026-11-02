import {
  errorconflictoaplicacion,
  errornoencontrado,
  errorsolicitudincorrecta,
} from '../../../../core/application/aplicacionerror';
import { repositoriohorarios } from '../../domain/repositories/horario.repository.interface';
import { casousogenerarhorariosemanal } from './generarhorariosemanal.use-case';

describe('CasoUsoGenerarHorarioSemanal', () => {
  const datos = {
    curso: {
      id: 'course-1',
      nombre: '6to A',
      nivel: 3,
      idGestionAcademica: 'year-1',
      turno: 'MORNING' as const,
    },
    asignaciones: [
      {
        subject: { id: 'subject-1', name: 'Matemática', code: 'MAT' },
        teacher: { id: 'teacher-1', firstName: 'Ana', lastName: 'Paz' },
      },
    ],
    bloquesOcupados: [],
  };

  it('applies the domain policy and delegates only the generated schedule to persistence', async () => {
    const repositorio = {
      cargardatosgeneracion: jest.fn().mockResolvedValue(datos),
      guardarhorariogenerado: jest.fn().mockResolvedValue(undefined),
    } as unknown as repositoriohorarios;

    const resultado = await new casousogenerarhorariosemanal(repositorio).ejecutar('course-1');

    expect(resultado.totalSlots).toBe(30);
    expect(resultado.distribution).toEqual([
      { subjectName: 'Matemática', code: 'MAT', teacherName: 'Ana Paz', periods: 30 },
    ]);
    expect(repositorio.guardarhorariogenerado).toHaveBeenCalledWith(
      expect.objectContaining({
        idCurso: 'course-1',
        idGestionAcademica: 'year-1',
        nombreCursoEsperado: '6to A',
        nivelEsperado: 3,
        turnoEsperado: 'MORNING',
        aula: 'Aula 6to A',
        asignacionesEsperadas: [{ teacherId: 'teacher-1', subjectId: 'subject-1' }],
        bloques: expect.arrayContaining([
          expect.objectContaining({ subjectId: 'subject-1', teacherId: 'teacher-1' }),
        ]),
      }),
    );
  });

  it('returns a not found application error when the course does not exist', async () => {
    const repositorio = {
      cargardatosgeneracion: jest.fn().mockResolvedValue(null),
      guardarhorariogenerado: jest.fn(),
    } as unknown as repositoriohorarios;

    await expect(new casousogenerarhorariosemanal(repositorio).ejecutar('missing')).rejects.toThrow(
      errornoencontrado,
    );
    expect(repositorio.guardarhorariogenerado).not.toHaveBeenCalled();
  });

  it('maps domain validation and availability errors to application errors', async () => {
    const noasignacionesrepositorio = {
      cargardatosgeneracion: jest.fn().mockResolvedValue({ ...datos, asignaciones: [] }),
      guardarhorariogenerado: jest.fn(),
    } as unknown as repositoriohorarios;
    const conflictorepositorio = {
      cargardatosgeneracion: jest.fn().mockResolvedValue({
        ...datos,
        bloquesOcupados: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'].flatMap(
          (diasemana) =>
            [1, 2, 3, 4, 5, 6].map((indiceperiodo) => ({
              teacherId: 'teacher-1',
              dayOfWeek: diasemana,
              periodIndex: indiceperiodo,
            })),
        ),
      }),
      guardarhorariogenerado: jest.fn(),
    } as unknown as repositoriohorarios;

    await expect(
      new casousogenerarhorariosemanal(noasignacionesrepositorio).ejecutar('course-1'),
    ).rejects.toThrow(errorsolicitudincorrecta);
    await expect(
      new casousogenerarhorariosemanal(conflictorepositorio).ejecutar('course-1'),
    ).rejects.toThrow(errorconflictoaplicacion);
  });
});
