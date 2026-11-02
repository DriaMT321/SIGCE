import { validarcampospaginasielocal } from './verificacionpreviapaginassielocal';

describe('assertLocalSiePageFields', () => {
  it('permite continuar cuando todos los campos de verificación existen', () => {
    expect(() =>
      validarcampospaginasielocal(['rude', 'year', 'period', 'subject', 'grade']),
    ).not.toThrow();
  });

  it('detiene la lectura si falta un campo requerido', () => {
    expect(() => validarcampospaginasielocal(['rude', 'year', 'period', 'grade'])).toThrow(
      'no contiene los campos requeridos: subject',
    );
  });
});
