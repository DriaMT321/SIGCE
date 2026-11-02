import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { gradeaggregate } from './grade.aggregate';

const entrada = {
  enrollmentId: 'enrollment-1',
  studentId: 'student-1',
  subjectId: 'subject-1',
  periodId: 'period-1',
  value: 75,
};

describe('Grade aggregate', () => {
  it('records only a valid grade attached to an enrollment and academic context', () => {
    expect(gradeaggregate.registrar(entrada).convertiradatoscreacion()).toEqual(entrada);
  });

  it.each([-1, 100.1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects out-of-range or non-finite grade value %s',
    (valor) => {
      expect(() => gradeaggregate.registrar({ ...entrada, value: valor })).toThrow(
        incumplimientoregladominio,
      );
    },
  );

  it('requires references to the student, enrollment, subject, and period', () => {
    expect(() => gradeaggregate.registrar({ ...entrada, studentId: '  ' })).toThrow(
      incumplimientoregladominio,
    );
  });

  it('changes the value through its invariant and trims or clears remarks', () => {
    const calificacion = gradeaggregate.registrar({
      ...entrada,
      remarks: '  Primer registro  ',
    });

    expect(calificacion.revisar({ value: 82, remarks: '' }).convertiradatosactualizacion()).toEqual(
      {
        value: 82,
        remarks: null,
      },
    );
  });

  it('preserves the persisted identity when rehydrating a grade', () => {
    const persistido = {
      id: 'grade-1',
      ...entrada,
      remarks: null,
      publishedAt: null,
      publishedById: null,
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      student: { id: 'student-1', rude: 'R-1', firstName: 'Ana', lastName: 'Pérez' },
      subject: { id: 'subject-1', code: 'MAT', name: 'Matemática' },
      period: { id: 'period-1', name: 'Primer período', number: 1 },
    };

    expect(gradeaggregate.rehidratar(persistido).idPersistido).toBe('grade-1');
    expect(() => gradeaggregate.registrar(entrada).idPersistido).toThrow(
      incumplimientoregladominio,
    );
  });
});
