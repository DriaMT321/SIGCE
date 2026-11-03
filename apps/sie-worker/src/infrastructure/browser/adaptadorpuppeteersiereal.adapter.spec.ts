import { adaptadorpuppeteersiereal } from './adaptadorpuppeteersiereal.adapter';
import { configuraciontrabajador } from '../../config/configuraciontrabajador.config';
import { trabajoprocesamientosie } from '../../application/modelos/sincronizacion.model';
import { estadosincronizacionsie } from '@academic/domain-kernel';
import { errorautenticacionsierequerida } from '../../domain/errors/autenticacionsierequerida.error';

const configBase = {
  ...configuraciontrabajador.sie,
  accesoRealHabilitado: true,
  credenciales: {
    usuario: 'test',
    contrasena: 'pass',
    codigosie: '81981191',
    iecid: 168142899,
  },
};

describe('adaptadorpuppeteersiereal', () => {
  it('rechaza procesar si el acceso real al SIE no está habilitado', async () => {
    const adaptador = new adaptadorpuppeteersiereal({
      ...configBase,
      accesoRealHabilitado: false,
    });

    const trabajo: trabajoprocesamientosie = {
      synchronizationId: 'sync-1',
      itemId: 'item-1',
      studentRude: 'RUDE123',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT-SEC',
      localGrade: 85,
    };

    await expect(adaptador.procesarsincronizacioncalificacion(trabajo)).rejects.toThrow(
      'La sincronización real con el SIE no está habilitada por configuración',
    );
  });

  it.each([
    ['https://otro-sitio.example/ingreso', false],
    ['https://academico.sie.gob.bo/acceso', false],
  ])('no introduce credenciales si la página o formulario no son seguros', async (url, valido) => {
    const adaptador = new adaptadorpuppeteersiereal(configBase);
    const pagina = {
      setDefaultTimeout: jest.fn(),
      setRequestInterception: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      evaluateOnNewDocument: jest.fn().mockResolvedValue(undefined),
      goto: jest.fn().mockResolvedValue(undefined),
      url: jest.fn().mockReturnValue(url),
      evaluate: jest.fn().mockResolvedValue(valido),
      close: jest.fn().mockResolvedValue(undefined),
      type: jest.fn(),
    };
    (adaptador as unknown as { navegador: unknown }).navegador = { newPage: jest.fn().mockResolvedValue(pagina) };
    jest.spyOn(adaptador as unknown as { inicializar: () => Promise<void> }, 'inicializar').mockResolvedValue(undefined);
    await expect(
      (adaptador as unknown as { asegurarsesionautenticada: () => Promise<unknown> }).asegurarsesionautenticada(),
    ).rejects.toBeInstanceOf(
      errorautenticacionsierequerida,
    );
    expect(pagina.type).not.toHaveBeenCalled();
    expect(pagina.close).toHaveBeenCalled();
  });

  it('calcula correctamente los datos de infoUe para secundaria y paralelo alfanumérico', () => {
    const adaptador = new adaptadorpuppeteersiereal(configBase);

    const datosInfo = (
      adaptador as unknown as { construirDatosInfoUe: (arg: unknown) => unknown }
    ).construirDatosInfoUe({
      courseGradeLevel: 9, // Primero de secundaria
      courseSection: 'B',
      courseShift: 'MORNING',
      academicYear: 2026,
    });

    expect(datosInfo).toEqual({
      nivel: 'Secundaria Comunitaria Productiva',
      grado: 'Primero',
      paralelo: 'B',
      turno: 'MAÑANA',
      paraleloId: '2',
      turnoId: 1,
      nivelId: 13,
      gradoId: 1,
      cicloId: 1,
      iecId: 168142899,
      sie: '81981191',
      gestion: '2026',
      swRegisterCalifications: true,
      swRegisterPersonBjp: true,
    });
  });

  it('calcula correctamente los datos de infoUe para primaria (grados 3..8)', () => {
    const adaptador = new adaptadorpuppeteersiereal({
      ...configBase,
      nivelPrimariaId: 12,
      nivelPrimariaNombre: 'Primaria Comunitaria Vocacional',
    });

    const datosInfo = (
      adaptador as unknown as { construirDatosInfoUe: (arg: unknown) => unknown }
    ).construirDatosInfoUe({
      courseGradeLevel: 5, // Tercero de primaria (3=1ro, 4=2do, 5=3ro)
      courseSection: 'A',
      courseShift: 'AFTERNOON',
      academicYear: 2026,
    });

    expect(datosInfo).toEqual({
      nivel: 'Primaria Comunitaria Vocacional',
      grado: 'Tercero',
      paralelo: 'A',
      turno: 'TARDE',
      paraleloId: '1',
      turnoId: 2,
      nivelId: 12,
      gradoId: 3,
      cicloId: 1,
      iecId: 168142899,
      sie: '81981191',
      gestion: '2026',
      swRegisterCalifications: true,
      swRegisterPersonBjp: true,
    });
  });

  describe('verificación después de una escritura', () => {
    const trabajo: trabajoprocesamientosie = {
      synchronizationId: 'sync-1',
      itemId: 'item-1',
      studentRude: 'RUDE123',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT-SEC',
      subjectName: 'Matemática',
      courseGradeLevel: 9,
      courseSection: 'A',
      courseShift: 'MORNING',
      localGrade: 85,
    };
    const respuestaestudiantes = {
      status: 200,
      texto: JSON.stringify({ data: [{ id: 101, codigoRude: 'RUDE123', eInsId: 202 }] }),
    };
    const respuestaactualizacion = { status: 200, texto: '{"success":true}' };
    const notas = (nota: number, idEstudianteNota = 303, idNotaTipo: number | null = 6) => ({
      status: 200,
      texto: JSON.stringify({
        data: [
          {
            asignatura: 'Matemática',
            idEstudianteNota,
            idNotaTipo,
            idEstudianteAsignatura: 404,
            nota,
          },
        ],
      }),
    });

    function preparar(lecturaposterior: { status: number; texto: string }) {
      const adaptador = new adaptadorpuppeteersiereal({
        ...configBase,
        escrituraRealHabilitada: true,
        tiponotaporperiodo: { 1: 6 },
        aliasasignaturas: {},
        permitircoincidenciaaproximada: false,
      });
      const pagina = {
        evaluate: jest
          .fn()
          .mockResolvedValueOnce(respuestaestudiantes)
          .mockResolvedValueOnce(notas(70))
          .mockResolvedValueOnce(respuestaactualizacion)
          .mockResolvedValueOnce(lecturaposterior),
      };
      jest
        .spyOn(
          adaptador as unknown as { asegurarsesionautenticada: () => Promise<unknown> },
          'asegurarsesionautenticada',
        )
        .mockResolvedValue(pagina);
      return { adaptador, pagina };
    }

    it('solo confirma al volver a leer la misma nota y encontrar el valor enviado', async () => {
      const { adaptador, pagina } = preparar(notas(85));
      const resultado = await adaptador.procesarsincronizacioncalificacion(trabajo);
      expect(pagina.evaluate).toHaveBeenCalledTimes(4);
      expect(pagina.evaluate.mock.calls[3][1]).toEqual(pagina.evaluate.mock.calls[1][1]);
      expect(resultado).toMatchObject({
        status: estadosincronizacionsie.VERIFIED,
        sieValue: 85,
        isMatched: true,
      });
      expect(resultado.verifiedAt).toEqual(expect.any(String));
    });

    it('registra discrepancia si el SIE vuelve a devolver otro valor', async () => {
      const { adaptador } = preparar(notas(70));
      const resultado = await adaptador.procesarsincronizacioncalificacion(trabajo);
      expect(resultado).toMatchObject({
        status: estadosincronizacionsie.DISCREPANCY,
        sieValue: 70,
        isMatched: false,
      });
    });

    it.each([
      [{ status: 503, texto: '' }, 'fallo HTTP'],
      [{ status: 200, texto: '<html>sesión cerrada</html>' }, 'respuesta ilegible'],
      [notas(85, 999), 'identificador de nota distinto'],
      [notas(85, 303, null), 'período sin identificar'],
    ])('no confirma si la lectura posterior presenta %s', async (respuesta) => {
      const { adaptador } = preparar(respuesta as { status: number; texto: string });
      const resultado = await adaptador.procesarsincronizacioncalificacion(trabajo);
      expect(resultado).toMatchObject({
        status: estadosincronizacionsie.FAILED,
        sieValue: null,
        isMatched: false,
        verifiedAt: null,
      });
    });

    it('solicita nueva autenticación si la lectura posterior recibe 401', async () => {
      const { adaptador } = preparar({ status: 401, texto: '' });
      await expect(adaptador.procesarsincronizacioncalificacion(trabajo)).rejects.toBeInstanceOf(
        errorautenticacionsierequerida,
      );
    });

    it('no consulta el SIE si no se configuró el tipo de nota para el período', async () => {
      const { adaptador, pagina } = preparar(notas(85));
      const resultado = await adaptador.procesarsincronizacioncalificacion({
        ...trabajo,
        periodNumber: 2,
      });
      expect(resultado).toMatchObject({
        status: estadosincronizacionsie.FAILED,
        sieValue: null,
        verifiedAt: null,
      });
      expect(resultado.errorMessage).toContain('período');
      expect(pagina.evaluate).not.toHaveBeenCalled();
    });

    it('no adivina el curso cuando faltan sus datos', async () => {
      const { adaptador, pagina } = preparar(notas(85));
      const resultado = await adaptador.procesarsincronizacioncalificacion({
        ...trabajo,
        courseGradeLevel: undefined,
      });
      expect(resultado).toMatchObject({
        status: estadosincronizacionsie.FAILED,
        sieValue: null,
        verifiedAt: null,
      });
      expect(pagina.evaluate).not.toHaveBeenCalled();
    });
  });
});
