import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  gestionsiesincronizacion,
  type puertogestionsiesincronizacion,
} from '../src/features/sie-sync/application/gestionsincronizacionsie.ts';
import { sieauditoriarespuestadatosesquema } from '../src/features/sie-sync/application/esquemasincronizacionsie.ts';

function crearpuerto(
  sobrescrituras: Partial<puertogestionsiesincronizacion> = {},
): puertogestionsiesincronizacion {
  return {
    obtenerultimoauditoria: async () => sieauditoriarespuestadatosesquema.parse({}),
    ejecutarauditoria: async () => undefined,
    listarsincronizaciones: async () => [],
    resolverdiscrepancia: async () => undefined,
    reintentarelemento: async () => ({ synchronizationId: 'sync-1' }),
    reanudarsincronizacion: async () => ({ synchronizationId: 'sync-1' }),
    suscribirseaestado: () => () => undefined,
    listaracademicogestiones: async () => [],
    listarperiodos: async () => [],
    listarcursos: async () => [],
    listarmaterias: async () => [],
    vistaprevia: async () => {
      throw new Error('Preview gateway not configured');
    },
    encolar: async () => ({ synchronizationId: 'sync-1' }),
    ...sobrescrituras,
  };
}

test('rejects short discrepancy reasons before calling the gateway', () => {
  let puertollamado = false;
  const gestion = new gestionsiesincronizacion(
    crearpuerto({
      resolverdiscrepancia: async () => {
        puertollamado = true;
      },
    }),
  );

  assert.throws(
    () =>
      gestion.resolverdiscrepancia({
        itemId: 'item-1',
        decision: 'KEEP_SIGCE',
        reason: ' corto ',
      }),
    /al menos 8 caracteres/,
  );
  assert.equal(puertollamado, false);
});

test('requires a non-empty fingerprint before enqueueing a synchronization', () => {
  let puertollamado = false;
  const gestion = new gestionsiesincronizacion(
    crearpuerto({
      encolar: async () => {
        puertollamado = true;
        return { synchronizationId: 'sync-1' };
      },
    }),
  );

  assert.throws(
    () =>
      gestion.encolar({
        academicYearId: 'year-1',
        periodNumber: 1,
        confirmSend: true,
        expectedFingerprint: '  ',
        expectedGradeCount: 4,
      }),
    /confirmar el resumen/,
  );
  assert.equal(puertollamado, false);
});
