import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as bcrypt from 'bcryptjs';
import {
  generarhashcontrasenaaleatoria,
  obtenerestadoimportado,
  obtenergeneroimportado,
  parsearfechanacimiento,
} from './datosimportacion';

test('parsea fechas válidas sin corregir días inexistentes ni aceptar fechas futuras', () => {
  assert.equal(parsearfechanacimiento('29-02-2024').toISOString(), '2024-02-29T12:00:00.000Z');
  assert.throws(() => parsearfechanacimiento('31-02-2024'), /día válido/);
  assert.throws(() => parsearfechanacimiento('01-01-2999'), /día válido/);
  assert.throws(() => parsearfechanacimiento('fecha desconocida'), /formato válido/);
});

test('lee sexo y estado solo de columnas declaradas y rechaza estados desconocidos', () => {
  assert.equal(obtenergeneroimportado(['NOMBRE', 'SEXO'], ['Andrea', 'Femenino']), 'FEMALE');
  assert.equal(obtenergeneroimportado(['NOMBRE', 'Género'], ['Alex', 'Varón']), 'MALE');
  assert.equal(obtenergeneroimportado(['NOMBRE'], ['Alex']), 'UNSPECIFIED');
  assert.equal(obtenergeneroimportado(['NOMBRE', 'SEXO'], ['Alex', '']), 'UNSPECIFIED');
  assert.equal(
    obtenerestadoimportado(['RUDE', 'ESTADO DE MATRÍCULA'], ['1', 'Retirado']),
    'WITHDRAWN',
  );
  assert.equal(
    obtenerestadoimportado(['RUDE', 'ESTADO DE MATRÍCULA'], ['1', 'Inscrito']),
    'ACTIVE',
  );
  assert.throws(() => obtenerestadoimportado(['RUDE'], ['1']), /no incluye el estado/);
  assert.throws(
    () => obtenerestadoimportado(['ESTADO DE MATRÍCULA'], ['DESCONOCIDO']),
    /no es compatible/,
  );
});

test('crea hashes diferentes y no reutiliza la contraseña docente conocida', () => {
  const primerhash = generarhashcontrasenaaleatoria();
  const segundohash = generarhashcontrasenaaleatoria();
  assert.notEqual(primerhash, segundohash);
  assert.equal(bcrypt.compareSync('Docente2026!', primerhash), false);
});
