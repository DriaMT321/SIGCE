import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  gestionusuario,
  type puertogestionusuario,
} from '../src/features/users/application/gestionusuarios.ts';

function crearpuerto(sobrescrituras: Partial<puertogestionusuario> = {}): puertogestionusuario {
  return {
    listarusuarios: async () => ({ data: [], total: 0 }),
    crearusuario: async () => undefined,
    establecerusuarioactivo: async () => undefined,
    restablecercontrasena: async () => undefined,
    ...sobrescrituras,
  };
}

test('rechaza contraseñas cortas antes de crear la cuenta', () => {
  let puertollamado = false;
  const gestion = new gestionusuario(
    crearpuerto({
      crearusuario: async () => {
        puertollamado = true;
      },
    }),
  );

  assert.throws(
    () =>
      gestion.crearusuario({
        email: 'persona@example.test',
        password: 'corta123456',
        firstName: 'Ana',
        lastName: 'Paz',
        role: 'PARENT',
      }),
    /al menos 12 caracteres/,
  );
  assert.equal(puertollamado, false);
});

test('rechaza contraseñas superiores a 72 bytes UTF-8 antes del restablecimiento', () => {
  let puertollamado = false;
  const gestion = new gestionusuario(
    crearpuerto({
      restablecercontrasena: async () => {
        puertollamado = true;
      },
    }),
  );

  assert.throws(() => gestion.restablecercontrasena('usuario-1', 'á'.repeat(37)), /72 bytes UTF-8/);
  assert.equal(puertollamado, false);
});

test('rechaza contraseñas compuestas solo por espacios Unicode antes de crear la cuenta', () => {
  let puertollamado = false;
  const gestion = new gestionusuario(
    crearpuerto({
      crearusuario: async () => {
        puertollamado = true;
      },
    }),
  );

  assert.throws(
    () =>
      gestion.crearusuario({
        email: 'persona@example.test',
        password: '\u0085'.repeat(12),
        firstName: 'Ana',
        lastName: 'Paz',
        role: 'PARENT',
      }),
    /solo espacios/,
  );
  assert.equal(puertollamado, false);
});

test('exige los datos propios del perfil docente antes de llamar al puerto', () => {
  let puertollamado = false;
  const gestion = new gestionusuario(
    crearpuerto({
      crearusuario: async () => {
        puertollamado = true;
      },
    }),
  );

  assert.throws(
    () =>
      gestion.crearusuario({
        email: 'docente@example.test',
        password: 'clave-docente-segura-123',
        firstName: 'Ana',
        lastName: 'Paz',
        role: 'TEACHER',
      }),
    /cédula es obligatoria/,
  );
  assert.equal(puertollamado, false);
});

test('normaliza y conserva los datos del perfil docente para su endpoint dedicado', async () => {
  let recibido: Parameters<puertogestionusuario['crearusuario']>[0] | undefined;
  const gestion = new gestionusuario(
    crearpuerto({
      crearusuario: async (entrada) => {
        recibido = entrada;
      },
    }),
  );

  await gestion.crearusuario({
    email: ' DOCENTE@EXAMPLE.TEST ',
    password: 'clave-docente-segura-123',
    firstName: ' Ana ',
    lastName: ' Paz ',
    role: 'TEACHER',
    ci: ' 1234567 ',
    specialty: ' Matemática ',
  });

  assert.deepEqual(recibido, {
    email: 'docente@example.test',
    password: 'clave-docente-segura-123',
    firstName: 'Ana',
    lastName: 'Paz',
    role: 'TEACHER',
    ci: '1234567',
    specialty: 'Matemática',
    phone: undefined,
    itemNumber: undefined,
  });
});
