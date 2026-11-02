import {
  errorsolicitudincorrecta,
  errorprohibido,
} from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/shared-types';
import {
  repositoriocalificaciones,
  contextoescrituracalificacion,
} from '../../domain/repositories/calificacion.repository.interface';
import { repositoriocorreccionescalificacion } from '../../domain/repositories/calificacioncorreccion.repository.interface';
import {
  casousodecidircorreccioncalificacion,
  casousosolicitarcorreccioncalificacion,
} from './calificacioncorreccion.use-cases';

const calificacion = {
  id: 'grade-1',
  enrollmentId: 'enrollment-1',
  studentId: 'student-1',
  subjectId: 'subject-1',
  periodId: 'period-1',
  value: 70,
} as never;

const cerradocontexto: contextoescrituracalificacion = {
  period: { academicYearId: 'year-1', isClosed: true },
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
  const calificaciones = {
    buscarporidentificador: jest.fn().mockResolvedValue(calificacion),
    obtenercontextoescritura: jest.fn().mockResolvedValue(cerradocontexto),
  } as unknown as jest.Mocked<repositoriocalificaciones>;
  const correcciones = {
    crear: jest.fn().mockResolvedValue({ id: 'request-1', status: 'PENDING' }),
    buscarestadodecision: jest.fn().mockResolvedValue({
      previousValue: 70,
      proposedValue: 82,
      reason: 'Error de transcripción respaldado por acta.',
      evidenceReference: 'ACTA-2026-017',
      status: 'PENDING',
    }),
    buscartodos: jest.fn(),
    decidir: jest.fn().mockResolvedValue({ id: 'request-1', status: 'EXECUTED' }),
  } as unknown as jest.Mocked<repositoriocorreccionescalificacion>;
  return { grades: calificaciones, corrections: correcciones };
}

describe('Solicitudes de corrección de notas cerradas', () => {
  it('registra valor anterior, propuesta, motivo y respaldo para revisión', async () => {
    const { grades: calificaciones, corrections: correcciones } = configuracion();
    const usocaso = new casousosolicitarcorreccioncalificacion(calificaciones, correcciones);

    await usocaso.ejecutar(
      {
        gradeId: 'grade-1',
        proposedValue: 82,
        reason: 'El acta de evaluación tenía un error de transcripción.',
        evidenceReference: 'ACTA-2026-017',
      },
      'teacher-user',
      rolusuario.TEACHER,
      '192.0.2.1',
    );

    expect(calificaciones.obtenercontextoescritura).toHaveBeenCalledWith({
      periodId: 'period-1',
      subjectId: 'subject-1',
      enrollmentIds: ['enrollment-1'],
      teacherUserId: 'teacher-user',
    });
    expect(correcciones.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        gradeId: 'grade-1',
        requestedById: 'teacher-user',
        previousValue: 70,
        proposedValue: 82,
        evidenceReference: 'ACTA-2026-017',
      }),
    );
  });

  it('rechaza solicitar cambio si el docente no tiene la asignación vigente', async () => {
    const { grades: calificaciones, corrections: correcciones } = configuracion();
    calificaciones.obtenercontextoescritura.mockResolvedValue({
      ...cerradocontexto,
      hasAssignment: false,
    });

    await expect(
      new casousosolicitarcorreccioncalificacion(calificaciones, correcciones).ejecutar(
        {
          gradeId: 'grade-1',
          proposedValue: 82,
          reason: 'El acta de evaluación tenía un error de transcripción.',
          evidenceReference: 'ACTA-2026-017',
        },
        'teacher-user',
        rolusuario.TEACHER,
      ),
    ).rejects.toBeInstanceOf(errorprohibido);
    expect(correcciones.crear).not.toHaveBeenCalled();
  });

  it('rechaza solicitudes en periodos abiertos y exige motivo y respaldo', async () => {
    const { grades: calificaciones, corrections: correcciones } = configuracion();
    calificaciones.obtenercontextoescritura.mockResolvedValue({
      ...cerradocontexto,
      period: { academicYearId: 'year-1', isClosed: false },
    });
    const usocaso = new casousosolicitarcorreccioncalificacion(calificaciones, correcciones);
    const entrada = {
      gradeId: 'grade-1',
      proposedValue: 82,
      reason: 'El acta de evaluación tenía un error de transcripción.',
      evidenceReference: 'ACTA-2026-017',
    };

    await expect(
      usocaso.ejecutar(entrada, 'teacher-user', rolusuario.TEACHER),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    calificaciones.obtenercontextoescritura.mockResolvedValue(cerradocontexto);
    await expect(
      usocaso.ejecutar({ ...entrada, proposedValue: 70 }, 'teacher-user', rolusuario.TEACHER),
    ).rejects.toThrow('distinta a la registrada');
    expect(correcciones.crear).not.toHaveBeenCalled();
  });

  it('envía al repositorio la decisión justificada de Dirección', async () => {
    const { corrections: correcciones } = configuracion();
    const usocaso = new casousodecidircorreccioncalificacion(correcciones);

    await usocaso.ejecutar(
      'request-1',
      { approve: true, decisionReason: 'Respaldo verificado.' },
      'director-1',
    );

    expect(correcciones.decidir).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'request-1',
        decidedById: 'director-1',
        decision: 'EXECUTED',
        decisionReason: 'Respaldo verificado.',
      }),
    );
  });

  it('aplica en el dominio la longitud mínima de la justificación de decisión', async () => {
    const { corrections: correcciones } = configuracion();
    const usocaso = new casousodecidircorreccioncalificacion(correcciones);

    await expect(
      usocaso.ejecutar('request-1', { approve: false, decisionReason: 'No' }, 'director-1'),
    ).rejects.toThrow('al menos 5 caracteres');
    expect(correcciones.decidir).not.toHaveBeenCalled();
  });

  it('no permite decidir una solicitud ya resuelta según su estado de dominio', async () => {
    const { corrections: correcciones } = configuracion();
    correcciones.buscarestadodecision.mockResolvedValue({
      previousValue: 70,
      proposedValue: 82,
      reason: 'Error de transcripción respaldado por acta.',
      evidenceReference: 'ACTA-2026-017',
      status: 'EXECUTED',
    });
    const usocaso = new casousodecidircorreccioncalificacion(correcciones);

    await expect(
      usocaso.ejecutar(
        'request-1',
        { approve: false, decisionReason: 'Revisión completada.' },
        'director-1',
      ),
    ).rejects.toThrow('ya fue resuelta');
    expect(correcciones.decidir).not.toHaveBeenCalled();
  });
});
