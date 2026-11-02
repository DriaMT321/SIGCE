import {
  errorsolicitudincorrecta,
  errorprohibido,
  errorconflictoaplicacion,
} from '../../../../core/application/aplicacionerror';
import { estadoasistencia, rolusuario } from '@academic/shared-types';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { buseventosaplicacion } from '../../../../core/application/buseventosaplicacion.port';
import { repositorioasistencias } from '../../domain/repositories/asistencia.repository.interface';
import { casousocrearasistencia, casousoactualizarasistencia } from './asistencia.use-cases';

const entrada = {
  studentId: 'student-1',
  courseId: 'course-1',
  date: '2026-03-04',
  status: estadoasistencia.PRESENT,
};
const asistencia = { id: 'attendance-1', ...entrada, date: new Date('2026-03-04T00:00:00.000Z') };

function configuracion() {
  const repositorio = {
    crear: jest.fn().mockResolvedValue(asistencia),
    buscarporidentificador: jest.fn().mockResolvedValue(asistencia),
    actualizar: jest.fn().mockResolvedValue({ ...asistencia, status: estadoasistencia.JUSTIFIED }),
    obtenercontextocreacion: jest.fn().mockResolvedValue({
      student: { active: true, deleted: false },
      course: {
        id: 'course-1',
        academicYearId: 'year-1',
        academicYear: {
          closed: false,
          startsAt: new Date('2026-02-01T00:00:00.000Z'),
          endsAt: new Date('2026-11-30T00:00:00.000Z'),
        },
      },
      enrollmentAcademicYearId: 'year-1',
    }),
    obtenerestadoasignacioncursodocente: jest.fn().mockResolvedValue('ASSIGNED'),
    existeasistencia: jest.fn().mockResolvedValue(false),
    obteneridanioacademicocurso: jest.fn().mockResolvedValue('year-1'),
  } as unknown as jest.Mocked<repositorioasistencias>;
  const eventobus = {
    publicar: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn(),
  } as unknown as jest.Mocked<buseventosaplicacion>;
  return { repository: repositorio, eventBus: eventobus };
}

describe('Asistencia con datos sintéticos', () => {
  it('registra una fecha válida de un alumno inscrito y audita la operación', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    const resultado = await new casousocrearasistencia(repositorio, eventobus).ejecutar(
      entrada,
      'teacher-user-1',
      undefined,
      rolusuario.TEACHER,
    );
    expect(resultado).toEqual(asistencia);
    expect(repositorio.obtenerestadoasignacioncursodocente).toHaveBeenCalledWith(
      'teacher-user-1',
      'course-1',
      'year-1',
    );
    expect(repositorio.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        studentId: entrada.studentId,
        date: new Date('2026-03-04T00:00:00.000Z'),
        registeredById: 'teacher-user-1',
      }),
      {
        userId: 'teacher-user-1',
        ipAddress: undefined,
      },
      { teacherUserId: 'teacher-user-1' },
    );
    expect(eventobus.publicar).toHaveBeenCalledWith({
      type: 'attendance.registered',
      attendanceId: asistencia.id,
      studentId: asistencia.studentId,
      courseId: asistencia.courseId,
      date: asistencia.date.toISOString(),
      status: asistencia.status,
    });
  });

  it('rechaza asistencia de quien no está inscrito en el curso', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    repositorio.obtenercontextocreacion.mockResolvedValueOnce({
      student: { active: true, deleted: false },
      course: {
        id: 'course-1',
        academicYearId: 'year-1',
        academicYear: {
          closed: false,
          startsAt: new Date('2026-02-01'),
          endsAt: new Date('2026-11-30'),
        },
      },
      enrollmentAcademicYearId: null,
    });
    await expect(
      new casousocrearasistencia(repositorio, eventobus).ejecutar(
        entrada,
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('rechaza fecha fuera de gestión', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    await expect(
      new casousocrearasistencia(repositorio, eventobus).ejecutar(
        { ...entrada, date: '2027-01-05' },
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('deniega al docente sin asignación en el curso', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    repositorio.obtenerestadoasignacioncursodocente.mockResolvedValueOnce('UNASSIGNED');
    await expect(
      new casousocrearasistencia(repositorio, eventobus).ejecutar(
        entrada,
        'teacher-user-1',
        undefined,
        rolusuario.TEACHER,
      ),
    ).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('rechaza un segundo registro del mismo día', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    repositorio.existeasistencia.mockResolvedValueOnce(true);
    await expect(
      new casousocrearasistencia(repositorio, eventobus).ejecutar(
        entrada,
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorconflictoaplicacion);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('exige una justificación escrita para marcar la ausencia como justificada', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    await expect(
      new casousocrearasistencia(repositorio, eventobus).ejecutar(
        { ...entrada, status: estadoasistencia.JUSTIFIED },
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('rechaza fechas que no representan un día válido', async () => {
    const { repository: repositorio, eventBus: eventobus } = configuracion();
    await expect(
      new casousocrearasistencia(repositorio, eventobus).ejecutar(
        { ...entrada, date: '2026-02-30' },
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('audita una corrección autorizada de asistencia', async () => {
    const { repository: repositorio } = configuracion();
    const resultado = await new casousoactualizarasistencia(repositorio).ejecutar(
      'attendance-1',
      { status: estadoasistencia.JUSTIFIED, justification: 'Constancia médica' },
      'teacher-user-1',
      undefined,
      rolusuario.TEACHER,
    );
    expect(resultado.status).toBe(estadoasistencia.JUSTIFIED);
    expect(repositorio.actualizar).toHaveBeenCalledWith(
      'attendance-1',
      expect.objectContaining({
        status: estadoasistencia.JUSTIFIED,
      }),
      { userId: 'teacher-user-1', ipAddress: undefined },
      { teacherUserId: 'teacher-user-1' },
    );
  });
});
