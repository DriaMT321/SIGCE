import puppeteer, { Browser, Page } from 'puppeteer';
import { existsSync } from 'node:fs';
import { puertoautomatizacionsie } from '../../application/ports/automatizacionsie.port';
import {
  configuraciontrabajador,
  leerurloficialsie,
} from '../../config/configuraciontrabajador.config';
import {
  resultadoprocesamientosie,
  trabajoprocesamientosie,
} from '../../application/modelos/sincronizacion.model';
import { estadosincronizacionsie } from '@academic/domain-kernel';
import { errorautenticacionsierequerida } from '../../domain/errors/autenticacionsierequerida.error';
import { codificarinfoue, datosinfoue } from './serializadorphp';
import { crearproxyegresoviejecutacion } from './proxyegresoviejecutacion';
import {
  marcarformulariodeacceso,
  pertenecealorigen,
  protegerpagina,
} from './proteccionnavegacionsie';
import {
  buscarestudiante,
  construircuerpoactualizacionsie,
  extraerestudiantesie,
  extraerfilasnotasie,
  filanotasie,
  jsonvalor,
  respuestaindicaerror,
  seleccionarfilaasignatura,
} from './extraccionrespuestassie';

const nombresgrados: Record<number, string> = {
  1: 'Primero',
  2: 'Segundo',
  3: 'Tercero',
  4: 'Cuarto',
  5: 'Quinto',
  6: 'Sexto',
};

const turnosmapeo: Record<string, { nombre: string; id: number }> = {
  MORNING: { nombre: 'MAÑANA', id: 1 },
  AFTERNOON: { nombre: 'TARDE', id: 2 },
  EVENING: { nombre: 'NOCHE', id: 3 },
};

export class adaptadorpuppeteersiereal implements puertoautomatizacionsie {
  private navegador: Browser | null = null;
  private paginaSesion: Page | null = null;
  private proxyegreso: Awaited<ReturnType<typeof crearproxyegresoviejecutacion>> | null = null;

  constructor(private readonly configuracion = configuraciontrabajador.sie) {}

  async inicializar(): Promise<void> {
    if (!this.navegador) {
      console.log('[Puppeteer SIE Real] Inicializando navegador Chromium...');
      const rutaejecutable = this.resolverejecutablenavegador();
      const origen = leerurloficialsie(this.configuracion.baseurl);
      this.proxyegreso = await crearproxyegresoviejecutacion(origen);
      try {
        this.navegador = await puppeteer.launch({
          headless: this.configuracion.sininterfazgrafica,
          ...(rutaejecutable ? { executablePath: rutaejecutable } : {}),
          args: [
            `--proxy-server=${this.proxyegreso.url}`,
            '--proxy-bypass-list=<-loopback>',
            '--disable-background-networking',
            '--disable-quic',
            '--dns-prefetch-disable',
            '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-sandbox',
          ],
        });
      } catch (error) {
        await this.proxyegreso.cerrar();
        this.proxyegreso = null;
        throw error;
      }
      console.log('[Puppeteer SIE Real] Navegador inicializado correctamente.');
    }
  }

