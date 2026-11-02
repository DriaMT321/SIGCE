import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  gestionalertas,
  type alertaregla,
  type alertareglaentrada,
  type alertareglaclave,
  type puertogestionalertas,
} from '../src/features/alerts/application/gestionalertas.ts';

function crearpuerto(sobrescrituras: Partial<puertogestionalertas> = {}): puertogestionalertas {
  return {
    listaralertas: async () => [],
    marcaralertaleer: async () => undefined,
    actualizaralertaestado: async () => undefined,
    listarreglas: async () => [],
    actualizarregla: async (clave, entrada) => ({
      key: clave,
      ...entrada,
      gradeThreshold: entrada.gradeThreshold ?? null,
      absenceThreshold: entrada.absenceThreshold ?? null,
      absenceWindowDays: entrada.absenceWindowDays ?? null,
      updatedAt: '2026-10-22T00:00:00.000Z',
    }),
    evaluarexistentealertas: async () => ({ evaluated: 0, failed: 0 }),
    ...sobrescrituras,
  };
}

test('trims alert identifiers before calling the gateway', async () => {
  let recibidoid: string | undefined;
  const gestion = new gestionalertas(
    crearpuerto({
      marcaralertaleer: async (alertaid) => {
        recibidoid = alertaid;
      },
    }),
  );

  await gestion.marcaralertaleer(' alert-1 ');

  assert.equal(recibidoid, 'alert-1');
});

test('rejects absence thresholds outside the range or fractional before updating a rule', () => {
  let puertollamado = false;
  const gestion = new gestionalertas(
    crearpuerto({
      actualizarregla: async (
        _clave: alertareglaclave,
        _entrada: alertareglaentrada,
      ): Promise<alertaregla> => {
        puertollamado = true;
        throw new Error('Gateway should not be called');
      },
    }),
  );

  for (const ausenciaumbral of [0, 31, 1.5]) {
    assert.throws(
      () =>
        gestion.actualizarregla('REPEATED_ABSENCE', {
          enabled: true,
          severity: 'WARNING',
          absenceThreshold: ausenciaumbral,
          absenceWindowDays: 7,
        }),
      /fuera del rango permitido/,
    );
  }
  assert.equal(puertollamado, false);
});
