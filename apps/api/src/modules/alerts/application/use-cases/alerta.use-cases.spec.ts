import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { repositorioalertas } from '../../domain/repositories/alerta.repository.interface';
import {
  casousoevaluaralertasestudiante,
  casousoevaluaralertastodosestudiantes,
  casousoactualizarreglaalerta,
} from './alerta.use-cases';

const instantanea = {
  studentId: 'student-1',
  studentName: 'Ana Pérez',
  studentUserId: 'student-user-1',
  guardianUserIds: ['parent-1'],
  grades: [
    {
      id: 'grade-1',
      value: 45,
      subjectName: 'Matemática',
      subjectId: 'subject-1',
      periodId: 'period-1',
      periodName: 'Primer trimestre',
      courseId: 'course-1',
      courseName: '6to A',
      teacherUserIds: ['teacher-1'],
    },
  ],
  absences: [
    {
      courseId: 'course-1',
      courseName: '6to A',
      count: 3,
      teacherUserIds: ['teacher-1'],
    },
  ],
};

function crearrepositorio() {
  return {
    listarreglas: jest.fn().mockResolvedValue([
      { key: 'LOW_GRADE', enabled: true, severity: 'WARNING', gradeThreshold: 51 },
      {
        key: 'REPEATED_ABSENCE',
        enabled: true,
        severity: 'DANGER',
        absenceThreshold: 3,
        absenceWindowDays: 7,
      },
    ]),
    obtenerinstantaneaadvertenciaestudiante: jest.fn().mockResolvedValue(instantanea),
    conciliaralertastempranas: jest.fn().mockResolvedValue(undefined),
    listaridsestudiantesactivos: jest.fn().mockResolvedValue(['student-1']),
    actualizarregla: jest.fn().mockResolvedValue({}),
  } as unknown as jest.Mocked<repositorioalertas>;
}

