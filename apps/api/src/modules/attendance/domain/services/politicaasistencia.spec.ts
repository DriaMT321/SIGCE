import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { exigirasistenciavalida, obtenerdiaasistencia } from './politicaasistencia';

describe('attendance policy', () => {
  it('requires a reason when an attendance record is justified', () => {
    expect(() => exigirasistenciavalida('JUSTIFIED', '  ')).toThrow(incumplimientoregladominio);
    expect(() => exigirasistenciavalida('JUSTIFIED', 'Constancia médica')).not.toThrow();
  });

  it('normalizes a valid calendar day to UTC midnight', () => {
    expect(obtenerdiaasistencia('2026-03-04')).toEqual(new Date('2026-03-04T00:00:00.000Z'));
  });

  it('rejects an impossible calendar date', () => {
    expect(() => obtenerdiaasistencia('2026-02-30')).toThrow(incumplimientoregladominio);
  });
});
