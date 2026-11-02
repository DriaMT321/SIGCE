import type { resultadocomparacionestudiante } from '../modelos/modeloauditoriasie';
import { resumircomparacionesie } from './resumircomparacionesie.service';

describe('resumir comparaciones SIE', () => {
  it('calcula coincidencias, discrepancias, promedios y fecha de auditoría', () => {
    const estudiantes: resultadocomparacionestudiante[] = [
      {
        rude: 'RUDE-1',
        studentName: 'Ana',
        courseName: 'Quinto A',
        comparisons: [],
        overallMatch: true,
        totalSubjectsMatched: 3,
        totalDiscrepancies: 0,
        sieAverage: 80,
        sigceAverage: 70,
      },
      {
        rude: 'RUDE-2',
        studentName: 'Luis',
        courseName: 'Quinto A',
        comparisons: [],
        overallMatch: false,
        totalSubjectsMatched: 1,
        totalDiscrepancies: 2,
        sieAverage: 90,
        sigceAverage: 0,
      },
    ];

    expect(resumircomparacionesie(estudiantes, 1, '2026-10-24T12:00:00.000Z')).toEqual({
      totalStudents: 2,
      totalExactMatches: 1,
      totalWithDiscrepancies: 1,
      matchPercentage: 50,
      sieAverage: 85,
      sigceAverage: 70,
      auditedCoursesCount: 1,
      auditedAt: '2026-10-24T12:00:00.000Z',
    });
  });

  it('devuelve ceros para una comparación sin estudiantes', () => {
    expect(resumircomparacionesie([], 0, '2026-10-24T12:00:00.000Z')).toEqual({
      totalStudents: 0,
      totalExactMatches: 0,
      totalWithDiscrepancies: 0,
      matchPercentage: 0,
      sieAverage: 0,
      sigceAverage: 0,
      auditedCoursesCount: 0,
      auditedAt: '2026-10-24T12:00:00.000Z',
    });
  });
});
