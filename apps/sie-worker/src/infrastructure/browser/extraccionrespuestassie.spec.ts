import {
  buscarestudiante,
  construircuerpoactualizacionsie,
  extraerestudiantesie,
  extraerfilasnotasie,
  normalizartexto,
  respuestaindicaerror,
  seleccionarfilaasignatura,
  type jsonvalor,
} from './extraccionrespuestassie';

const estudiantesjson: jsonvalor = {
  data: [
    {
      id: 22220001,
      codigoRude: '900000012026001',
      carnetIdentidad: '9000001',
      eInsId: 500000001,
      paterno: 'Quispe',
      materno: 'Mamani',
      nombre: 'Ana',
      estadomatriculaId: 4,
      nivel: 'Secundaria Comunitaria Productiva',
      grado: 'Primero',
      paralelo: 'B',
    },
  ],
};

const notasjson: jsonvalor = {
  data: {
    asignaturas: [
      {
        asignatura: { id: 1100000001, nombre: 'Matemática' },
        notas: [
          {
            idEstudianteNota: 2590000001,
            idNotaTipo: 6,
            idEstudianteAsignatura: 1100000001,
            nota: 95,
          },
          {
            idEstudianteNota: 2590000002,
            idNotaTipo: 7,
            idEstudianteAsignatura: 1100000001,
            nota: 88,
          },
        ],
      },
      {
        nombreAsignatura: 'Lengua Extranjera',
        idEstudianteAsignatura: '1100000002',
        notas: [
          {
            idEstudianteNota: '2590000003',
            idNotaTipo: '6',
            idEstudianteAsignatura: '1100000002',
            nota: '100',
          },
        ],
      },
    ],
  },
};

describe('extracción de estudiantes del SIE', () => {
  it('normaliza el estudiante y lo encuentra por RUDE sin distinguir mayúsculas', () => {
    const estudiantes = extraerestudiantesie(estudiantesjson);
    expect(estudiantes).toHaveLength(1);
    expect(estudiantes[0]).toMatchObject({
      id: '22220001',
      rude: '900000012026001',
      carnet: '9000001',
      idinscripcion: '500000001',
      nombrecompleto: 'Ana Quispe Mamani',
      grado: 'Primero',
      paralelo: 'B',
      estadomatricula: 4,
    });

    expect(buscarestudiante(estudiantes, ' 900000012026001 ')).toMatchObject({
      encontrado: true,
    });
    expect(buscarestudiante(estudiantes, '000000000000000')).toEqual({
      encontrado: false,
      motivo: 'El RUDE no aparece en la lista de estudiantes del SIE',
    });
  });

  it('no duplica estudiantes cuando el mismo RUDE aparece en varios nodos', () => {
    const estudiantes = extraerestudiantesie({
      lista: estudiantesjson,
      detalle: { codigoRude: '900000012026001', id: 22220001 },
    } as jsonvalor);
    expect(estudiantes).toHaveLength(1);
  });

  it('rechaza un RUDE compartido por dos estudiantes diferentes', () => {
    const estudiantes = extraerestudiantesie({
      data: [
        { codigoRude: 'RUDE123', id: 1, eInsId: 10 },
        { codigoRude: 'RUDE123', id: 2, eInsId: 20 },
      ],
    });
    expect(buscarestudiante(estudiantes, 'RUDE123')).toEqual({
      encontrado: false,
      motivo: 'La lista del SIE devolvió más de un estudiante para el mismo RUDE',
    });
  });
});

