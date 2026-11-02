import {
  generarhorariosemanal,
  errorgeneracionhorario,
  asignaciondocente,
} from './generarhorariosemanal';

const asignaciones: asignaciondocente[] = [
  {
    subject: { id: 'math', name: 'Matemática', code: 'MAT' },
    teacher: { id: 'teacher-math', firstName: 'Ana', lastName: 'Paz' },
  },
  {
    subject: { id: 'language', name: 'Lenguaje', code: 'LEN' },
    teacher: { id: 'teacher-language', firstName: 'Luis', lastName: 'Rojas' },
  },
  {
    subject: { id: 'science', name: 'Ciencias', code: 'CIE' },
    teacher: { id: 'teacher-science', firstName: 'Marta', lastName: 'Vega' },
  },
];

describe('generateWeeklySchedule', () => {
  it('creates six 40-minute periods for each of five weekdays', () => {
    const resultado = generarhorariosemanal(3, 'MORNING', asignaciones, []);

    expect(resultado.slots).toHaveLength(30);
    expect(resultado.distribution.reduce((suma, elemento) => suma + elemento.periods, 0)).toBe(30);
    for (const dia of ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']) {
      const bloquesdia = resultado.slots.filter((bloque) => bloque.dayOfWeek === dia);
      expect(bloquesdia).toHaveLength(6);
      for (const bloque of bloquesdia) {
        const [iniciohora, iniciominuto] = bloque.startTime.split(':').map(Number);
        const [finhora, finminuto] = bloque.endTime.split(':').map(Number);
        expect(finhora * 60 + finminuto - (iniciohora * 60 + iniciominuto)).toBe(40);
      }
    }
  });

  it('does not invent teacher or subject assignments', () => {
    expect(() => generarhorariosemanal(3, 'MORNING', [], [])).toThrow(errorgeneracionhorario);
  });

  it('rejects a grade outside the regular education catalog', () => {
    expect(() => generarhorariosemanal(15, 'MORNING', asignaciones, [])).toThrow(RangeError);
  });

  it('avoids a teacher conflict when another assigned teacher can cover the slot', () => {
    const ocupado = Array.from({ length: 6 }, (_, indice) => ({
      teacherId: 'teacher-math',
      dayOfWeek: 'LUNES',
      periodIndex: indice + 1,
    }));
    const resultado = generarhorariosemanal(3, 'MORNING', asignaciones, ocupado);

    expect(resultado.slots.filter((bloque) => bloque.dayOfWeek === 'LUNES')).toHaveLength(6);
    expect(
      resultado.slots.some(
        (bloque) => bloque.teacherId === 'teacher-math' && bloque.dayOfWeek === 'LUNES',
      ),
    ).toBe(false);
  });

  it('finds a feasible distribution when one teacher is unavailable for the final ten periods', () => {
    const asignaciones = [
      {
        subject: { id: 'subject-a', name: 'Materia A', code: 'A' },
        teacher: { id: 'teacher-a', firstName: 'Ana', lastName: 'Paz' },
      },
      {
        subject: { id: 'subject-b', name: 'Materia B', code: 'B' },
        teacher: { id: 'teacher-b', firstName: 'Luis', lastName: 'Rojas' },
      },
    ];
    const ocupado = [
      ...[3, 4, 5, 6].map((indiceperiodo) => ({
        teacherId: 'teacher-a',
        dayOfWeek: 'JUEVES',
        periodIndex: indiceperiodo,
      })),
      ...[1, 2, 3, 4, 5, 6].map((indiceperiodo) => ({
        teacherId: 'teacher-a',
        dayOfWeek: 'VIERNES',
        periodIndex: indiceperiodo,
      })),
    ];

    const resultado = generarhorariosemanal(3, 'MORNING', asignaciones, ocupado);

    expect(resultado.slots).toHaveLength(30);
    expect(resultado.slots.filter((bloque) => bloque.teacherId === 'teacher-a')).toHaveLength(15);
    expect(resultado.slots.filter((bloque) => bloque.teacherId === 'teacher-b')).toHaveLength(15);
  });

  it('reports an unfillable schedule when every assignment is occupied', () => {
    const ocupado = asignaciones.map((tarea) => ({
      teacherId: tarea.teacher.id,
      dayOfWeek: 'LUNES',
      periodIndex: 1,
    }));

    expect(() => generarhorariosemanal(3, 'MORNING', asignaciones, ocupado)).toThrow(
      'todos los docentes asignados tienen conflicto',
    );
  });

  it('creates five periods per day for Inicial and keeps each one at 40 minutes', () => {
    const resultado = generarhorariosemanal(2, 'MORNING', asignaciones, []);

    expect(resultado.slots).toHaveLength(25);
    for (const dia of ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']) {
      const bloquesdia = resultado.slots.filter((bloque) => bloque.dayOfWeek === dia);
      expect(bloquesdia).toHaveLength(5);
      for (const bloque of bloquesdia) {
        const [iniciohora, iniciominuto] = bloque.startTime.split(':').map(Number);
        const [finhora, finminuto] = bloque.endTime.split(':').map(Number);
        expect(finhora * 60 + finminuto - (iniciohora * 60 + iniciominuto)).toBe(40);
      }
    }
  });

  it('creates six 35-minute periods for secondary night courses', () => {
    const resultado = generarhorariosemanal(9, 'EVENING', asignaciones, []);

    expect(resultado.slots).toHaveLength(30);
    for (const bloque of resultado.slots) {
      const [iniciohora, iniciominuto] = bloque.startTime.split(':').map(Number);
      const [finhora, finminuto] = bloque.endTime.split(':').map(Number);
      expect(finhora * 60 + finminuto - (iniciohora * 60 + iniciominuto)).toBe(35);
    }
  });
});
