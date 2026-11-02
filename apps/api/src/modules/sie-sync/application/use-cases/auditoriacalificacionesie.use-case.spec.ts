import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
jest.mock('@academic/seguridadarchivos', () => ({
  validaraclprivada: jest.fn(),
}));
import { repositorioauditoriacalificacionessie } from '../ports/repositorioauditoriacalificacionsie';
import { casousoauditarcalificacionessie } from './auditoriacalificacionesie.use-case';
import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
import { adaptadoralmaceninformessienode } from '../../infrastructure/files/nodealmaceninformesauditoriasie.adapter';
import { serviciogestionarinformesauditoriasie } from '../services/gestionarinformesauditoriasie.service';
import { serviciopublicarinformeauditoriasie } from '../services/publicarinformeauditoriasie.service';

describe('AuditSieGradesUseCase credentials', () => {
  const nombreusuarioanterior = process.env.SIE_USERNAME;
  const contrasenaanterior = process.env.SIE_PASSWORD;
  const auditoriaregistro = { ejecutar: jest.fn() };
  const obtenerregistrosauditoria = { ejecutar: jest.fn() };
  const almaceninformes = new adaptadoralmaceninformessienode();
  const servicioreportes = new serviciogestionarinformesauditoriasie(
    auditoriaregistro as never,
    obtenerregistrosauditoria as never,
    almaceninformes,
  );
  const serviciopublicacion = new serviciopublicarinformeauditoriasie(
    auditoriaregistro as never,
    almaceninformes,
    servicioreportes,
  );
  const usocaso = new casousoauditarcalificacionessie(
    { urlbase: jest.fn().mockReturnValue('https://academico.sie.gob.bo') },
    {} as repositorioauditoriacalificacionessie,
    { obtenercalificaciones: jest.fn() },
    servicioreportes,
    serviciopublicacion,
  );

  afterEach(() => {
    auditoriaregistro.ejecutar.mockReset();
    obtenerregistrosauditoria.ejecutar.mockReset();
    if (nombreusuarioanterior === undefined) delete process.env.SIE_USERNAME;
    else process.env.SIE_USERNAME = nombreusuarioanterior;
    if (contrasenaanterior === undefined) delete process.env.SIE_PASSWORD;
    else process.env.SIE_PASSWORD = contrasenaanterior;
  });

  it('requires credentials for the current audit and ignores environment fallbacks', async () => {
    process.env.SIE_USERNAME = 'test-account';
    process.env.SIE_PASSWORD = 'test-password';

    await expect(
      usocaso.ejecutarauditoria(undefined, { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
  });

  it('audits extracted students with one bulk SIGCE lookup and publishes the report', async () => {
    const temporaldir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-auditoriasie-'));
    const repositorio = {
      obtenerdatosreferenciaauditoria: jest.fn().mockResolvedValue({
        academicYearId: 'year-1',
        subjects: [{ id: 'subject-1', name: 'Matemática' }],
      }),
      buscarcalificacionesestudiantes: jest.fn().mockResolvedValue([
        {
          id: 'student-1',
          rude: 'RUDE-1',
          firstName: 'Ana',
          lastName: 'Pérez',
          grades: [{ subjectId: 'subject-1', value: 85, subject: { name: 'Matemática' } }],
        },
      ]),
    } as unknown as repositorioauditoriacalificacionessie;
    const navegador = {
      obtenercalificaciones: jest.fn().mockResolvedValue({
        cursosauditados: 1,
        advertencias: [],
        estudiantes: [
          {
            rude: 'RUDE-1',
            nombre: 'Ana Pérez',
            nivel: 'Secundaria',
            grado: 'Quinto',
            paralelo: 'A',
            calificaciones: [{ materia: 'Matemática', notaprimertrimestre: 85 }],
          },
        ],
      }),
    };
    const usocasoexitoso = new casousoauditarcalificacionessie(
      { urlbase: jest.fn().mockReturnValue('https://academico.sie.gob.bo') },
      repositorio,
      navegador,
      servicioreportes,
      serviciopublicacion,
    );
    jest.spyOn(almaceninformes, 'obtenerdirectoriotemporal').mockReturnValue(temporaldir);
    auditoriaregistro.ejecutar.mockResolvedValue(undefined);

    try {
      const resultado = await usocasoexitoso.ejecutarauditoria(
        { username: 'operator', password: 'secret' },
        { userId: 'admin-1' },
      );

      expect(repositorio.buscarcalificacionesestudiantes).toHaveBeenCalledTimes(1);
      expect(repositorio.buscarcalificacionesestudiantes).toHaveBeenCalledWith(
        ['RUDE-1'],
        'year-1',
        1,
      );
      expect(resultado.summary.totalStudents).toBe(1);
      expect(resultado.summary.totalExactMatches).toBe(1);
      expect(resultado.students[0]).toEqual(
        expect.objectContaining({ rude: 'RUDE-1', overallMatch: true, totalDiscrepancies: 0 }),
      );
      expect(auditoriaregistro.ejecutar).toHaveBeenCalledTimes(2);
      expect(fs.readdirSync(temporaldir).some((nombre) => nombre.endsWith('.json'))).toBe(true);
    } finally {
      jest.restoreAllMocks();
      fs.rmSync(temporaldir, { recursive: true, force: true });
    }
  });

  it('aborts report publication when the bulk SIGCE lookup fails', async () => {
    const temporaldir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-auditoriasie-fallo-'));
    const errorconsulta = new Error('La base de datos no está disponible');
    const repositorio = {
      obtenerdatosreferenciaauditoria: jest.fn().mockResolvedValue({
        academicYearId: 'year-1',
        subjects: [{ id: 'subject-1', name: 'Matemática' }],
      }),
      buscarcalificacionesestudiantes: jest.fn().mockRejectedValue(errorconsulta),
    } as unknown as repositorioauditoriacalificacionessie;
    const navegador = {
      obtenercalificaciones: jest.fn().mockResolvedValue({
        cursosauditados: 1,
        advertencias: [],
        estudiantes: [
          {
            rude: 'RUDE-1',
            nombre: 'Ana Pérez',
            nivel: 'Secundaria',
            grado: 'Quinto',
            paralelo: 'A',
            calificaciones: [{ materia: 'Matemática', notaprimertrimestre: 85 }],
          },
        ],
      }),
    };
    const usocaso = new casousoauditarcalificacionessie(
      { urlbase: jest.fn().mockReturnValue('https://academico.sie.gob.bo') },
      repositorio,
      navegador,
      servicioreportes,
      serviciopublicacion,
    );
    jest.spyOn(almaceninformes, 'obtenerdirectoriotemporal').mockReturnValue(temporaldir);

    try {
      await expect(
        usocaso.ejecutarauditoria(
          { username: 'operator', password: 'secret' },
          { userId: 'admin-1' },
        ),
      ).rejects.toBe(errorconsulta);

      expect(auditoriaregistro.ejecutar).not.toHaveBeenCalled();
      expect(fs.readdirSync(temporaldir)).toEqual([]);
    } finally {
      jest.restoreAllMocks();
      fs.rmSync(temporaldir, { recursive: true, force: true });
    }
  });

  it('recognizes a published report from its persisted audit state', async () => {
    obtenerregistrosauditoria.ejecutar.mockResolvedValue({
      items: [
        { action: 'UPDATE', newValue: { reportStatus: 'PUBLISHED' }, userId: 'admin-1' },
        {
          action: 'CREATE',
          newValue: { reportStatus: 'PENDING_PUBLICATION' },
          userId: 'admin-1',
          ipAddress: '127.0.0.1',
          correlationId: 'corr-1',
        },
      ],
      total: 1,
    });

    await expect(servicioreportes.obtenerestadopublicacioninforme('report.json')).resolves.toEqual({
      status: 'PUBLISHED',
      userId: 'admin-1',
      ipAddress: '127.0.0.1',
      correlationId: 'corr-1',
    });
    expect(obtenerregistrosauditoria.ejecutar).toHaveBeenCalledWith({
      entity: 'SieGradeAudit',
      entityId: 'report.json',
      limit: 20,
    });
  });

  it('treats a failed report state as authoritative over a prior published event', async () => {
    obtenerregistrosauditoria.ejecutar.mockResolvedValue({
      items: [
        { action: 'UPDATE', newValue: { reportStatus: 'PUBLISHED' }, userId: 'admin-1' },
        { action: 'UPDATE', newValue: { reportStatus: 'FAILED' }, userId: 'admin-1' },
        { action: 'CREATE', newValue: { reportStatus: 'PENDING_PUBLICATION' }, userId: 'admin-1' },
      ],
      total: 3,
    });

    await expect(servicioreportes.obtenerestadopublicacioninforme('report.json')).resolves.toEqual({
      status: 'FAILED',
      userId: 'admin-1',
      ipAddress: null,
      correlationId: null,
    });
  });

  it('serves a published report when its recoverable marker cannot be written', async () => {
    const temporaldir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-auditoriasie-'));
    const nombreinforme = `auditoria_calificaciones_2026-10-22_2147483647_${randomUUID()}.json`;
    fs.writeFileSync(path.join(temporaldir, nombreinforme), '[]');
    obtenerregistrosauditoria.ejecutar.mockResolvedValue({
      items: [
        { action: 'UPDATE', newValue: { reportStatus: 'PUBLISHED' }, userId: 'admin-1' },
        { action: 'CREATE', newValue: { reportStatus: 'PENDING_PUBLICATION' }, userId: 'admin-1' },
      ],
      total: 2,
    });
    jest.spyOn(almaceninformes, 'obtenerdirectoriotemporal').mockReturnValue(temporaldir);
    jest.spyOn(servicioreportes, 'asegurarmarcadorpublicado').mockImplementation(() => {
      throw new Error('scratch directory is read-only');
    });

    try {
      await expect(usocaso.obtenerultimaauditoria()).resolves.toEqual(
        expect.objectContaining({
          hasData: true,
          students: [],
          reportFile: nombreinforme,
        }),
      );
    } finally {
      jest.restoreAllMocks();
      fs.rmSync(temporaldir, { recursive: true, force: true });
    }
  });

  it('cleans abandoned Markdown reports and marks their audit as failed', async () => {
    const temporaldir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-auditoriasie-'));
    const nombreinforme = `auditoria_calificaciones_2026-10-22_${2147483647}_${randomUUID()}.json`;
    const pendientemarkdown = `.${nombreinforme.replace(/\.json$/, '.md')}.2147483647.${randomUUID()}.pending`;
    fs.writeFileSync(path.join(temporaldir, pendientemarkdown), 'student names');
    obtenerregistrosauditoria.ejecutar.mockResolvedValue({
      items: [
        { action: 'CREATE', newValue: { reportStatus: 'PENDING_PUBLICATION' }, userId: 'admin-1' },
      ],
      total: 1,
    });
    auditoriaregistro.ejecutar.mockResolvedValue(undefined);

    try {
      await servicioreportes.limpiarinformesabandonados(temporaldir);

      expect(fs.existsSync(path.join(temporaldir, pendientemarkdown))).toBe(false);
      expect(auditoriaregistro.ejecutar).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'admin-1',
          entityId: nombreinforme,
          newValue: { reportStatus: 'FAILED' },
        }),
      );
    } finally {
      fs.rmSync(temporaldir, { recursive: true, force: true });
    }
  });

  it('preserves abandoned report temporaries when marking the audit as failed fails', async () => {
    const temporaldir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-auditoriasie-'));
    const nombreinforme = `auditoria_calificaciones_2026-10-22_${2147483647}_${randomUUID()}.json`;
    const pendientemarkdown = `.${nombreinforme.replace(/\.json$/, '.md')}.2147483647.${randomUUID()}.pending`;
    const rutapendiente = path.join(temporaldir, pendientemarkdown);
    fs.writeFileSync(rutapendiente, 'student names');
    obtenerregistrosauditoria.ejecutar.mockResolvedValue({
      items: [
        { action: 'CREATE', newValue: { reportStatus: 'PENDING_PUBLICATION' }, userId: 'admin-1' },
      ],
      total: 1,
    });
    auditoriaregistro.ejecutar.mockRejectedValue(new Error('audit storage unavailable'));

    try {
      await expect(servicioreportes.limpiarinformesabandonados(temporaldir)).rejects.toThrow(
        'audit storage unavailable',
      );
      expect(fs.existsSync(rutapendiente)).toBe(true);
    } finally {
      fs.rmSync(temporaldir, { recursive: true, force: true });
    }
  });

  it('keeps abandoned report temporaries when audit state cannot be read', async () => {
    const temporaldir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-auditoriasie-'));
    const nombreinforme = `auditoria_calificaciones_2026-10-22_${2147483647}_${randomUUID()}.json`;
    const pendientemarkdown = `.${nombreinforme.replace(/\.json$/, '.md')}.2147483647.${randomUUID()}.pending`;
    const rutapendiente = path.join(temporaldir, pendientemarkdown);
    fs.writeFileSync(rutapendiente, 'student names');
    obtenerregistrosauditoria.ejecutar.mockRejectedValue(new Error('audit storage unavailable'));

    try {
      await expect(servicioreportes.limpiarinformesabandonados(temporaldir)).rejects.toThrow(
        'audit storage unavailable',
      );
      expect(fs.existsSync(rutapendiente)).toBe(true);
    } finally {
      fs.rmSync(temporaldir, { recursive: true, force: true });
    }
  });
});
