import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
jest.mock('@academic/seguridadarchivos', () => ({
  validaraclprivada: jest.fn(),
}));
import type {
  resultadocomparacionestudiante,
  resumenauditoria,
} from '../modelos/modeloauditoriasie';
import { adaptadoralmaceninformessienode } from '../../infrastructure/files/nodealmaceninformesauditoriasie.adapter';
import { serviciogestionarinformesauditoriasie } from './gestionarinformesauditoriasie.service';
import { serviciopublicarinformeauditoriasie } from './publicarinformeauditoriasie.service';

describe('servicio de publicación de informes SIE', () => {
  const estudiantes: resultadocomparacionestudiante[] = [
    {
      rude: 'RUDE-1',
      studentName: 'Ana Pérez',
      courseName: 'Quinto A',
      comparisons: [],
      overallMatch: true,
      totalSubjectsMatched: 1,
      totalDiscrepancies: 0,
      sieAverage: 85,
      sigceAverage: 85,
    },
  ];
  const resumen: resumenauditoria = {
    totalStudents: 1,
    totalExactMatches: 1,
    totalWithDiscrepancies: 0,
    matchPercentage: 100,
    sieAverage: 85,
    sigceAverage: 85,
    auditedCoursesCount: 1,
    auditedAt: '2026-10-24T00:00:00.000Z',
  };

  let directorio: string;
  let registros: Array<{ action: string; newValue?: Record<string, unknown> }>;
  let auditoriaregistro: { ejecutar: jest.Mock };
  let informes: adaptadoralmaceninformessienode;
  let gestionarinformes: serviciogestionarinformesauditoriasie;
  let publicar: serviciopublicarinformeauditoriasie;

  beforeEach(() => {
    directorio = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-publicacion-sie-'));
    registros = [];
    auditoriaregistro = {
      ejecutar: jest.fn(async (evento: { action: string; newValue?: Record<string, unknown> }) => {
        registros.unshift(evento);
      }),
    };
    const lectorauditoria = {
      ejecutar: jest.fn(async () => ({
        items: registros.map((evento) => ({
          ...evento,
          userId: 'admin-1',
          ipAddress: null,
          correlationId: null,
        })),
      })),
    };
    informes = new adaptadoralmaceninformessienode();
    jest.spyOn(informes, 'obtenerdirectoriotemporal').mockReturnValue(directorio);
    gestionarinformes = new serviciogestionarinformesauditoriasie(
      auditoriaregistro as never,
      lectorauditoria as never,
      informes,
    );
    publicar = new serviciopublicarinformeauditoriasie(
      auditoriaregistro as never,
      informes,
      gestionarinformes,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fs.rmSync(directorio, { recursive: true, force: true });
  });

  it('marks publication as failed and removes artifacts if the second file cannot be published', async () => {
    const errorpublicacion = new Error('No se pudo publicar Markdown.');
    const publicaroriginal = informes.publicarexclusivo.bind(informes);
    let publicaciones = 0;
    jest.spyOn(informes, 'publicarexclusivo').mockImplementation((pendiente, publicada) => {
      publicaciones++;
      if (publicaciones === 2) throw errorpublicacion;
      publicaroriginal(pendiente, publicada);
    });

    await expect(publicar.ejecutar(estudiantes, resumen, { userId: 'admin-1' })).rejects.toBe(
      errorpublicacion,
    );
    expect(registros.map((evento) => evento.newValue?.reportStatus)).toEqual([
      'FAILED',
      'PENDING_PUBLICATION',
    ]);
    expect(fs.readdirSync(directorio)).toEqual([]);
  });

  it('keeps a committed published report when the audit acknowledgement fails', async () => {
    const errorconfirmacion = new Error('Se perdió la confirmación de auditoría.');
    const registrooriginal = auditoriaregistro.ejecutar.getMockImplementation()!;
    let registroscreados = 0;
    jest.spyOn(auditoriaregistro, 'ejecutar').mockImplementation(async (evento) => {
      registroscreados++;
      await registrooriginal(evento);
      if (registroscreados === 2) throw errorconfirmacion;
    });

    await expect(
      publicar.ejecutar(estudiantes, resumen, { userId: 'admin-1' }),
    ).resolves.toBeUndefined();
    expect(registros.map((evento) => evento.newValue?.reportStatus)).toEqual([
      'PUBLISHED',
      'PENDING_PUBLICATION',
    ]);
    expect(fs.readdirSync(directorio).filter((nombre) => nombre.endsWith('.json'))).toHaveLength(1);
    expect(fs.readdirSync(directorio).some((nombre) => nombre.endsWith('.published'))).toBe(true);
  });

  it('preserves recovery evidence when recording a failed publication also fails', async () => {
    const errorpublicacion = new Error('No se pudo publicar Markdown.');
    const errorauditoria = new Error('No se pudo guardar FAILED.');
    const publicaroriginal = informes.publicarexclusivo.bind(informes);
    let publicaciones = 0;
    jest.spyOn(informes, 'publicarexclusivo').mockImplementation((pendiente, publicada) => {
      publicaciones++;
      if (publicaciones === 2) throw errorpublicacion;
      publicaroriginal(pendiente, publicada);
    });
    const ejecucionesauditoria = auditoriaregistro.ejecutar.getMockImplementation()!;
    jest.spyOn(auditoriaregistro, 'ejecutar').mockImplementation(async (evento) => {
      if (evento.newValue?.reportStatus === 'FAILED') throw errorauditoria;
      await ejecucionesauditoria(evento);
    });

    await expect(publicar.ejecutar(estudiantes, resumen, { userId: 'admin-1' })).rejects.toBe(
      errorpublicacion,
    );
    expect(registros.map((evento) => evento.newValue?.reportStatus)).toEqual([
      'PENDING_PUBLICATION',
    ]);
    expect(fs.readdirSync(directorio)).toHaveLength(2);
  });

  it('preserves recovery evidence when the audit state cannot be read during compensation', async () => {
    const errorpublicacion = new Error('No se pudo publicar Markdown.');
    const errorconsulta = new Error('No se pudo consultar el estado de auditoría.');
    const publicaroriginal = informes.publicarexclusivo.bind(informes);
    let publicaciones = 0;
    jest.spyOn(informes, 'publicarexclusivo').mockImplementation((pendiente, publicada) => {
      publicaciones++;
      if (publicaciones === 2) throw errorpublicacion;
      publicaroriginal(pendiente, publicada);
    });
    jest
      .spyOn(gestionarinformes, 'obtenerestadopublicacioninforme')
      .mockRejectedValue(errorconsulta);

    await expect(publicar.ejecutar(estudiantes, resumen, { userId: 'admin-1' })).rejects.toBe(
      errorpublicacion,
    );
    expect(registros.map((evento) => evento.newValue?.reportStatus)).toEqual([
      'PENDING_PUBLICATION',
    ]);
    expect(fs.readdirSync(directorio)).toHaveLength(2);
  });

  it('keeps published reports when creating the publication marker fails', async () => {
    jest.spyOn(informes, 'asegurarmarcadorpublicado').mockImplementation(() => {
      throw new Error('No se pudo crear la marca.');
    });

    await expect(
      publicar.ejecutar(estudiantes, resumen, { userId: 'admin-1' }),
    ).resolves.toBeUndefined();
    expect(registros.map((evento) => evento.newValue?.reportStatus)).toEqual([
      'PUBLISHED',
      'PENDING_PUBLICATION',
    ]);
    expect(fs.readdirSync(directorio).filter((nombre) => nombre.endsWith('.json'))).toHaveLength(1);
    expect(fs.readdirSync(directorio).filter((nombre) => nombre.endsWith('.md'))).toHaveLength(1);
  });
});
