import { instantaneaadvertenciaestudiante } from '../repositories/alerta.repository.interface';
import { generaralertastempranas, obtenerventanaalertadias } from './evaluaralertastempranas';

const instantanea: instantaneaadvertenciaestudiante = {
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
    { courseId: 'course-1', courseName: '6to A', count: 3, teacherUserIds: ['teacher-1'] },
  ],
  lateness: [
    { courseId: 'course-1', courseName: '6to A', count: 3, teacherUserIds: ['teacher-1'] },
  ],
};

const reglas = [
  {
    key: 'LOW_GRADE',
    enabled: true,
    severity: 'WARNING',
    gradeThreshold: 51,
    absenceThreshold: null,
    absenceWindowDays: null,
    updatedAt: new Date(0),
  },
  {
    key: 'REPEATED_ABSENCE',
    enabled: true,
    severity: 'DANGER',
    gradeThreshold: null,
    absenceThreshold: 3,
    absenceWindowDays: 7,
    updatedAt: new Date(0),
  },
] as const;

describe('evaluación de alertas tempranas', () => {
  it('calcula alertas y destinatarios sin acceder a servicios externos', () => {
    const resultado = generaralertastempranas(instantanea, [...reglas]);

    expect(resultado.calificaciones.map((alerta) => alerta.userId)).toEqual([
      'parent-1',
      'student-user-1',
      'teacher-1',
    ]);
    expect(resultado.inasistencias[0]).toMatchObject({
      ruleKey: 'REPEATED_ABSENCE',
      deduplicationKey: 'REPEATED_ABSENCE:student-1:course-1:7',
      severity: 'DANGER',
    });
  });

  it('genera atrasos al alcanzar el umbral y diferencia estudiantes del mismo curso', () => {
    const regla = { ...reglas[1], key: 'REPEATED_LATENESS' as const, absenceThreshold: 3 };
    const resultado = generaralertastempranas({ ...instantanea, administrativeUserIds: ['director-1'] }, [regla]);
    expect(resultado.atrasos).toHaveLength(4);
    expect(resultado.atrasos.some((alerta) => alerta.userId === 'director-1')).toBe(true);
    expect(resultado.atrasos[0]).toMatchObject({ ruleKey: 'REPEATED_LATENESS', deduplicationKey: 'REPEATED_LATENESS:student-1:course-1:7' });
    const otro = generaralertastempranas({ ...instantanea, studentId: 'student-2' }, [regla]);
    expect(otro.atrasos[0].deduplicationKey).not.toBe(resultado.atrasos[0].deduplicationKey);
    expect(generaralertastempranas(instantanea, [{ ...regla, absenceThreshold: 4 }]).atrasos).toHaveLength(0);
    expect(generaralertastempranas(instantanea, [{ ...regla, enabled: false }]).atrasos).toHaveLength(0);
  });

  it('usa una ventana mínima cuando la regla de inasistencia está desactivada', () => {
    expect(obtenerventanaalertadias([{ ...reglas[1], enabled: false }])).toBe(1);
  });
});
