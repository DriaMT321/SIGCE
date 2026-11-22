import { tipotraslado, causaltraslado, fasetraslado } from '@academic/domain-kernel';
import { politicatraslado } from './trasladopolitica';

describe('politicatraslado (R.M. 0001 / Ley 070)', () => {
  const baseHechos = {
    studentActive: true,
    academicYearOpen: true,
    transferType: tipotraslado.REGULAR,
    causal: causaltraslado.DOMICILIO,
    causalDetails: 'Cambio de zona a nuevo domicilio familiar',
    originSchool: 'Colegio Simón Bolívar',
    destinationSchool: 'Colegio San Calixto',
    antiCoercionCertified: true,
    currentTrimester: 1,
  };

  it('permite crear traslado si cumple con todas las condiciones', () => {
    expect(() => politicatraslado.afirmarpuedecreartraslado(baseHechos)).not.toThrow();
  });

  it('rechaza si antiCoercionCertified es falso (violación de garantía de R.M. 0001)', () => {
    expect(() =>
      politicatraslado.afirmarpuedecreartraslado({
        ...baseHechos,
        antiCoercionCertified: false,
      }),
    ).toThrow('La R.M. 0001 prohíbe terminantemente obligar o condicionar traslados');
  });

  it('rechaza si causalDetails contiene coacción por bajo rendimiento escolar', () => {
    expect(() =>
      politicatraslado.afirmarpuedecreartraslado({
        ...baseHechos,
        causalDetails: 'Traslado forzado por bajo rendimiento académico del estudiante',
      }),
    ).toThrow('No se puede tramitar traslados condicionados por rendimiento o indisciplina');
  });

  it('rechaza si la escuela de origen y destino son la misma', () => {
    expect(() =>
      politicatraslado.afirmarpuedecreartraslado({
        ...baseHechos,
        destinationSchool: 'Colegio Simón Bolívar',
      }),
    ).toThrow('La Unidad Educativa de destino no puede ser la misma de origen');
  });

  it('calcula correctamente el plazo de 5 días hábiles saltando fin de semana', () => {
    // Si la fecha es lunes 2026-11-23
    const lunes = new Date(2026, 10, 23, 10, 0, 0); // nov 23, 2026 is Monday
    const limite = politicatraslado.calcularPlazoCincoDiasHabiles(lunes);
    // +5 días hábiles: mar, mie, jue, vie, lun (nov 30)
    expect(limite.getDay()).toBe(1); // lunes siguiente
  });

  it('valida que para registrar en SIE se requiere resolución distrital', () => {
    expect(() =>
      politicatraslado.afirmarpuedeavanzarfase(
        fasetraslado.AUTORIZACION_DISTRITAL,
        fasetraslado.REGISTRO_SIE,
        { distritalResolution: '' },
      ),
    ).toThrow('se requiere el número de Autorización de la Dirección Distrital');
  });
});
