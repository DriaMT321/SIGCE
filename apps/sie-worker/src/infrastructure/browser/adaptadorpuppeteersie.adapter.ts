import puppeteer, { Browser } from 'puppeteer';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { puertoautomatizacionsie } from '../../application/ports/automatizacionsie.port';
import { configuraciontrabajador } from '../../config/configuraciontrabajador.config';
import {
  resultadoprocesamientosie,
  trabajoprocesamientosie,
} from '../../application/modelos/sincronizacion.model';
import {
  calificacionessielocales,
  calificacionesielocal,
  renderizarpaginasielocal,
} from './registrossielocal.fixture';
import { evaluarcalificacionsielocal, filasielocal } from './evaluadorcalificacionsielocal';
import { validarcampospaginasielocal } from './verificacionpreviapaginassielocal';

export class adaptadorpuppeteersie implements puertoautomatizacionsie {
  private navegador: Browser | null = null;

  constructor(
    private readonly calificacioneslocales: ReadonlyArray<calificacionesielocal> = calificacionessielocales,
    private readonly rutapaginareplicalocal = configuraciontrabajador.sie.rutapaginareplicalocal,
  ) {
    if (this.rutapaginareplicalocal && process.env.NODE_ENV === 'production' && process.env.SIE_ALLOW_REPLICA_IN_PROD !== 'true') {
      throw new Error('La réplica HTML local no puede usarse en producción');
    }
  }

  async inicializar(): Promise<void> {
    if (!this.navegador) {
      console.log('[Puppeteer Adapter] Inicializando navegador local...');
      const rutaejecutable = this.resolverejecutablenavegador();
      this.navegador = await puppeteer.launch({
        headless: configuraciontrabajador.sie.sininterfazgrafica,
        ...(rutaejecutable ? { executablePath: rutaejecutable } : {}),
        args: ['--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--disable-gpu'],
      });
      console.log('  Navegador local inicializado correctamente');
    }
  }

