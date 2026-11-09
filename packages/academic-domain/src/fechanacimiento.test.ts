import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  edadmaximaestudianteregular,
  edadminimaestudianteregular,
  obtenererrorfechanacimientoestudiante,
  obtenerfechahoybolivia,
} from './fechanacimiento';

test('convierte la fecha actual al calendario local de Bolivia (America/La_Paz, UTC-4)', () => {
  // 2026-11-10T02:30:00Z corresponde a 2026-11-09 22:30 en Bolivia
  const instante = new Date('2026-11-10T02:30:00.000Z');
  assert.equal(obtenerfechahoybolivia(instante), '2026-11-09');
});

test('acepta fechas de nacimiento válidas dentro del rango etario regular', () => {
  const hoyReferencia = new Date('2026-11-09T15:00:00.000Z');
  assert.equal(obtenererrorfechanacimientoestudiante('2015-05-14', hoyReferencia), null);
  // Cumple exactamente 3 años en la fecha de referencia
  assert.equal(obtenererrorfechanacimientoestudiante('2023-11-09', hoyReferencia), null);
  // Cumple exactamente 100 años en la fecha de referencia
  assert.equal(obtenererrorfechanacimientoestudiante('1926-11-09', hoyReferencia), null);
});

test('rechaza formatos inválidos o fechas inexistentes en el calendario', () => {
  const hoyReferencia = new Date('2026-11-09T15:00:00.000Z');
  assert.match(
    obtenererrorfechanacimientoestudiante('14/05/2015', hoyReferencia) ?? '',
    /formato AAAA-MM-DD/i,
  );
  assert.match(
    obtenererrorfechanacimientoestudiante(null, hoyReferencia) ?? '',
    /formato AAAA-MM-DD/i,
  );
  assert.match(
    obtenererrorfechanacimientoestudiante('2015-02-30', hoyReferencia) ?? '',
    /no existe en el calendario/i,
  );
  assert.match(
    obtenererrorfechanacimientoestudiante('2021-02-29', hoyReferencia) ?? '',
    /no existe en el calendario/i,
  );
});

test('rechaza fechas futuras según la hora local de Bolivia', () => {
  const hoyReferencia = new Date('2026-11-10T02:30:00.000Z'); // 2026-11-09 en Bolivia
  assert.match(
    obtenererrorfechanacimientoestudiante('2026-11-10', hoyReferencia) ?? '',
    /posterior a hoy/i,
  );
});

test('rechaza edades fuera del margen permitido (menor a 3 o mayor a 100 años)', () => {
  const hoyReferencia = new Date('2026-11-09T15:00:00.000Z');
  // Un día antes de cumplir 3 años
  assert.match(
    obtenererrorfechanacimientoestudiante('2023-11-10', hoyReferencia) ?? '',
    new RegExp(`${edadminimaestudianteregular} y ${edadmaximaestudianteregular}`),
  );
  // 101 años
  assert.match(
    obtenererrorfechanacimientoestudiante('1925-11-09', hoyReferencia) ?? '',
    new RegExp(`${edadminimaestudianteregular} y ${edadmaximaestudianteregular}`),
  );
});
