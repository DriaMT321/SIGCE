import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { actualizacionreglaalerta } from '../entities/alertaregla.entity';
import { validarconfiguracionreglaalerta } from './alertareglapolitica';

const bajocalificacionregla: actualizacionreglaalerta = {
  key: 'LOW_GRADE',
  enabled: true,
  severity: 'WARNING',
  gradeThreshold: 0,
};

const reglaausenciareiterada: actualizacionreglaalerta = {
  key: 'REPEATED_ABSENCE',
  enabled: true,
  severity: 'WARNING',
  absenceThreshold: 1,
  absenceWindowDays: 365,
};

describe('alert rule policy', () => {
  it('accepts grade thresholds within the permitted range', () => {
    expect(() => validarconfiguracionreglaalerta(bajocalificacionregla)).not.toThrow();
    expect(() =>
      validarconfiguracionreglaalerta({ ...bajocalificacionregla, gradeThreshold: 100 }),
    ).not.toThrow();
  });

  it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid grade threshold %s',
    (umbralcalificacion) => {
      expect(() =>
        validarconfiguracionreglaalerta({
          ...bajocalificacionregla,
          gradeThreshold: umbralcalificacion,
        }),
      ).toThrow(incumplimientoregladominio);
    },
  );

  it('accepts integer absence thresholds and windows within the permitted ranges', () => {
    expect(() => validarconfiguracionreglaalerta(reglaausenciareiterada)).not.toThrow();
    expect(() =>
      validarconfiguracionreglaalerta({
        ...reglaausenciareiterada,
        absenceThreshold: 30,
        absenceWindowDays: 1,
      }),
    ).not.toThrow();
  });

  it.each([
    { absenceThreshold: 0, absenceWindowDays: 30 },
    { absenceThreshold: 31, absenceWindowDays: 30 },
    { absenceThreshold: 1.5, absenceWindowDays: 30 },
    { absenceThreshold: 1, absenceWindowDays: 0 },
    { absenceThreshold: 1, absenceWindowDays: 366 },
    { absenceThreshold: 1, absenceWindowDays: 1.5 },
  ])('rejects invalid absence rule values $absenceThreshold / $absenceWindowDays', (valores) => {
    expect(() =>
      validarconfiguracionreglaalerta({ ...reglaausenciareiterada, ...valores }),
    ).toThrow(incumplimientoregladominio);
  });
});
