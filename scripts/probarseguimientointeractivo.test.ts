import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const codigo = readFileSync(new URL('./probarseguimientointeractivo.ts', import.meta.url), 'utf8');

test('el HUD representa los valores del SIE como texto, no como HTML', () => {
  assert.match(codigo, /courseNameEl\.textContent = String\(result\.courseName \?\? ''\)/);
  assert.match(codigo, /messageEl\.textContent = String\(result\.message \?\? ''\)/);
  assert.doesNotMatch(codigo, /contentEl\.innerHTML\s*=/);
});
