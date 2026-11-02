import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  gestioncalificacion,
  type puertogestioncalificacion,
} from '../src/features/grades/application/gestioncalificaciones.ts';
import { cargarcalificacionesplanilla, interpretarcalificacion, prepararcalificacionesplanilla } from '../src/features/grades/application/planillacalificaciones.ts';

test('carga todas las páginas de notas del curso, materia y período seleccionados', async () => {
  const filtrosrecibidos: unknown[] = [];
  const gestion = {
    buscarcalificaciones: async (filtros: { offset: number }) => {
      filtrosrecibidos.push(filtros);
      const id = filtros.offset === 0 ? '1' : '2';
      return { data: [{ id }] as never[], total: 2 };
    },
  };
  const notas = await cargarcalificacionesplanilla(gestion, {
    courseId: 'curso', subjectId: 'materia', periodId: 'periodo',
  });
  assert.deepEqual(notas.map((nota) => nota.id), ['1', '2']);
  assert.deepEqual(filtrosrecibidos, [
    { courseId: 'curso', subjectId: 'materia', periodId: 'periodo', offset: 0 },
    { courseId: 'curso', subjectId: 'materia', periodId: 'periodo', offset: 1 },
  ]);
});

test('rechaza la carga incompleta o páginas duplicadas en la planilla', async () => {
  const filtros = { courseId: 'curso', subjectId: 'materia', periodId: 'periodo' };
  await assert.rejects(cargarcalificacionesplanilla({
    buscarcalificaciones: async () => ({ data: [], total: 1 }),
  }, filtros), /todas las calificaciones/);
  await assert.rejects(cargarcalificacionesplanilla({
    buscarcalificaciones: async () => ({ data: [{ id: '1' }] as never[], total: 2 }),
  }, filtros), /cambiaron durante la carga/);
});

test('distingue una nota vacía del cero y conserva el valor inválido para corregirlo', () => {
  assert.deepEqual(interpretarcalificacion(''), { tipo: 'vacia' });
  assert.deepEqual(interpretarcalificacion('0'), { tipo: 'valida', valor: 0 });
  assert.deepEqual(interpretarcalificacion('100'), { tipo: 'valida', valor: 100 });
  assert.deepEqual(interpretarcalificacion('75,5'), { tipo: 'valida', valor: 75.5 });
  assert.deepEqual(interpretarcalificacion('0x64'), { tipo: 'invalida' });
  assert.deepEqual(interpretarcalificacion('-1'), { tipo: 'invalida' });
  assert.deepEqual(interpretarcalificacion('101'), { tipo: 'invalida' });
  assert.deepEqual(interpretarcalificacion('hola'), { tipo: 'invalida' });
});

test('el guardado rechaza valores inválidos y no reenvía notas que no cambiaron', () => {
  const estudiantes = ['a', 'b', 'c'].map((id) => ({
    id, rude: '', ci: '', firstName: '', lastName: '',
    enrollments: [{ id: `mat-${id}`, status: 'ACTIVE', course: { id: 'curso', name: '', gradeLevel: 1 }, academicYear: { id: 'gestion', year: 2026 } }],
  }));
  const entrada = {
    estudiantes,
    registradas: [{ enrollmentId: 'mat-a', value: 80, remarks: null }] as never[],
    valores: { a: '80', b: '101', c: '' },
    observaciones: {}, courseId: 'curso', academicYearId: 'gestion',
  };
  assert.throws(() => prepararcalificacionesplanilla(entrada), /Corrige las notas señaladas/);
  assert.equal(entrada.valores.a, '80');
  assert.equal(entrada.valores.b, '101');
  entrada.valores.b = '0';
  assert.deepEqual(prepararcalificacionesplanilla(entrada), [
    { studentId: 'b', enrollmentId: 'mat-b', value: 0, remarks: undefined },
  ]);
});

function crearpuerto(
  sobrescrituras: Partial<puertogestioncalificacion> = {},
): puertogestioncalificacion {
  return {
    listarcalificaciones: async () => [],
    listarestudiantes: async () => [],
    listarcursos: async () => [],
    listarmaterias: async () => [],
    listarperiodos: async () => [],
    crearcalificacion: async () => undefined,
    crearmasivocalificaciones: async () => ({ count: 0, items: [] }),
    actualizarperiodo: async () => undefined,
    obtenerperiodocierrevistaprevia: async () => ({
      id: 'period-1',
      name: 'Primer periodo',
      isClosed: false,
      gradeCount: 0,
      studentCount: 0,
    }),
    listarpendientecorrecciones: async () => [],
    enviarcorreccion: async () => undefined,
    decidircorreccion: async () => undefined,
    ...sobrescrituras,
  };
}

test('normalizes blank remarks before creating a grade', async () => {
  let recibidoobservacion: string | undefined = 'not called';
  const gestion = new gestioncalificacion(
    crearpuerto({
      crearcalificacion: async (entrada) => {
        recibidoobservacion = entrada.remarks;
      },
    }),
  );

  await gestion.crearcalificacion({
    enrollmentId: 'enrollment-1',
    studentId: 'student-1',
    subjectId: 'subject-1',
    periodId: 'period-1',
    value: 80,
    remarks: '   ',
  });

  assert.equal(recibidoobservacion, undefined);
});

test('trims bulk remarks without changing the remaining grade data', async () => {
  let recibidoentrada:
    Parameters<puertogestioncalificacion['crearmasivocalificaciones']>[0] | undefined;
  const gestion = new gestioncalificacion(
    crearpuerto({
      crearmasivocalificaciones: async (entrada) => {
        recibidoentrada = entrada;
        return { count: entrada.grades.length, items: [] };
      },
    }),
  );

  await gestion.crearmasivocalificaciones({
    courseId: 'course-1',
    subjectId: 'subject-1',
    periodId: 'period-1',
    grades: [
      {
        studentId: 'student-1',
        enrollmentId: 'enrollment-1',
        value: 80,
        remarks: '  Buen avance  ',
      },
      { studentId: 'student-2', enrollmentId: 'enrollment-2', value: 72, remarks: '   ' },
    ],
  });

  assert.deepEqual(recibidoentrada?.grades, [
    { studentId: 'student-1', enrollmentId: 'enrollment-1', value: 80, remarks: 'Buen avance' },
    { studentId: 'student-2', enrollmentId: 'enrollment-2', value: 72, remarks: undefined },
  ]);
});

test('trims the reason and evidence reference when submitting a correction', async () => {
  let recibidoentrada: Parameters<puertogestioncalificacion['enviarcorreccion']>[0] | undefined;
  const gestion = new gestioncalificacion(
    crearpuerto({
      enviarcorreccion: async (entrada) => {
        recibidoentrada = entrada;
      },
    }),
  );

  await gestion.enviarcorreccion({
    gradeId: 'grade-1',
    proposedValue: 85,
    reason: ' Error de transcripción ',
    evidenceReference: ' ACTA-2026-01 ',
  });

  assert.deepEqual(recibidoentrada, {
    gradeId: 'grade-1',
    proposedValue: 85,
    reason: 'Error de transcripción',
    evidenceReference: 'ACTA-2026-01',
  });
});
