import {
  errorsolicitudincorrecta,
  errorprohibido,
} from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/shared-types';
import {
  repositoriocalificaciones,
  contextoescrituracalificacion,
} from '../../domain/repositories/calificacion.repository.interface';
import {
  casousocrearcalificacionesmasivas,
  registrarcalificacion,
  casousoactualizarcalificacion,
} from './calificacion.use-cases';

const calificacion = {
  id: 'grade-1',
  enrollmentId: 'enrollment-1',
  studentId: 'student-1',
  subjectId: 'subject-1',
  periodId: 'period-1',
  value: 85,
  remarks: null,
  publishedAt: null,
  publishedById: null,
  updatedAt: new Date('2026-03-04T00:00:00.000Z'),
  student: { id: 'student-1', rude: 'SYNTH-1', firstName: 'Ana', lastName: 'Pérez' },
  subject: { id: 'subject-1', code: 'MAT', name: 'Matemática' },
  period: { id: 'period-1', name: '1er Trimestre', number: 1 },
};

const entrada = {
  enrollmentId: 'enrollment-1',
  studentId: 'student-1',
  subjectId: 'subject-1',
  periodId: 'period-1',
  value: 85,
};

const elegiblecontexto: contextoescrituracalificacion = {
  period: { academicYearId: 'year-1', isClosed: false },
  subjectExists: true,
  enrollments: [
    {
      id: 'enrollment-1',
      studentId: 'student-1',
      courseId: 'course-1',
      academicYearId: 'year-1',
      status: 'ACTIVE',
    },
  ],
  teacherProfileExists: true,
  hasAssignment: true,
};

function configuracion() {
  const repositorio = {
    buscarporidentificador: jest.fn().mockResolvedValue(calificacion),
    obtenercontextoescritura: jest.fn().mockResolvedValue(elegiblecontexto),
    buscarbulkanterior: jest.fn().mockResolvedValue([]),
    crear: jest.fn().mockResolvedValue(calificacion),
    actualizar: jest.fn().mockResolvedValue(calificacion),
    insertaroactualizarporlote: jest.fn().mockResolvedValue([calificacion]),
  } as unknown as jest.Mocked<repositoriocalificaciones>;
  return { repositorio };
}

describe('Registro de calificaciones con datos sintéticos', () => {
  it('crea una nota de una matrícula activa y deja auditoría', async () => {
    const { repositorio } = configuracion();
    const resultado = await new registrarcalificacion(repositorio).ejecutar(
      entrada,
      'admin-1',
      '127.0.0.1',
      rolusuario.ADMINISTRATIVE,
      'corr-1',
    );
    expect(resultado).toEqual(calificacion);
    expect(repositorio.crear).toHaveBeenCalledWith(
      entrada,
      {
        userId: 'admin-1',
        ipAddress: '127.0.0.1',
        correlationId: 'corr-1',
        reason: undefined,
      },
      {},
    );
  });

  it('rechaza una nota asociada a un estudiante distinto de la matrícula', async () => {
    const { repositorio } = configuracion();
    await expect(
      new registrarcalificacion(repositorio).ejecutar(
        { ...entrada, studentId: 'student-2' },
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('rechaza una nota si el período pertenece a otra gestión', async () => {
    const { repositorio } = configuracion();
    repositorio.obtenercontextoescritura.mockResolvedValue({
      ...elegiblecontexto,
      period: { academicYearId: 'year-2', isClosed: false },
    });
    await expect(
      new registrarcalificacion(repositorio).ejecutar(
        entrada,
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('deniega al docente una corrección en período cerrado', async () => {
    const { repositorio } = configuracion();
    repositorio.obtenercontextoescritura.mockResolvedValue({
      ...elegiblecontexto,
      period: { academicYearId: 'year-1', isClosed: true },
    });
    await expect(
      new registrarcalificacion(repositorio).ejecutar(
        entrada,
        'teacher-1',
        undefined,
        rolusuario.TEACHER,
      ),
    ).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('impide que Dirección altere directamente una nota cerrada aunque adjunte un motivo', async () => {
    const { repositorio } = configuracion();
    repositorio.obtenercontextoescritura.mockResolvedValue({
      ...elegiblecontexto,
      period: { academicYearId: 'year-1', isClosed: true },
    });
    const usocaso = new casousoactualizarcalificacion(repositorio);
    await expect(
      usocaso.ejecutar(
        'grade-1',
        { value: 90, reason: 'Acta 17' },
        'director-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.actualizar).not.toHaveBeenCalled();
  });

  it('deniega una nota docente sin asignación de materia, curso y gestión', async () => {
    const { repositorio } = configuracion();
    repositorio.obtenercontextoescritura.mockResolvedValue({
      ...elegiblecontexto,
      hasAssignment: false,
    });
    await expect(
      new registrarcalificacion(repositorio).ejecutar(
        entrada,
        'teacher-1',
        undefined,
        rolusuario.TEACHER,
      ),
    ).rejects.toBeInstanceOf(errorprohibido);
    expect(repositorio.obtenercontextoescritura).toHaveBeenCalledWith({
      periodId: 'period-1',
      subjectId: 'subject-1',
      enrollmentIds: ['enrollment-1'],
      courseId: undefined,
      teacherUserId: 'teacher-1',
    });
  });

  it('rechaza una carga masiva con matrícula de otro curso', async () => {
    const { repositorio } = configuracion();
    const dto = {
      courseId: 'course-2',
      subjectId: 'subject-1',
      periodId: 'period-1',
      grades: [{ enrollmentId: 'enrollment-1', studentId: 'student-1', value: 90 }],
    };
    await expect(
      new casousocrearcalificacionesmasivas(repositorio).ejecutar(
        dto,
        'admin-1',
        undefined,
        rolusuario.ADMINISTRATIVE,
      ),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    expect(repositorio.insertaroactualizarporlote).not.toHaveBeenCalled();
  });

  it('registra una carga masiva válida y deja su motivo en auditoría', async () => {
    const { repositorio } = configuracion();
    const dto = {
      courseId: 'course-1',
      subjectId: 'subject-1',
      periodId: 'period-1',
      reason: 'Acta 17',
      grades: [{ enrollmentId: 'enrollment-1', studentId: 'student-1', value: 90 }],
    };
    const resultado = await new casousocrearcalificacionesmasivas(repositorio).ejecutar(
      dto,
      'admin-1',
      undefined,
      rolusuario.ADMINISTRATIVE,
    );
    expect(resultado.count).toBe(1);
    expect(repositorio.insertaroactualizarporlote).toHaveBeenCalledWith(
      [{ ...entrada, value: 90, remarks: undefined }],
      {
        userId: 'admin-1',
        ipAddress: undefined,
        correlationId: undefined,
        reason: 'Acta 17',
        courseId: 'course-1',
        subjectId: 'subject-1',
        periodId: 'period-1',
        studentIds: ['student-1'],
      },
      {},
    );
  });
});
