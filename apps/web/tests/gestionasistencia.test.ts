import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  gestionasistencia,
  type puertogestionasistencia,
  type registroasistenciaentrada,
} from '../src/features/attendance/application/gestionasistencia.ts';

function crearpuerto(
  sobrescrituras: Partial<puertogestionasistencia> = {},
): puertogestionasistencia {
  return {
    listarasistencia: async () => ({ data: [], total: 0 }),
    listarestudiantes: async () => [],
    listarcursos: async () => [],
    registroasistencia: async () => undefined,
    ...sobrescrituras,
  };
}

test('normalizes attendance input before calling the gateway', async () => {
  let recibidoentrada: registroasistenciaentrada | undefined;
  const gestion = new gestionasistencia(
    crearpuerto({
      registroasistencia: async (entrada) => {
        recibidoentrada = entrada;
      },
    }),
  );

  await gestion.registroasistencia({
    studentId: ' student-1 ',
    courseId: ' course-1 ',
    date: ' 2026-10-22 ',
    status: 'JUSTIFIED',
    justification: '  Cita médica  ',
  });

  assert.deepEqual(recibidoentrada, {
    studentId: 'student-1',
    courseId: 'course-1',
    date: '2026-10-22',
    status: 'JUSTIFIED',
    justification: 'Cita médica',
  });
});

test('loads every page of existing attendance before preparing a course sheet', async () => {
  const offsets: number[] = [];
  const records = Array.from({ length: 201 }, (_, index) => ({
    id: `attendance-${index}`,
    studentId: `student-${index}`,
    courseId: 'course-1',
    date: '2026-10-22',
    status: 'PRESENT' as const,
    justification: null,
    student: { firstName: 'A', lastName: 'B' },
    course: { id: 'course-1', name: 'Curso' },
  }));
  const gestion = new gestionasistencia(
    crearpuerto({
      listarasistencia: async (filtros) => {
        const offset = filtros?.offset ?? 0;
        offsets.push(offset);
        return { data: records.slice(offset, offset + 200), total: records.length };
      },
    }),
  );

  const resultado = await gestion.listarasistenciacursofecha('course-1', '2026-10-22');
  assert.deepEqual(offsets, [0, 200]);
  assert.equal(resultado.length, 201);
  assert.equal(resultado[200].studentId, 'student-200');
});

test('rejects an incomplete attendance listing before allowing a course sheet', async () => {
  const gestion = new gestionasistencia(
    crearpuerto({
      listarasistencia: async () => ({ data: [], total: 2 }),
    }),
  );
  await assert.rejects(
    gestion.listarasistenciacursofecha('course-1', '2026-10-22'),
    /lista|toda la asistencia/i,
  );
});

test('validates every justification before creating any course attendance', async () => {
  let llamadas = 0;
  const gestion = new gestionasistencia(
    crearpuerto({
      registroasistencia: async () => {
        llamadas += 1;
      },
    }),
  );
  await assert.rejects(
    gestion.registrarasistenciascurso([
      { studentId: 's1', courseId: 'c1', date: '2026-10-22', status: 'PRESENT' },
      {
        studentId: 's2',
        courseId: 'c1',
        date: '2026-10-22',
        status: 'JUSTIFIED',
        justification: ' ',
      },
    ]),
    /requiere indicar el motivo/,
  );
  assert.equal(llamadas, 0);
});

test('returns individual failures without repeating successful attendance', async () => {
  const enviados: string[] = [];
  const gestion = new gestionasistencia(
    crearpuerto({
      registroasistencia: async (entrada) => {
        enviados.push(entrada.studentId);
        if (entrada.studentId === 's2') throw new Error('Ya existe');
      },
    }),
  );
  const resultado = await gestion.registrarasistenciascurso([
    { studentId: 's1', courseId: 'c1', date: '2026-10-22', status: 'PRESENT' },
    { studentId: 's2', courseId: 'c1', date: '2026-10-22', status: 'ABSENT' },
    { studentId: 's3', courseId: 'c1', date: '2026-10-22', status: 'LATE' },
  ]);
  assert.deepEqual(enviados, ['s1', 's2', 's3']);
  assert.deepEqual(resultado.guardados, ['s1', 's3']);
  assert.deepEqual(resultado.fallidos, [{ studentId: 's2', message: 'Ya existe' }]);
});

test('rejects justified attendance without a reason before calling the gateway', () => {
  let puertollamado = false;
  const gestion = new gestionasistencia(
    crearpuerto({
      registroasistencia: async () => {
        puertollamado = true;
      },
    }),
  );

  assert.throws(
    () =>
      gestion.registroasistencia({
        studentId: 'student-1',
        courseId: 'course-1',
        date: '2026-10-22',
        status: 'JUSTIFIED',
        justification: '  ',
      }),
    /requiere indicar el motivo/,
  );
  assert.equal(puertollamado, false);
});