describe('Alertas tempranas', () => {
  it('calcula ventanas independientes por fecha de Bolivia', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-03T02:00:00Z'));
    try {
      const repositorio = crearrepositorio();
      repositorio.listarreglas.mockResolvedValue([
        { key: 'REPEATED_ABSENCE', enabled: true, severity: 'WARNING', absenceThreshold: 3, absenceWindowDays: 7 },
        { key: 'REPEATED_LATENESS', enabled: true, severity: 'WARNING', absenceThreshold: 2, absenceWindowDays: 3 },
      ] as never);
      await new casousoevaluaralertasestudiante(repositorio).ejecutar('student-1');
      expect(repositorio.obtenerinstantaneaadvertenciaestudiante).toHaveBeenCalledWith(
        'student-1', new Date('2026-10-27T00:00:00Z'), new Date('2026-11-02T23:59:59.999Z'), new Date('2026-10-31T00:00:00Z'),
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it('evalúa las alertas de cada estudiante activo', async () => {
    const repositorio = crearrepositorio();
    const casoestudiante = new casousoevaluaralertasestudiante(repositorio);
    const caso = new casousoevaluaralertastodosestudiantes(repositorio, casoestudiante);

    const resultado = await caso.ejecutar();

    expect(repositorio.listaridsestudiantesactivos).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({ evaluated: 1, failed: 0 });
    expect(repositorio.obtenerinstantaneaadvertenciaestudiante).toHaveBeenCalledWith(
      'student-1',
      expect.any(Date),
      expect.any(Date),
      expect.any(Date),
    );
  });

  it('crea avisos deduplicables para familia, estudiante y docente', async () => {
    const repositorio = crearrepositorio();

    await new casousoevaluaralertasestudiante(repositorio).ejecutar('student-1');

    expect(repositorio.obtenerinstantaneaadvertenciaestudiante).toHaveBeenCalledWith(
      'student-1',
      expect.any(Date),
      expect.any(Date),
      expect.any(Date),
    );
    expect(repositorio.conciliaralertastempranas).toHaveBeenCalledTimes(3);
    expect(repositorio.conciliaralertastempranas).toHaveBeenCalledWith('student-1', 'LOW_GRADE', [
      expect.objectContaining({ userId: 'parent-1', deduplicationKey: 'LOW_GRADE:grade-1' }),
      expect.objectContaining({ userId: 'student-user-1', deduplicationKey: 'LOW_GRADE:grade-1' }),
      expect.objectContaining({ userId: 'teacher-1', deduplicationKey: 'LOW_GRADE:grade-1' }),
    ]);
    expect(repositorio.conciliaralertastempranas).toHaveBeenCalledWith(
      'student-1',
      'REPEATED_ABSENCE',
      [
        expect.objectContaining({
          userId: 'parent-1',
          deduplicationKey: 'REPEATED_ABSENCE:student-1:course-1:7',
        }),
        expect.objectContaining({
          userId: 'student-user-1',
          deduplicationKey: 'REPEATED_ABSENCE:student-1:course-1:7',
        }),
        expect.objectContaining({
          userId: 'teacher-1',
          deduplicationKey: 'REPEATED_ABSENCE:student-1:course-1:7',
          severity: 'DANGER',
        }),
      ],
    );
  });

  it('no consulta datos cuando todas las reglas están desactivadas', async () => {
    const repositorio = crearrepositorio();
    repositorio.listarreglas.mockResolvedValue([
      { key: 'LOW_GRADE', enabled: false, severity: 'WARNING', gradeThreshold: 51 },
      {
        key: 'REPEATED_ABSENCE',
        enabled: false,
        severity: 'WARNING',
        absenceThreshold: 3,
        absenceWindowDays: 7,
      },
    ] as never);

    await new casousoevaluaralertasestudiante(repositorio).ejecutar('student-1');

    expect(repositorio.obtenerinstantaneaadvertenciaestudiante).not.toHaveBeenCalled();
    expect(repositorio.conciliaralertastempranas).toHaveBeenNthCalledWith(
      1,
      'student-1',
      'LOW_GRADE',
      [],
    );
    expect(repositorio.conciliaralertastempranas).toHaveBeenNthCalledWith(
      2,
      'student-1',
      'REPEATED_ABSENCE',
      [],
    );
  });

  it('mantiene los avisos existentes hasta que una persona los resuelva formalmente', async () => {
    const repositorio = crearrepositorio();
    repositorio.listarreglas.mockResolvedValue([
      { key: 'LOW_GRADE', enabled: true, severity: 'WARNING', gradeThreshold: 51 },
      {
        key: 'REPEATED_ABSENCE',
        enabled: false,
        severity: 'WARNING',
        absenceThreshold: 3,
        absenceWindowDays: 7,
      },
    ] as never);
    repositorio.obtenerinstantaneaadvertenciaestudiante.mockResolvedValue({
      ...instantanea,
      grades: [{ ...instantanea.grades[0], value: 80 }],
      absences: [],
    });

    await new casousoevaluaralertasestudiante(repositorio).ejecutar('student-1');

    expect(repositorio.conciliaralertastempranas).toHaveBeenCalledWith(
      'student-1',
      'LOW_GRADE',
      [],
    );
    expect(repositorio.conciliaralertastempranas).toHaveBeenCalledWith(
      'student-1',
      'REPEATED_ABSENCE',
      [],
    );
  });

  it('valida umbrales antes de persistir una regla', async () => {
    const repositorio = crearrepositorio();
    const usocaso = new casousoactualizarreglaalerta(repositorio);

    expect(() =>
      usocaso.ejecutar(
        {
          key: 'LOW_GRADE',
          enabled: true,
          severity: 'WARNING',
          gradeThreshold: 101,
        },
        'admin-1',
      ),
    ).toThrow(incumplimientoregladominio);
    expect(repositorio.actualizarregla).not.toHaveBeenCalled();
  });
});
