import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  gestionestudiante,
  type puertogestionestudiante,
  type estudianteregistroentrada,
} from '../src/features/students/application/gestionestudiantes.ts';

function crearpuerto(cambios: Partial<puertogestionestudiante> = {}): puertogestionestudiante {
  return {
    buscarcoincidencias: async () => [],
    listarestudiantes: async () => ({ data: [], total: 0 }),
    listarfamiliares: async () => ({ data: [] }),
    listarestudiantedocumentoreferencias: async () => [],
    crearestudiante: async () => ({
      student: { firstName: 'Ada', lastName: 'Lovelace' },
      activationToken: 'token',
      activationExpiresAt: '2026-01-01T00:00:00.000Z',
    }),
    reemisionestudianteactivacion: async () => ({
      activationToken: 'token',
      activationExpiresAt: '2026-01-01T00:00:00.000Z',
    }),
    crearestudiantedocumentoreferencia: async () => ({
      id: 'document-1',
      documentType: 'BIRTH_CERTIFICATE',
      reference: 'REF-1',
      notes: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      createdBy: { firstName: 'Ada', lastName: 'Lovelace' },
    }),
    eliminarestudiante: async () => undefined,
    ...cambios,
  };
}

test('normaliza identificadores en la búsqueda de coincidencias y evita buscar sin datos', async () => {
  const consultas: Array<{ rude?: string; ci?: string }> = [];
  const gestion = new gestionestudiante(crearpuerto({
    buscarcoincidencias: async (entrada) => { consultas.push(entrada); return []; },
  }));
  await gestion.buscarcoincidencias({ rude: ' RUDE-1 ', ci: ' 1234567 ' });
  await gestion.buscarcoincidencias({ rude: '  ' });
  assert.deepEqual(consultas, [{ rude: 'RUDE-1', ci: '1234567' }]);
});

test('normalizes registration and defaults a linked parent relationship to tutor', async () => {
  let recibidoentrada: estudianteregistroentrada | undefined;
  const gestion = new gestionestudiante(
    crearpuerto({
      crearestudiante: async (entrada) => {
        recibidoentrada = entrada;
        return {
          student: { firstName: entrada.firstName, lastName: entrada.lastName },
          activationToken: 'token',
          activationExpiresAt: '2026-01-01T00:00:00.000Z',
        };
      },
    }),
  );

  await gestion.registrarestudiante({
    rude: ' RUDE-1 ',
    ci: ' 123 ',
    firstName: ' Ana ',
    lastName: ' Pérez ',
    birthDate: '2010-01-01',
    gender: 'FEMALE',
    phone: ' 70000000 ',
    parentId: ' parent-1 ',
  });

  assert.deepEqual(recibidoentrada, {
    rude: 'RUDE-1',
    ci: '123',
    firstName: 'Ana',
    lastName: 'Pérez',
    birthDate: '2010-01-01',
    gender: 'FEMALE',
    phone: '70000000',
    parentId: 'parent-1',
    relationship: 'TUTOR',
  });
});

test('rejects short document references before calling the gateway', () => {
  let puertollamado = false;
  const gestion = new gestionestudiante(
    crearpuerto({
      crearestudiantedocumentoreferencia: async () => {
        puertollamado = true;
        return crearpuerto().crearestudiantedocumentoreferencia('student-1', {
          documentType: 'BIRTH_CERTIFICATE',
          reference: 'ok',
        });
      },
    }),
  );

  assert.throws(
    () =>
      gestion.crearestudiantedocumentoreferencia('student-1', {
        documentType: 'BIRTH_CERTIFICATE',
        reference: ' x ',
      }),
    /al menos dos caracteres/,
  );
  assert.equal(puertollamado, false);
});

test('rejects blank identifiers before looking up document references', () => {
  const gestion = new gestionestudiante(crearpuerto());

  assert.throws(
    () => gestion.listarestudiantedocumentoreferencias('   '),
    /identificador del estudiante/,
  );
});
