import { errorprohibido, errornoencontrado } from '../../../core/application/aplicacionerror';
import { repositoriotareas } from '../domain/repositories/tarea.repository.interface';
import { ordencreartarea, ordenactualizartarea } from './commands/tarea.command';
import { serviciotareas } from './tareas.service';
import { rolusuario } from '@academic/shared-types';

function configuracion() {
  const repositorio = {
    buscariddocente: jest.fn().mockResolvedValue('teacher-1'),
    buscardestinatarioestudiante: jest.fn().mockResolvedValue(null),
    buscardestinatariosfamiliares: jest.fn().mockResolvedValue([]),
    buscariddocenteasignado: jest.fn().mockResolvedValue(null),
    tieneasignaciondocentevigente: jest.fn().mockResolvedValue(true),
    buscartodos: jest.fn().mockResolvedValue([]),
    crear: jest.fn(),
    buscarporidentificador: jest
      .fn()
      .mockResolvedValue({ id: 'assignment-1', teacherId: 'teacher-2' }),
    actualizar: jest.fn(),
    eliminarlogicamente: jest.fn().mockResolvedValue(true),
  } as unknown as jest.Mocked<repositoriotareas>;
  return { repository: repositorio, service: new serviciotareas(repositorio) };
}

const usuariodocente = { id: 'user-1', role: rolusuario.TEACHER };
const entradaasignacion: ordencreartarea = {
  title: 'Actividad',
  dueDate: '2026-05-10T12:00:00.000Z',
  courseId: 'course-1',
  subjectId: 'subject-1',
};

describe('AssignmentsService', () => {
  it('no muestra tareas a un padre sin hijos con matrícula activa', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    await expect(
      servicio.listar({}, { id: 'parent-1', role: rolusuario.PARENT } as never),
    ).resolves.toEqual([]);
    expect(repositorio.buscartodos).not.toHaveBeenCalled();
  });

  it('no asigna automáticamente un docente ajeno cuando no hay asignación de materia', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    await expect(
      servicio.crear(entradaasignacion, {
        id: 'admin-1',
        role: rolusuario.ADMINISTRATIVE,
      } as never),
    ).rejects.toBeInstanceOf(errornoencontrado);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('impide que un docente publique actividades fuera de su asignación vigente', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    repositorio.tieneasignaciondocentevigente.mockResolvedValue(false);

    await expect(servicio.crear(entradaasignacion, usuariodocente as never)).rejects.toBeInstanceOf(
      errorprohibido,
    );
    expect(repositorio.tieneasignaciondocentevigente).toHaveBeenCalledWith(
      'teacher-1',
      'course-1',
      'subject-1',
    );
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('impide que un docente modifique una actividad de otro docente', async () => {
    const { repository: repositorio, service: servicio } = configuracion();
    await expect(
      servicio.actualizar('assignment-1', {} as ordenactualizartarea, usuariodocente as never),
    ).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.actualizar).not.toHaveBeenCalled();
  });
});