describe('extracción de notas del SIE', () => {
  it('recorre asignaturas anidadas y aplana las notas por período', () => {
    const filas = extraerfilasnotasie(notasjson);
    expect(filas).toEqual([
      {
        idEstudianteNota: '2590000001',
        idNotaTipo: 6,
        idEstudianteAsignatura: '1100000001',
        nota: 95,
        asignatura: 'Matemática',
        tipoNotaNombre: null,
      },
      {
        idEstudianteNota: '2590000002',
        idNotaTipo: 7,
        idEstudianteAsignatura: '1100000001',
        nota: 88,
        asignatura: 'Matemática',
        tipoNotaNombre: null,
      },
      {
        idEstudianteNota: '2590000003',
        idNotaTipo: 6,
        idEstudianteAsignatura: '1100000002',
        nota: 100,
        asignatura: 'Lengua Extranjera',
        tipoNotaNombre: null,
      },
    ]);
  });

  it('selecciona únicamente el tipo de nota solicitado', () => {
    const filas = extraerfilasnotasie(notasjson);
    const criterio = { nombre: 'Matemática', codigo: 'MAT-SEC' };

    expect(seleccionarfilaasignatura(filas, criterio, 6)).toEqual({
      encontrado: true,
      fila: expect.objectContaining({ idNotaTipo: 6, nota: 95 }),
    });
    expect(seleccionarfilaasignatura(filas, criterio, 8)).toEqual({
      encontrado: false,
      motivo: 'El SIE no devolvió notas para el tipo de período 8',
    });
  });

  it('no empareja por aproximación una asignatura combinada sin alias explícito', () => {
    const filas = extraerfilasnotasie({
      notas: [
        {
          idEstudianteNota: 1,
          idNotaTipo: 6,
          idEstudianteAsignatura: 10,
          materia: 'Comunicación y Lenguajes: Lengua Castellana y Originaria',
          nota: 90,
        },
      ],
    } as jsonvalor);
    const criterio = { nombre: 'Comunicación y Lenguajes: Lengua Castellana', codigo: 'LEN-SEC' };

    expect(seleccionarfilaasignatura(filas, criterio, 6).encontrado).toBe(false);
    expect(
      seleccionarfilaasignatura(
        filas,
        {
          ...criterio,
          aliassie: {
            'LEN-SEC': 'Comunicación y Lenguajes: Lengua Castellana y Originaria',
          },
        },
        6,
      ),
    ).toMatchObject({ encontrado: true });
    expect(
      seleccionarfilaasignatura(filas, { ...criterio, aliassie: { 'LEN-SEC': '10' } }, 6),
    ).toMatchObject({ encontrado: true });
  });

  it('tolera nombres con guiones, comas y tildes distintas', () => {
    const filas = extraerfilasnotasie({
      notas: [
        {
          idEstudianteNota: 1,
          idNotaTipo: 6,
          idEstudianteAsignatura: 10,
          asignatura: 'Ciencias Naturales: Biología - Geografía',
          nota: 91,
        },
      ],
    } as jsonvalor);

    expect(
      seleccionarfilaasignatura(
        filas,
        { nombre: 'Ciencias Naturales: Biología – Geografía', codigo: 'BIO-SEC' },
        6,
      ),
    ).toMatchObject({ encontrado: true });
    expect(normalizartexto('Valores, Espiritualidad y Religiones')).toBe(
      'valores espiritualidad y religiones',
    );
  });
});

describe('cuerpo de actualización de notas', () => {
  const estudiante = extraerestudiantesie(estudiantesjson)[0];
  const fila = extraerfilasnotasie(notasjson)[0];

  it('ordena los arrays posicionales como exige el portal', () => {
    const cuerpo = construircuerpoactualizacionsie({
      infoue: 'a:0:{}',
      estudiante,
      fila,
      tiponota: 6,
      nivel: 13,
      gestion: 2026,
      nota: 95,
    });

    expect(cuerpo).toEqual([
      ['infoUe', 'a:0:{}'],
      ['infoStudent', JSON.stringify(estudiante.crudo)],
      ['tipoNota', 'newTemplateDB'],
      ['nivel', '13'],
      ['idInscripcion', '500000001'],
      ['gestion', '2026'],
      ['idEstudianteNota[]', '2590000001'],
      ['idNotaTipo[]', '6'],
      ['idEstudianteAsignatura[]', '1100000001'],
      ['nota[]', '95'],
    ]);
  });

  it('rechaza filas sin IDs de escritura o notas fuera de rango', () => {
    expect(() =>
      construircuerpoactualizacionsie({
        infoue: 'a:0:{}',
        estudiante: { ...estudiante, idinscripcion: null },
        fila,
        tiponota: 6,
        nivel: 13,
        gestion: 2026,
        nota: 95,
      }),
    ).toThrow('idInscripcion');
    expect(() =>
      construircuerpoactualizacionsie({
        infoue: 'a:0:{}',
        estudiante,
        fila: { ...fila, idEstudianteNota: null },
        tiponota: 6,
        nivel: 13,
        gestion: 2026,
        nota: 95,
      }),
    ).toThrow('idEstudianteNota');
    expect(() =>
      construircuerpoactualizacionsie({
        infoue: 'a:0:{}',
        estudiante,
        fila,
        tiponota: 6,
        nivel: 13,
        gestion: 2026,
        nota: 101,
      }),
    ).toThrow('0..100');
  });
});

describe('detección de errores en respuestas SIE', () => {
  it('reconoce fallos explícitos y no confunde una respuesta exitosa', () => {
    expect(respuestaindicaerror('{"success":false,"message":"No autorizado"}')).toBe(true);
    expect(respuestaindicaerror('{"success":true,"data":[]}')).toBe(false);
    expect(respuestaindicaerror('{"success":true,"error":null}')).toBe(false);
    expect(respuestaindicaerror('Error al guardar la nota')).toBe(true);
  });
});
