import assert from 'node:assert/strict';
import { test } from 'node:test';
import { seleccionarcursoauditoria } from './seleccionarcursoauditoria';

const cursos = [
  { text: 'Primaria - Primero A' },
  { text: 'Primaria - Segundo A' },
  { text: 'Secundaria - Primero B' },
];

test('usa un límite positivo por defecto y acepta un límite explícito', () => {
  const mascursos = [...cursos, ...cursos];
  assert.deepEqual(seleccionarcursoauditoria(mascursos), mascursos.slice(0, 3));
  assert.deepEqual(seleccionarcursoauditoria(cursos, undefined, 2), cursos.slice(0, 2));
  assert.deepEqual(seleccionarcursoauditoria(cursos, '2'), cursos.slice(0, 2));
});

test('filtra cursos por texto sin distinguir mayúsculas', () => {
  assert.deepEqual(seleccionarcursoauditoria(cursos, 'secundaria'), [cursos[2]]);
});

test('rechaza límites cero, negativos, decimales y selecciones vacías', () => {
  for (const argumento of ['0', '-1', '1.5']) {
    assert.throws(() => seleccionarcursoauditoria(cursos, argumento), /entero mayor que cero/);
  }
  assert.throws(() => seleccionarcursoauditoria([], undefined), /No hay cursos/);
  assert.throws(() => seleccionarcursoauditoria(cursos, 'inexistente'), /No hay cursos/);
});
