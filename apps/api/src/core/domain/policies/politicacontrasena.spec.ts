import { incumplimientoregladominio } from '../violacionregladominio';
import { validarcontrasena } from './politicacontrasena';

describe('politica de contraseña', () => {
  it('acepta contraseñas que cumplen longitud y límite UTF-8', () => {
    expect(() => validarcontrasena('clave-segura-123')).not.toThrow();
  });

  it('rechaza menos de 12 caracteres', () => {
    expect(() => validarcontrasena('corta123456')).toThrow(incumplimientoregladominio);
    expect(() => validarcontrasena(' '.repeat(12))).toThrow(incumplimientoregladominio);
    expect(() => validarcontrasena('\u00a0'.repeat(12))).toThrow(incumplimientoregladominio);
    expect(() => validarcontrasena('\u0085'.repeat(12))).toThrow(incumplimientoregladominio);
    expect(() => validarcontrasena('  clave-segura-123  ')).not.toThrow();
  });

  it('rechaza más de 72 bytes UTF-8 aunque sean menos caracteres', () => {
    expect(() => validarcontrasena('á'.repeat(37))).toThrow(incumplimientoregladominio);
  });
});