  private resolverejecutablenavegador(): string | undefined {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    if (existsSync(puppeteer.executablePath())) {
      return undefined;
    }
    if (process.platform === 'win32') {
      const rutasedge = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      ];
      return rutasedge.find((ruta) => existsSync(ruta));
    }
    return undefined;
  }

  async procesarsincronizacioncalificacion(
    datostrabajo: trabajoprocesamientosie,
  ): Promise<resultadoprocesamientosie> {
    if (process.env.NODE_ENV === 'production' && process.env.SIE_REAL_ACCESS_ENABLED === 'true') {
      throw new Error('La comparación local de prueba solo está disponible en modo simulación');
    }
    await this.inicializar();
    if (!this.navegador) {
      throw new Error('Navegador Puppeteer no inicializado');
    }
    const pagina = await this.navegador.newPage();
    try {
      console.log(`[RPA Worker] Leyendo réplica local para RUDE ${datostrabajo.studentRude}`);
      const filas = this.rutapaginareplicalocal
        ? await this.leerreplicalocal(pagina)
        : await this.leerfixturelocal(pagina);
      return evaluarcalificacionsielocal(datostrabajo, filas);
    } catch (fallo: unknown) {
      console.error('[RPA Worker] Falló la lectura de la página SIE simulada:', fallo);
      throw fallo;
    } finally {
      await pagina.close();
    }
  }

  private async leerfixturelocal(pagina: import('puppeteer').Page): Promise<filasielocal[]> {
    await pagina.setContent(renderizarpaginasielocal(this.calificacioneslocales), {
      waitUntil: 'domcontentloaded',
    });
    if (this.calificacioneslocales.length > 0) {
      const campos = await pagina.$$eval(
        '#sie-grades tbody tr:first-child [data-field]',
        (elementos) => elementos.map((elemento) => elemento.getAttribute('data-field') ?? ''),
      );
      validarcampospaginasielocal(campos);
    }
    return pagina.$$eval('#sie-grades tbody tr', (filas) =>
      filas.map((fila) => ({
        rudeestudiante: fila.querySelector('[data-field="rude"]')?.textContent?.trim() ?? '',
        gestionacademica: fila.querySelector('[data-field="year"]')?.textContent?.trim() ?? '',
        numeroperiodo: fila.querySelector('[data-field="period"]')?.textContent?.trim() ?? '',
        codigoasignatura: fila.querySelector('[data-field="subject"]')?.textContent?.trim() ?? '',
        calificacion: fila.querySelector('[data-field="grade"]')?.textContent?.trim() ?? '',
      })),
    );
  }

  private async leerreplicalocal(pagina: import('puppeteer').Page): Promise<filasielocal[]> {
    const posiblesRutas = [
      this.rutapaginareplicalocal,
      resolve(process.cwd(), 'fixtures/sie-replica/replica-calificaciones.html'),
      resolve(process.cwd(), '../../fixtures/sie-replica/replica-calificaciones.html'),
      resolve(__dirname, '../../../../fixtures/sie-replica/replica-calificaciones.html'),
      '/home/ubuntu/sigce/fixtures/sie-replica/replica-calificaciones.html',
    ].filter((r): r is string => Boolean(r));

    let rutaresuelta: string | undefined;
    for (const r of posiblesRutas) {
      const absoluta = resolve(r);
      if (existsSync(absoluta)) {
        rutaresuelta = absoluta;
        break;
      }
    }

    if (!rutaresuelta) {
      return this.leerfixturelocal(pagina);
    }
    if (extname(rutaresuelta).toLowerCase() !== '.html' || !existsSync(rutaresuelta)) {
      throw new Error('La ruta de la réplica local debe apuntar a un archivo HTML existente');
    }

    const html = await readFile(rutaresuelta, 'utf8');
    await pagina.setViewport({ width: 1440, height: 1000 });
    await pagina.setContent(html, { waitUntil: 'domcontentloaded' });
    await pagina.type('#username', 'SIGCE-DEMO');
    await pagina.type('#password', 'PRUEBA-LOCAL');
    await pagina.click('#login-form button[type="submit"]');
    await pagina.waitForSelector('#portal:not(.hidden)');
    await pagina.click('#student-nav');
    await pagina.click('#student-submenu button[data-screen="students"]');
    await pagina.waitForSelector('#student-rows > tr');

    const estudiantes = await pagina.$$eval('#student-rows > tr', (filas) =>
      filas.map((fila, indice) => ({
        indice,
        rude: fila.querySelector('td:nth-child(2)')?.textContent?.trim() ?? '',
      })),
    );
    if (estudiantes.length === 0 || estudiantes.some((estudiante) => !estudiante.rude)) {
      throw new Error('La réplica local no presentó códigos RUDE para leer');
    }

    const registros: filasielocal[] = [];
    for (const estudiante of estudiantes) {
      await pagina.click(
        `#student-rows > tr:nth-child(${estudiante.indice + 1}) button[data-action="grade"]`,
      );
      await pagina.waitForSelector('#grade-backdrop:not(.hidden)');
      const lectura = await pagina.$eval('#sie-demo-metadata', (metadata) => ({
        gestion: metadata.getAttribute('data-year') ?? '',
        periodo: metadata.getAttribute('data-period') ?? '',
      }));
      const codigoestudiante = await pagina.$eval(
        '#modal-code',
        (elemento) => elemento.textContent?.trim() ?? '',
      );
      if (codigoestudiante !== estudiante.rude) {
        throw new Error('La réplica local mostró una ficha distinta al RUDE seleccionado');
      }
      const calificaciones = await pagina.$$eval('#marks-rows > tr', (filas) =>
        filas.map((fila) => ({
          materia: fila.querySelector('input')?.getAttribute('data-sie-subject-code') ?? '',
          valor: fila.querySelector('input')?.value.trim() ?? '',
        })),
      );
      for (const calificacion of calificaciones) {
        if (calificacion.valor) {
          registros.push({
            rudeestudiante: estudiante.rude,
            gestionacademica: lectura.gestion,
            numeroperiodo: lectura.periodo,
            codigoasignatura: calificacion.materia,
            calificacion: calificacion.valor,
          });
        }
      }
      await pagina.click('.modal-footer [data-close-modal]');
    }
    return registros;
  }

  async ejecutardiagnosticocontrolado(): Promise<{
    versionnavegador: string;
    titulopagina: string;
    correcto: boolean;
  }> {
    await this.inicializar();
    if (!this.navegador) {
      throw new Error('Navegador no inicializado');
    }

    const pagina = await this.navegador.newPage();
    try {
      const htmlprueba = `
        <!DOCTYPE html>
        <html>
          <head><title>Antigravity RPA Engine Diagnostic</title></head>
          <body>
            <h1>Puppeteer Test Automation Engine</h1>
            <p id="diagnostic-status">OPERATIONAL</p>
          </body>
        </html>
      `;
      await pagina.setContent(htmlprueba);
      const titulo = await pagina.title();
      const versionnavegador = await this.navegador.version();
      const textoestado = await pagina.$eval(
        '#diagnostic-status',
        (elementodom) => elementodom.textContent,
      );

      return {
        versionnavegador,
        titulopagina: titulo,
        correcto: textoestado === 'OPERATIONAL',
      };
    } finally {
      await pagina.close();
    }
  }

  async cerrar(): Promise<void> {
    if (this.navegador) {
      await this.navegador.close();
      this.navegador = null;
      console.log('[Puppeteer Adapter] Instancia de Chromium cerrada.');
    }
  }
}
