import { estadosincronizacionsie } from '@academic/domain-kernel';
import { trabajoprocesamientosie } from '../../application/modelos/sincronizacion.model';
import { adaptadorpuppeteersie } from './adaptadorpuppeteersie.adapter';
import { calificacionesielocal } from './registrossielocal.fixture';

const trabajo: trabajoprocesamientosie = {
  synchronizationId: 'sync-test',
  itemId: 'item-test',
  studentRude: 'SIM-2026-001',
  academicYear: 2026,
  periodNumber: 1,
  subjectCode: 'MAT-SEC',
  localGrade: 85,
};

const registro: calificacionesielocal = {
  rudeestudiante: 'SIM-2026-001',
  gestionacademica: 2026,
  numeroperiodo: 1,
  codigoasignatura: 'MAT-SEC',
  calificacion: 85,
};

function crearadaptador(registros: ReadonlyArray<calificacionesielocal>) {
  let html = '';
  const pagina = {
    setContent: jest.fn(async (contenido: string) => {
      html = contenido;
    }),
    $$eval: jest.fn(async (selector: string) => {
      const cuerpo = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
      const filas = [...cuerpo.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((coincidencia) =>
        Object.fromEntries(
          [...coincidencia[1].matchAll(/<td data-field="([^"]+)">([^<]*)<\/td>/g)].map(
            ([, campo, valor]) => [campo, valor],
          ),
        ),
      );
      if (selector.includes('first-child')) return Object.keys(filas[0] ?? {});
      return filas.map((fila) => ({
        rudeestudiante: fila.rude ?? '',
        gestionacademica: fila.year ?? '',
        numeroperiodo: fila.period ?? '',
        codigoasignatura: fila.subject ?? '',
        calificacion: fila.grade ?? '',
      }));
    }),
    close: jest.fn(async () => undefined),
  };
  const adaptador = new adaptadorpuppeteersie(registros, '');
  (adaptador as unknown as { navegador: unknown }).navegador = {
    newPage: jest.fn(async () => pagina),
  };
  return { adaptador, pagina };
}

describe('adaptador SIE local con registros independientes', () => {
  it('marca como fallido un registro ausente aunque la nota local sea válida', async () => {
    const { adaptador, pagina } = crearadaptador([registro]);
    const resultado = await adaptador.procesarsincronizacioncalificacion({
      ...trabajo,
      studentRude: 'SIM-2026-999',
    });

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.FAILED,
      sieValue: null,
      isMatched: false,
      verifiedAt: null,
    });
    expect(resultado.errorMessage).toContain('No se encontró');
    expect(pagina.setContent.mock.calls[0][0]).not.toContain('SIM-2026-999');
    expect(pagina.close).toHaveBeenCalledTimes(1);
  });

  it('marca como fallido cuando el fixture no contiene registros', async () => {
    const { adaptador } = crearadaptador([]);
    const resultado = await adaptador.procesarsincronizacioncalificacion(trabajo);

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.FAILED,
      sieValue: null,
      isMatched: false,
    });
    expect(resultado.errorMessage).toContain('No se encontró');
  });

  it('compara el valor recibido con el valor de la fuente local independiente', async () => {
    const { adaptador } = crearadaptador([registro]);
    const resultado = await adaptador.procesarsincronizacioncalificacion({
      ...trabajo,
      localGrade: 75,
    });

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.DISCREPANCY,
      localValue: 75,
      sieValue: 85,
      isMatched: false,
    });
  });

  it('verifica si hay una coincidencia única con la fuente independiente', async () => {
    const { adaptador } = crearadaptador([registro]);
    const resultado = await adaptador.procesarsincronizacioncalificacion(trabajo);

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.VERIFIED,
      sieValue: 85,
      isMatched: true,
    });
  });

  it('rechaza duplicados aunque uno de ellos coincida con la nota local', async () => {
    const { adaptador } = crearadaptador([registro, { ...registro, calificacion: 70 }]);
    const resultado = await adaptador.procesarsincronizacioncalificacion(trabajo);

    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.FAILED,
      sieValue: null,
      isMatched: false,
    });
    expect(resultado.errorMessage).toContain('duplicados');
  });
});
