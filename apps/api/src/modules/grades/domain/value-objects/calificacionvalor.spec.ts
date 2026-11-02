import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { valorcalificacion } from './calificacionvalor';

describe('GradeValue', () => {
  it.each([0, 62.5, 100])('accepts a score in the academic range: %s', (valor) => {
    expect(valorcalificacion.desde(valor).valor).toBe(valor);
  });

  it.each([-0.01, 100.01, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects a score outside the academic range: %s',
    (valor) => expect(() => valorcalificacion.desde(valor)).toThrow(incumplimientoregladominio),
  );
});
