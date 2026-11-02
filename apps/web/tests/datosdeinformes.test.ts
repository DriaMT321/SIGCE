import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  asistenciaresumen,
  promediocalificacion,
  cargartodospaginas,
} from '../src/features/reports/application/datosdeinformes.ts';

test('loads every page before a report can be exported', async () => {
  const desplazamientos: number[] = [];
  const resultado = await cargartodospaginas(async (desplazamiento) => {
    desplazamientos.push(desplazamiento);
    return { data: [1, 2, 3, 4, 5].slice(desplazamiento, desplazamiento + 2), total: 5 };
  });
  assert.deepEqual(resultado, [1, 2, 3, 4, 5]);
  assert.deepEqual(desplazamientos, [0, 2, 4]);
});

test('does not report a partial page as a complete result', async () => {
  await assert.rejects(
    cargartodospaginas(async (desplazamiento) => ({
      data: desplazamiento === 0 ? [1] : [],
      total: 3,
    })),
    /terminó antes/,
  );
});

test('does not invent averages or attendance rates when records are absent', () => {
  assert.equal(promediocalificacion([]), null);
  assert.equal(asistenciaresumen([]).rate, null);
  assert.equal(promediocalificacion([{ value: 70 }, { value: 85 }]), 77.5);
  assert.deepEqual(
    asistenciaresumen([
      { status: 'PRESENT' },
      { status: 'LATE' },
      { status: 'ABSENT' },
      { status: 'JUSTIFIED' },
    ]),
    { present: 1, late: 1, absent: 1, justified: 1, total: 4, rate: 50 },
  );
});
