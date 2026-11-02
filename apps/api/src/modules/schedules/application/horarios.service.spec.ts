import { errorprohibido } from '../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import type { repositoriohorarios } from '../domain/repositories/horario.repository.interface';
import { serviciohorarios } from './horarios.service';

describe('serviciohorarios', () => {
  it('forces a teacher schedule list to the teacher own identifier', async () => {
    const repositorio = {
      buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-own'),
      listar: jest.fn().mockResolvedValue([]),
    } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);

    await servicio.listar(
      { teacherId: 'teacher-own' },
      {
        id: 'user-teacher',
        role: rolusuario.TEACHER,
      },
    );

    expect(repositorio.listar).toHaveBeenCalledWith({ teacherId: 'teacher-own', soloGestionActiva: true });
  });

  it('rejects a teacher schedule list filtered by a different teacher', async () => {
    const repositorio = {
      buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-own'),
      listar: jest.fn(),
    } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);

    await expect(
      servicio.listar(
        { teacherId: 'teacher-other' },
        {
          id: 'user-teacher',
          role: rolusuario.TEACHER,
        },
      ),
    ).rejects.toBeInstanceOf(errorprohibido);

    expect(repositorio.listar).not.toHaveBeenCalled();
  });

  it('prevents a teacher from requesting another teacher schedule', async () => {
    const repositorio = {
      buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-own'),
      obtenerhorariodocente: jest.fn(),
    } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);

    await expect(
      servicio.obtenerhorariodocente('teacher-other', {
        id: 'user-teacher',
        role: rolusuario.TEACHER,
      }),
    ).rejects.toBeInstanceOf(errorprohibido);

    expect(repositorio.obtenerhorariodocente).not.toHaveBeenCalled();
  });

  it('limits a teacher own schedule to the active academic year', async () => {
    const repositorio = {
      buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-own'),
      obtenerhorariodocente: jest.fn().mockResolvedValue({}),
    } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);

    await servicio.obtenerhorariodocente('teacher-own', {
      id: 'user-teacher',
      role: rolusuario.TEACHER,
    });

    expect(repositorio.obtenerhorariodocente).toHaveBeenCalledWith('teacher-own', true);
  });

  it('permite al docente solo consultar un curso asignado y oculta materias ajenas', async () => {
    const repositorio = {
      buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-1'),
      obtenerhorariodocente: jest.fn().mockResolvedValue({ assignments: [{ id: 'asig-1', courseId: 'curso-1', subjectId: 'mat-1', academicYearId: 'gestion-1' }] }),
      obtenerhorariocurso: jest.fn().mockResolvedValue({ course: { id: 'curso-1' }, schedules: [
        { teacherId: 'teacher-1', subjectId: 'mat-1', academicYearId: 'gestion-1' },
        { teacherId: 'teacher-2', subjectId: 'mat-2', academicYearId: 'gestion-1' },
      ], teacherSubjects: [{ id: 'asig-1' }, { id: 'asig-2' }] }),
    } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);
    const resultado = await servicio.obtenerhorariocurso('curso-1', { id: 'usuario', role: rolusuario.TEACHER });
    expect(resultado.schedules).toHaveLength(1);
    expect(resultado.teacherSubjects).toEqual([{ id: 'asig-1' }]);
    await expect(servicio.obtenerhorariocurso('curso-2', { id: 'usuario', role: rolusuario.TEACHER })).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.obtenerhorariocurso).toHaveBeenCalledTimes(1);
  });

  it('permite a familiares únicamente los cursos de estudiantes vinculados', async () => {
    const repositorio = {
      buscarperfilhorarioestudiante: jest.fn().mockResolvedValue(null),
      buscarperfilhorariofamiliar: jest.fn().mockResolvedValue({ children: [{ activeCourseId: 'curso-1' }] }),
      obtenerhorariocurso: jest.fn().mockResolvedValue({ course: { id: 'curso-1' }, schedules: [], teacherSubjects: [] }),
    } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);
    await expect(servicio.obtenerhorariocurso('curso-2', { id: 'familiar', role: rolusuario.PARENT })).rejects.toBeInstanceOf(errorprohibido);
    await expect(servicio.obtenerhorariocurso('curso-1', { id: 'familiar', role: rolusuario.PARENT })).resolves.toMatchObject({ course: { id: 'curso-1' } });
    expect(repositorio.obtenerhorariocurso).toHaveBeenCalledTimes(1);
  });

  it('mantiene la consulta de cualquier curso a la administración', async () => {
    const repositorio = { obtenerhorariocurso: jest.fn().mockResolvedValue({ course: { id: 'curso' }, schedules: [], teacherSubjects: [] }) } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);
    await expect(servicio.obtenerhorariocurso('curso', { id: 'admin', role: rolusuario.ADMINISTRATIVE })).resolves.toMatchObject({ course: { id: 'curso' } });
  });

  it('rechaza filtrar la lista de horarios por curso ajeno', async () => {
    const repositorio = { buscariddocenteporusuario: jest.fn().mockResolvedValue('teacher-1'), obtenerhorariodocente: jest.fn().mockResolvedValue({ assignments: [] }), listar: jest.fn() } as unknown as repositoriohorarios;
    const servicio = new serviciohorarios(repositorio, {} as never, {} as never);
    await expect(servicio.listar({ courseId: 'curso-ajeno' }, { id: 'docente', role: rolusuario.TEACHER })).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.listar).not.toHaveBeenCalled();
  });

});
