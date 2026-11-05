import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  obtenercantidadperiodosdiarios,
  obtenerfranjasperiodosdiarios,
  obtenerminutosperiodopedagogico,
  obtenierniveleducativoregular,
} from './calendarioacademico';

test('clasifica los grados de educación regular en sus límites', () => {
  assert.equal(obtenierniveleducativoregular(1), 'INITIAL');
  assert.equal(obtenierniveleducativoregular(3), 'PRIMARY');
  assert.equal(obtenierniveleducativoregular(9), 'SECONDARY');
  assert.equal(obtenierniveleducativoregular(0), null);
  assert.equal(obtenierniveleducativoregular(15), null);
});

test('rechaza grados que no sean enteros', () => {
  assert.equal(obtenierniveleducativoregular(3.5), null);
});

test('usa seis periodos en inicial y en los demás grados regulares', () => {
  assert.equal(obtenercantidadperiodosdiarios(2), 6);
  assert.equal(obtenercantidadperiodosdiarios(3), 6);
  assert.throws(() => obtenercantidadperiodosdiarios(15), RangeError);
});

test('reduce los periodos nocturnos solo en primaria y secundaria', () => {
  assert.equal(obtenerminutosperiodopedagogico(2, 'EVENING'), 45);
  assert.equal(obtenerminutosperiodopedagogico(3, 'EVENING'), 35);
  assert.equal(obtenerminutosperiodopedagogico(3, 'MORNING'), 45);
});

test('inserta un único recreo central en el horario diario (09:45 a 10:15)', () => {
  const periodos = obtenerfranjasperiodosdiarios(3, 'MORNING');

  assert.equal(periodos.length, 6);
  assert.deepEqual(periodos.slice(0, 4), [
    { indiceperiodo: 1, horainicio: '07:30', horafin: '08:15' },
    { indiceperiodo: 2, horainicio: '08:15', horafin: '09:00' },
    { indiceperiodo: 3, horainicio: '09:00', horafin: '09:45' },
    { indiceperiodo: 4, horainicio: '10:15', horafin: '11:00' },
  ]);
  assert.equal(periodos[5].horafin, '12:30');
});
