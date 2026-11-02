import { estadosincronizacionsie } from '@academic/domain-kernel';
import {
  determinarestadogrupodiscrepanciasie,
  calcularestadoreanudacionsie,
} from './politicasincronizacionsie';

describe('políticas de sincronización SIE', () => {
  it('conserva la cola como estado cuando quedan elementos por procesar', () => {
    expect(
      calcularestadoreanudacionsie({
        elementosencola: 2,
        elementosprocesando: 1,
        elementosprocesados: 3,
        elementosesperados: 6,
        cantidaderrores: 0,
        cantidaddiscrepancias: 0,
      }),
    ).toBe(estadosincronizacionsie.QUEUED);
  });

  it('mantiene el lote en proceso mientras haya elementos reclamados', () => {
    expect(
      calcularestadoreanudacionsie({
        elementosencola: 0,
        elementosprocesando: 1,
        elementosprocesados: 2,
        elementosesperados: 3,
        cantidaderrores: 0,
        cantidaddiscrepancias: 0,
      }),
    ).toBe(estadosincronizacionsie.PROCESSING);
  });

  it('rechaza finalizar un lote que conserva elementos sin procesar', () => {
    expect(
      calcularestadoreanudacionsie({
        elementosencola: 0,
        elementosprocesando: 0,
        elementosprocesados: 2,
        elementosesperados: 3,
        cantidaderrores: 0,
        cantidaddiscrepancias: 0,
      }),
    ).toBeNull();
  });

  it.each([
    [1, estadosincronizacionsie.FAILED],
    [0, estadosincronizacionsie.DISCREPANCY],
  ] as const)(
    'cierra el lote con estado final según errores y discrepancias',
    (errores, estado) => {
      expect(
        calcularestadoreanudacionsie({
          elementosencola: 0,
          elementosprocesando: 0,
          elementosprocesados: 3,
          elementosesperados: 3,
          cantidaderrores: errores,
          cantidaddiscrepancias: 1,
        }),
      ).toBe(estado);
    },
  );

  it('marca un grupo resuelto solo cuando no quedan discrepancias pendientes', () => {
    expect(determinarestadogrupodiscrepanciasie(0)).toBe('RESOLVED');
    expect(determinarestadogrupodiscrepanciasie(1)).toBe('IN_PROGRESS');
  });
});