  private resolverejecutablenavegador(): string | undefined {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    try {
      if (existsSync(puppeteer.executablePath())) {
        return undefined;
      }
    } catch {
      // Ignora error si puppeteer no tiene path por defecto
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

  private async asegurarsesionautenticada(): Promise<Page> {
    await this.inicializar();
    if (!this.navegador) throw new Error('Navegador Puppeteer no disponible');

    const origen = leerurloficialsie(this.configuracion.baseurl);
    if (this.paginaSesion && !this.paginaSesion.isClosed()) {
      if (pertenecealorigen(this.paginaSesion.url(), origen)) return this.paginaSesion;
      await this.paginaSesion.close();
    }
    this.paginaSesion = null;

    if (!this.configuracion.credenciales.usuario || !this.configuracion.credenciales.contrasena) {
      throw new errorautenticacionsierequerida();
    }

    const pagina = await this.navegador.newPage();
    pagina.setDefaultTimeout(this.configuracion.tiempomaximoms);
    try {
      await protegerpagina(pagina, origen);
      await pagina.goto(origen, { waitUntil: 'networkidle2' });
      if (!pertenecealorigen(pagina.url(), origen)) throw new errorautenticacionsierequerida();
      const formulario = await marcarformulariodeacceso(
        pagina,
        origen,
        this.configuracion.selectoreslogin,
      );
      if (!formulario || !pertenecealorigen(pagina.url(), origen)) {
        throw new errorautenticacionsierequerida();
      }
      await pagina.type('[data-sigce-login="user"]', this.configuracion.credenciales.usuario);
      await pagina.type(
        '[data-sigce-login="password"]',
        this.configuracion.credenciales.contrasena,
      );
      await Promise.all([
        pagina.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => undefined),
        pagina.click('[data-sigce-login="submit"]'),
      ]);
      if (!pertenecealorigen(pagina.url(), origen)) throw new errorautenticacionsierequerida();

      const autenticacionValida = await pagina.evaluate(() => ({
        loginVisible: Boolean(document.querySelector('input[type="password"]')),
        marcadorAutenticado: Boolean(
          document.querySelector(
            '#form_goplena, form[action*="/sie/inbox/sie/open"], form[action*="/sie/infoEstudiante/"], a[href*="logout"], a[href*="salir"]',
          ),
        ),
      }));
      if (autenticacionValida.loginVisible || !autenticacionValida.marcadorAutenticado) {
        throw new errorautenticacionsierequerida();
      }
      this.paginaSesion = pagina;
      return pagina;
    } catch (fallo) {
      await pagina.close().catch(() => undefined);
      if (fallo instanceof errorautenticacionsierequerida) throw fallo;
      console.error('[Puppeteer SIE Real] No se pudo comprobar el inicio de sesión.');
      throw new errorautenticacionsierequerida();
    }
  }

  private construirDatosInfoUe(datostrabajo: trabajoprocesamientosie): datosinfoue {
    const gradeLevel = datostrabajo.courseGradeLevel ?? 9;
    let gradoId: number;
    let nivelNombre: string;
    let nivelId: number;

    if (gradeLevel >= 9 && gradeLevel <= 14) {
      // Educación Secundaria
      gradoId = gradeLevel - 8;
      nivelNombre = this.configuracion.nivelNombre;
      nivelId = this.configuracion.nivelId;
    } else if (gradeLevel >= 3 && gradeLevel <= 8) {
      // Educación Primaria
      gradoId = gradeLevel - 2;
      nivelNombre = this.configuracion.nivelPrimariaNombre;
      nivelId = this.configuracion.nivelPrimariaId ?? 12;
    } else {
      gradoId = gradeLevel;
      nivelNombre = this.configuracion.nivelNombre;
      nivelId = this.configuracion.nivelId;
    }

    const gradoNombre = nombresgrados[gradoId] ?? 'Primero';

    const seccion = (datostrabajo.courseSection || 'A').trim().toUpperCase();
    let paraleloId: string;
    if (/^[A-Z]$/.test(seccion)) {
      paraleloId = String(seccion.charCodeAt(0) - 64);
    } else {
      paraleloId = seccion || '1';
    }

    const turnoClave = (datostrabajo.courseShift || 'MORNING').toUpperCase();
    const configTurno = turnosmapeo[turnoClave] ?? turnosmapeo.MORNING;

    return {
      nivel: nivelNombre,
      grado: gradoNombre,
      paralelo: seccion,
      turno: configTurno.nombre,
      paraleloId,
      turnoId: configTurno.id,
      nivelId,
      gradoId,
      cicloId: this.configuracion.cicloId,
      iecId: this.configuracion.credenciales.iecid ?? 0,
      sie: this.configuracion.credenciales.codigosie ?? '',
      gestion: String(datostrabajo.academicYear),
      swRegisterCalifications: true,
      swRegisterPersonBjp: true,
    };
  }

  private async consultarnotassie(pagina: Page, url: string, body: string): Promise<filanotasie[]> {
    const respuesta = await pagina.evaluate(
      async ({ url, body }: { url: string; body: string }) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body,
          credentials: 'include',
          cache: 'no-store',
        });
        return { status: res.status, texto: await res.text() };
      },
      { url, body },
    );

    if (respuesta.status === 401 || respuesta.status === 403) {
      this.paginaSesion = null;
      throw new errorautenticacionsierequerida();
    }
    if (respuesta.status !== 200) {
      throw new Error(`El SIE devolvió error HTTP ${respuesta.status} al consultar calificaciones`);
    }
    let notas: jsonvalor;
    try {
      notas = JSON.parse(respuesta.texto);
    } catch {
      throw new Error(
        'El SIE devolvió una respuesta no JSON al consultar calificaciones del estudiante',
      );
    }
    return extraerfilasnotasie(notas);
  }

  async procesarsincronizacioncalificacion(
    datostrabajo: trabajoprocesamientosie,
  ): Promise<resultadoprocesamientosie> {
    if (!this.configuracion.accesoRealHabilitado) {
      throw new Error('La sincronización real con el SIE no está habilitada por configuración');
    }

    const tipoNotaPeriodo = this.configuracion.tiponotaporperiodo[datostrabajo.periodNumber];
    const grado = datostrabajo.courseGradeLevel;
    const seccion = datostrabajo.courseSection?.trim().toUpperCase() ?? '';
    const turno = datostrabajo.courseShift?.trim().toUpperCase() ?? '';
    const datosinvalidos =
      !Number.isInteger(grado) ||
      !grado ||
      grado < 3 ||
      grado > 14 ||
      !/^(?:[A-Z]|[1-9]\d?)$/.test(seccion) ||
      !Object.prototype.hasOwnProperty.call(turnosmapeo, turno);
    if (!Number.isInteger(tipoNotaPeriodo) || tipoNotaPeriodo < 1 || datosinvalidos) {
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: datostrabajo.localGrade,
        sieValue: null,
        source: 'SIE_REAL',
        status: estadosincronizacionsie.FAILED,
        isMatched: false,
        errorMessage: datosinvalidos
          ? 'No se pudo identificar el curso, paralelo y turno del estudiante para consultar el SIE.'
          : 'El período no tiene un tipo de calificación del SIE configurado.',
        verifiedAt: null,
      };
    }

    const pagina = await this.asegurarsesionautenticada();

    const infoUeDatos = this.construirDatosInfoUe(datostrabajo);
    const infoUeCodificado = codificarinfoue(infoUeDatos);

    console.log(
      `[Puppeteer SIE Real] Consultando lista de estudiantes para RUDE ${datostrabajo.studentRude} (${infoUeDatos.grado} "${infoUeDatos.paralelo}")...`,
    );

    // 1. Obtener lista de estudiantes
    const urlEstudiantes = `${this.configuracion.baseurl}/sie/infoEstudiante/sie/seestudents/?infoUe=${infoUeCodificado}&idiomaId=${this.configuracion.idiomaId}`;

    const respuestaEstudiantes = await pagina.evaluate(async (url: string) => {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'include',
      });
      const texto = await res.text();
      return { status: res.status, texto };
    }, urlEstudiantes);

    if (respuestaEstudiantes.status === 401 || respuestaEstudiantes.status === 403) {
      this.paginaSesion = null;
      throw new errorautenticacionsierequerida();
    }

    if (respuestaEstudiantes.status !== 200) {
      throw new Error(
        `El SIE devolvió error HTTP ${respuestaEstudiantes.status} al listar estudiantes`,
      );
    }

    let estudiantesCrudo: jsonvalor;
    try {
      estudiantesCrudo = JSON.parse(respuestaEstudiantes.texto);
    } catch {
      throw new Error('El SIE devolvió una respuesta no JSON al consultar estudiantes');
    }

    const listaEstudiantes = extraerestudiantesie(estudiantesCrudo);
    const busquedaEstudiante = buscarestudiante(listaEstudiantes, datostrabajo.studentRude);

    if (!busquedaEstudiante.encontrado) {
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: datostrabajo.localGrade,
        sieValue: null,
        source: 'SIE_REAL',
        status: estadosincronizacionsie.FAILED,
        isMatched: false,
        errorMessage: busquedaEstudiante.motivo,
        verifiedAt: null,
      };
    }

    const estudiante = busquedaEstudiante.estudiante;

    // 2. Obtener calificaciones del estudiante
    const urlNotas = `${this.configuracion.baseurl}/sie/infoEstudiante/sie/estudiante_notas/`;
    const cuerpoNotas = new URLSearchParams({
      infoUe: infoUeCodificado,
      infoStudent: JSON.stringify(estudiante.crudo),
      tipoNota: this.configuracion.plantillanotas,
      nivel: String(infoUeDatos.nivelId),
      idInscripcion: estudiante.idinscripcion ?? '',
      gestion: String(datostrabajo.academicYear),
    }).toString();

    const filasNotas = await this.consultarnotassie(pagina, urlNotas, cuerpoNotas);
    const criterioMateria = {
      nombre: datostrabajo.subjectName || datostrabajo.subjectCode,
      codigo: datostrabajo.subjectCode,
      aliassie: this.configuracion.aliasasignaturas,
    };

    const busquedaAsignatura = seleccionarfilaasignatura(
      filasNotas,
      criterioMateria,
      tipoNotaPeriodo,
      { permitiraproximada: this.configuracion.permitircoincidenciaaproximada },
    );

    if (!busquedaAsignatura.encontrado) {
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: datostrabajo.localGrade,
        sieValue: null,
        source: 'SIE_REAL',
        status: estadosincronizacionsie.FAILED,
        isMatched: false,
        errorMessage: busquedaAsignatura.motivo,
        verifiedAt: null,
      };
    }

    const filaNota = busquedaAsignatura.fila;
    if (filaNota.idNotaTipo !== tipoNotaPeriodo) {
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: datostrabajo.localGrade,
        sieValue: null,
        source: 'SIE_REAL',
        status: estadosincronizacionsie.FAILED,
        isMatched: false,
        errorMessage: 'No se pudo identificar el período de la calificación del SIE.',
        verifiedAt: null,
      };
    }
    const coincide = filaNota.nota === datostrabajo.localGrade;

    // 3. Si no coincide y escritura real está habilitada, actualizar calificación
    if (!coincide && this.configuracion.escrituraRealHabilitada) {
      console.log(
        `[Puppeteer SIE Real] Discrepancia detectada (${filaNota.nota} vs local ${datostrabajo.localGrade}). Escribiendo nota en SIE...`,
      );

      const paramsActualizacion = construircuerpoactualizacionsie({
        infoue: infoUeCodificado,
        estudiante,
        fila: filaNota,
        tiponota: tipoNotaPeriodo,
        nivel: infoUeDatos.nivelId,
        gestion: datostrabajo.academicYear,
        nota: datostrabajo.localGrade,
        plantilla: this.configuracion.plantillanotas,
      });

      const bodyActualizar = new URLSearchParams(paramsActualizacion).toString();
      const urlActualizar = `${this.configuracion.baseurl}/sie/infoEstudiante/sie/estudiante_notas/updatescore`;

      const respuestaActualizacion = await pagina.evaluate(
        async ({ url, body }: { url: string; body: string }) => {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body,
            credentials: 'include',
          });
          const texto = await res.text();
          return { status: res.status, texto };
        },
        { url: urlActualizar, body: bodyActualizar },
      );

      if (respuestaActualizacion.status === 401 || respuestaActualizacion.status === 403) {
        this.paginaSesion = null;
        throw new errorautenticacionsierequerida();
      }

      if (
        respuestaActualizacion.status !== 200 ||
        respuestaindicaerror(respuestaActualizacion.texto)
      ) {
        return {
          synchronizationId: datostrabajo.synchronizationId,
          itemId: datostrabajo.itemId,
          studentRude: datostrabajo.studentRude,
          localValue: datostrabajo.localGrade,
          sieValue: null,
          source: 'SIE_REAL',
          status: estadosincronizacionsie.FAILED,
          isMatched: false,
          errorMessage: 'El SIE rechazó la actualización de la calificación.',
          verifiedAt: null,
        };
      }

      let filasVerificadas: filanotasie[];
      try {
        filasVerificadas = await this.consultarnotassie(pagina, urlNotas, cuerpoNotas);
      } catch (fallo) {
        if (fallo instanceof errorautenticacionsierequerida) throw fallo;
        return {
          synchronizationId: datostrabajo.synchronizationId,
          itemId: datostrabajo.itemId,
          studentRude: datostrabajo.studentRude,
          localValue: datostrabajo.localGrade,
          sieValue: null,
          source: 'SIE_REAL',
          status: estadosincronizacionsie.FAILED,
          isMatched: false,
          errorMessage: 'No se pudo volver a consultar la calificación en el SIE tras el envío.',
          verifiedAt: null,
        };
      }

      const verificacion = seleccionarfilaasignatura(
        filasVerificadas,
        criterioMateria,
        tipoNotaPeriodo,
        { permitiraproximada: this.configuracion.permitircoincidenciaaproximada },
      );
      if (
        !verificacion.encontrado ||
        verificacion.fila.idNotaTipo !== tipoNotaPeriodo ||
        verificacion.fila.idEstudianteNota !== filaNota.idEstudianteNota ||
        verificacion.fila.idEstudianteAsignatura !== filaNota.idEstudianteAsignatura
      ) {
        return {
          synchronizationId: datostrabajo.synchronizationId,
          itemId: datostrabajo.itemId,
          studentRude: datostrabajo.studentRude,
          localValue: datostrabajo.localGrade,
          sieValue: null,
          source: 'SIE_REAL',
          status: estadosincronizacionsie.FAILED,
          isMatched: false,
          errorMessage:
            'No se pudo identificar la misma calificación en la lectura posterior del SIE.',
          verifiedAt: null,
        };
      }

      const notaObservada = verificacion.fila.nota;
      const verificada = notaObservada === datostrabajo.localGrade;
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: datostrabajo.localGrade,
        sieValue: notaObservada,
        source: 'SIE_REAL',
        status: verificada ? estadosincronizacionsie.VERIFIED : estadosincronizacionsie.DISCREPANCY,
        isMatched: verificada,
        ...(!verificada
          ? {
              errorMessage:
                'La calificación observada en el SIE después del envío no coincide con la local.',
            }
          : {}),
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      synchronizationId: datostrabajo.synchronizationId,
      itemId: datostrabajo.itemId,
      studentRude: datostrabajo.studentRude,
      localValue: datostrabajo.localGrade,
      sieValue: filaNota.nota,
      source: 'SIE_REAL',
      status: coincide ? estadosincronizacionsie.VERIFIED : estadosincronizacionsie.DISCREPANCY,
      isMatched: coincide,
      verifiedAt: new Date().toISOString(),
    };
  }

  async cerrar(): Promise<void> {
    if (this.paginaSesion && !this.paginaSesion.isClosed()) {
      await this.paginaSesion.close().catch(() => undefined);
      this.paginaSesion = null;
    }
    if (this.navegador) {
      await this.navegador.close().catch(() => undefined);
      this.navegador = null;
      console.log('[Puppeteer SIE Real] Instancia de Chromium cerrada.');
    }
    if (this.proxyegreso) {
      await this.proxyegreso.cerrar();
      this.proxyegreso = null;
    }
  }
}
