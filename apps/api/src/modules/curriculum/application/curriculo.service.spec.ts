import { errornoencontrado } from '../../../core/application/aplicacionerror';
import { estadoplanestudio, rolusuario } from '@academic/domain-kernel';
import {
  repositoriocurriculo,
  registrotemacurricular,
} from '../domain/repositories/curriculo.repository.interface';
import { serviciocurriculo } from './curriculo.service';

const tema = (nivelacademico: number, estado: estadoplanestudio, porcentajeavance: number) =>
  ({
    id: `topic-${nivelacademico}-${estado}`,
    gradeLevel: nivelacademico,
    status: estado,
    progressPercent: porcentajeavance,
  }) as registrotemacurricular;

function configuracion() {
  const repositorio = {
    buscaridanioacademicoactivo: jest.fn().mockResolvedValue('year-active'),
    buscartemas: jest.fn().mockResolvedValue([]),
    actualizarprogreso: jest.fn(),
    actualizarprogresodocente: jest.fn(),
    creartema: jest.fn(),
  } as unknown as jest.Mocked<repositoriocurriculo>;
  return { repository: repositorio, service: new serviciocurriculo(repositorio) };
}

describe('CurriculumService', () => {
  it('aplica el alcance docente tanto en los temas como en las estadísticas', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    const docente = { id: 'teacher-user-1', role: rolusuario.TEACHER };
    await servicio.listar({ search: 'algebra' }, docente);
    await servicio.obtenerestadisticas(undefined, docente);
    expect(repositorio.buscartemas).toHaveBeenNthCalledWith(1, {
      search: 'algebra', academicYearId: 'year-active', teacherUserId: 'teacher-user-1',
    });
    expect(repositorio.buscartemas).toHaveBeenNthCalledWith(2, {
      academicYearId: 'year-active', teacherUserId: 'teacher-user-1',
    });
  });

  it('resume avance y promedio por nivel de la gestión activa', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    repositorio.buscartemas.mockResolvedValueOnce([
      tema(2, estadoplanestudio.COMPLETADO, 100),
      tema(6, estadoplanestudio.EN_DESARROLLO, 50),
      tema(12, estadoplanestudio.PLANIFICADO, 0),
    ]);

    await expect(servicio.obtenerestadisticas()).resolves.toEqual({
      totalTopics: 3,
      completed: 1,
      inProgress: 1,
      planned: 1,
      averageProgress: 50,
      byLevel: {
        inicial: { total: 1, completed: 1, avgProgress: 100 },
        primaria: { total: 1, completed: 0, avgProgress: 50 },
        secundaria: { total: 1, completed: 0, avgProgress: 0 },
      },
    });
    expect(repositorio.buscartemas).toHaveBeenCalledWith({ academicYearId: 'year-active' });
  });

  it('no crea temas cuando no hay una gestión académica activa', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    repositorio.buscaridanioacademicoactivo.mockResolvedValueOnce(null);
    await expect(
      servicio.crear({
        subjectId: 'subject-1',
        periodNumber: 1,
        unitTitle: 'Unidad',
        title: 'Tema',
      }),
    ).rejects.toBeInstanceOf(errornoencontrado);
    expect(repositorio.creartema).not.toHaveBeenCalled();
  });

  it('rechaza grados fuera de la estructura de Educación Regular', async () => {
    const { repository: repositorio, service: servicio } = configuracion();

    await expect(
      servicio.crear({
        subjectId: 'subject-1',
        periodNumber: 1,
        unitTitle: 'Unidad',
        title: 'Tema',
        gradeLevel: 15,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    expect(repositorio.creartema).not.toHaveBeenCalled();
  });

  it('aplica la comprobación de asignación al actualizar como docente', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    repositorio.actualizarprogresodocente.mockResolvedValueOnce(
      tema(6, estadoplanestudio.EN_DESARROLLO, 40),
    );

    await servicio.actualizarprogreso(
      'topic-6',
      { progressPercent: 40 },
      { id: 'teacher-user-1', role: rolusuario.TEACHER },
    );

    expect(repositorio.actualizarprogresodocente).toHaveBeenCalledWith(
      'topic-6',
      { progressPercent: 40 },
      'teacher-user-1',
    );
    expect(repositorio.actualizarprogreso).not.toHaveBeenCalled();
  });
});
