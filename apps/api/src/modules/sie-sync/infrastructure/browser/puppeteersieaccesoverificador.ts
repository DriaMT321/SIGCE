import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer, { type Protocol } from 'puppeteer';
import { crearproxyegresoviejecutacion } from './proxyegresoviejecutacion';
import {
  credencialesaccesosie,
  verificacionaccesosie,
  verificadoraccesosie,
} from '../../application/ports/verificadoraccesosie.port';
import { urloficialsie } from '../../application/services/urlsieoficial';

@Injectable()
export class verificadoraccesosiepuppeteer implements verificadoraccesosie {
  constructor(private readonly configuracionservicio: ConfigService) {}

  async verificar(credenciales: credencialesaccesosie): Promise<verificacionaccesosie> {
    const urlconfigurada = this.configuracionservicio.get<string>('sie.baseUrl')?.trim();
    const origensie = urloficialsie(urlconfigurada || 'https://academico.sie.gob.bo');
    const urliniciosesion = origensie;
    const origenpermitido = new URL(origensie).origin;
    const verificadoen = new Date().toISOString();
    let navegador: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
    let proxyegreso: Awaited<ReturnType<typeof crearproxyegresoviejecutacion>> | undefined;
    let estadohttp = 0;
    let redireccionexternabloqueada = false;

    try {
      proxyegreso = await crearproxyegresoviejecutacion(origenpermitido);
      navegador = await puppeteer.launch({
        headless: true,
        args: [
          `--proxy-server=${proxyegreso.url}`,
          '--proxy-bypass-list=<-loopback>',
          '--disable-background-networking',
          '--disable-quic',
          '--dns-prefetch-disable',
          '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
        ],
      });
      const pagina = await navegador.newPage();
      const sesionnavegador = await navegador.target().createCDPSession();
      sesionnavegador.on('Target.attachedToTarget', async ({ sessionId, targetInfo }) => {
        const sesion = sesionnavegador.connection()?.session(sessionId);
        if (!sesion) return;
        let listoparacontinuar = false;
        try {
          if (
            ['page', 'iframe', 'worker', 'shared_worker', 'service_worker'].includes(
              targetInfo.type,
            )
          ) {
            await sesion.send('Network.enable');
            sesion.on('Network.webSocketCreated', ({ url }) => {
              try {
                const direccion = new URL(url);
                const protocolo = direccion.protocol === 'wss:' ? 'https:' : 'http:';
                if (`${protocolo}//${direccion.host}` !== origenpermitido)
                  redireccionexternabloqueada = true;
              } catch {
                redireccionexternabloqueada = true;
              }
            });
            sesion.on('Fetch.requestPaused', (solicitud: Protocol.Fetch.RequestPausedEvent) => {
              let origen: string;
              try {
                origen = new URL(solicitud.request.url).origin;
              } catch {
                origen = '';
              }
              if (origen !== origenpermitido) {
                if (solicitud.resourceType === 'Document') redireccionexternabloqueada = true;
                void sesion
                  .send('Fetch.failRequest', {
                    requestId: solicitud.requestId,
                    errorReason: 'BlockedByClient',
                  })
                  .catch(() => undefined);
                return;
              }
              void sesion
                .send('Fetch.continueRequest', { requestId: solicitud.requestId })
                .catch(() => undefined);
            });
            await sesion.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
          }
          if (targetInfo.type === 'page') {
            await sesion.send('Target.setAutoAttach', {
              autoAttach: true,
              waitForDebuggerOnStart: true,
              flatten: true,
            });
          }
          listoparacontinuar = true;
        } catch {
          redireccionexternabloqueada = true;
          await sesionnavegador
            .send('Target.closeTarget', { targetId: targetInfo.targetId })
            .catch(() => undefined);
        } finally {
          if (listoparacontinuar)
            await sesion.send('Runtime.runIfWaitingForDebugger').catch(() => undefined);
        }
      });
      await sesionnavegador.send('Target.setAutoAttach', {
        autoAttach: true,
        waitForDebuggerOnStart: true,
        flatten: true,
      });
      await pagina.evaluateOnNewDocument(() => {
        const obtenerdestinobase = () =>
          document.querySelector<HTMLBaseElement>('base[target]')?.target.toLowerCase() ?? '';
        const destinopermitido = (formulario: HTMLFormElement, enviador?: HTMLElement | null) => {
          const boton =
            enviador instanceof HTMLButtonElement || enviador instanceof HTMLInputElement
              ? enviador
              : null;
          const destino = (
            boton?.formTarget ||
            formulario.target ||
            obtenerdestinobase()
          ).toLowerCase();
          const accion = boton?.hasAttribute('formaction') ? boton.formAction : formulario.action;
          try {
            return (
              (destino === '' || destino === '_self') &&
              new URL(accion, document.baseURI).origin === location.origin
            );
          } catch {
            return false;
          }
        };
        Object.defineProperty(window, 'open', {
          value: () => null,
          writable: false,
          configurable: false,
        });
        for (const nombre of ['RTCPeerConnection', 'webkitRTCPeerConnection']) {
          const constructororiginal = (window as unknown as Record<string, unknown>)[nombre];
          if (typeof constructororiginal !== 'function') continue;
          const constructorbloqueado = new Proxy(constructororiginal, {
            construct() {
              throw new DOMException(
                'La verificación SIE no permite conexiones directas.',
                'SecurityError',
              );
            },
          });
          const prototipoconexion = (constructororiginal as { prototype?: unknown }).prototype;
          if (typeof prototipoconexion === 'object' && prototipoconexion !== null)
            Object.defineProperty(prototipoconexion, 'constructor', {
              value: constructorbloqueado,
              writable: false,
              configurable: false,
            });
          Object.defineProperty(window, nombre, {
            value: constructorbloqueado,
            writable: false,
            configurable: false,
          });
        }
        const enviarformulariooriginal = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function () {
          if (destinopermitido(this)) enviarformulariooriginal.call(this);
        };
        window.addEventListener(
          'submit',
          (evento) => {
            const formulario = evento.target;
            if (!(formulario instanceof HTMLFormElement)) return;
            if (!destinopermitido(formulario, (evento as SubmitEvent).submitter))
              evento.preventDefault();
            // The browser performs the already-validated native submission after this event.
            evento.stopImmediatePropagation();
          },
          true,
        );
        const manejadorclic = (evento: Event) => {
          const enlace = evento
            .composedPath()
            .find(
              (elemento): elemento is Element =>
                elemento instanceof Element && elemento.matches('a, area'),
            );
          if (!enlace) return;
          const destino = enlace.getAttribute('target')?.toLowerCase() || obtenerdestinobase();
          if (destino && destino !== '_self') {
            evento.preventDefault();
          }
          evento.stopImmediatePropagation();
        };
        window.addEventListener('click', manejadorclic, true);
        const adjuntarsombraoriginal = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function (opciones) {
          const raiz = adjuntarsombraoriginal.call(this, opciones);
          raiz.addEventListener('click', manejadorclic, true);
          return raiz;
        };
      });
      const respuesta = await pagina.goto(urliniciosesion, {
        waitUntil: 'domcontentloaded',
        timeout: this.configuracionservicio.get<number>('sie.timeoutMs', 30000),
      });
      estadohttp = respuesta?.status() ?? 0;

      if (!respuesta || estadohttp >= 500) {
        return {
          active: false,
          httpStatus: estadohttp,
          loginSuccess: false,
          portalUrl: origensie,
          portalTitle: 'Portal SIE',
          message: 'El portal SIE no respondió correctamente.',
          checkedAt: verificadoen,
          error: 'No se pudo completar la operación con el SIE.',
        };
      }
      if (redireccionexternabloqueada || new URL(pagina.url()).origin !== origenpermitido) {
        return {
          active: false,
          httpStatus: estadohttp,
          loginSuccess: false,
          portalUrl: origensie,
          portalTitle: 'Portal SIE no verificado',
          message:
            'El portal SIE intentó salir del origen autorizado. No se enviaron credenciales.',
          checkedAt: verificadoen,
        };
      }

      const campousuario = await pagina.$('#username');
      const campocontrasena = await pagina.$('#password');
      if (!campousuario || !campocontrasena) {
        return {
          active: true,
          httpStatus: estadohttp,
          loginSuccess: false,
          portalUrl: origensie,
          portalTitle: 'Portal SIE',
          message: 'El formulario de acceso del portal SIE cambió y no se pudo verificar.',
          checkedAt: verificadoen,
        };
      }

      const enviar = await pagina.$('.btn-aceptar');
      const destinoformulario = await pagina.evaluate(() => {
        const campo = document.querySelector<HTMLInputElement>('#username');
        const contrasena = document.querySelector<HTMLInputElement>('#password');
        const formulario = campo?.form;
        const boton = document.querySelector<HTMLButtonElement | HTMLInputElement>('.btn-aceptar');
        const destinobase =
          document.querySelector<HTMLBaseElement>('base[target]')?.target.toLowerCase() ?? '';
        if (!formulario || contrasena?.form !== formulario || boton?.form !== formulario)
          return null;
        const accionboton = boton.getAttribute('formaction');
        const destinoboton = boton.getAttribute('formtarget');
        return {
          accion:
            accionboton === null ? formulario.action : new URL(accionboton, document.baseURI).href,
          destino:
            (destinoboton === null ? '' : destinoboton.toLowerCase()) ||
            formulario.target.toLowerCase() ||
            destinobase,
        };
      });
      if (
        !enviar ||
        !destinoformulario ||
        new URL(destinoformulario.accion).origin !== origenpermitido ||
        (destinoformulario.destino !== '' && destinoformulario.destino !== '_self')
      ) {
        return {
          active: false,
          httpStatus: estadohttp,
          loginSuccess: false,
          portalUrl: origensie,
          portalTitle: 'Formulario SIE no verificado',
          message:
            'El envío SIE usa un destino o una ventana no autorizados. No se enviaron credenciales.',
          checkedAt: verificadoen,
        };
      }

      await campousuario.type(credenciales.username);
      await campocontrasena.type(credenciales.password);
      const casillaconsentimiento = await pagina.$('input[type="checkbox"]');
      if (casillaconsentimiento) {
        const estamarcado = await casillaconsentimiento.evaluate(
          (element) => (element as HTMLInputElement).checked,
        );
        if (!estamarcado) await casillaconsentimiento.click();
      }
      await Promise.all([
        pagina
          .waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 12000 })
          .catch(() => null),
        enviar.click(),
      ]);

      if (redireccionexternabloqueada || new URL(pagina.url()).origin !== origenpermitido) {
        return {
          active: false,
          httpStatus: estadohttp,
          loginSuccess: false,
          portalUrl: origensie,
          portalTitle: 'Portal SIE no verificado',
          message:
            'No se pudo comprobar el acceso al SIE. Revisa el usuario y la contraseña, o verifica que el portal esté habilitado y disponible.',
          checkedAt: verificadoen,
        };
      }

      const estadoautenticacion = await pagina.evaluate(() => ({
        loginFormVisible: Boolean(document.querySelector('#username, #password')),
        authenticatedMarkerVisible: Boolean(
          document.querySelector(
            '#form_goplena, form[action*="/sie/inbox/sie/open"], form[action*="/sie/infoEstudiante/"], a[href*="logout"], a[href*="salir"]',
          ),
        ),
      }));
      const iniciosesionexitoso =
        !estadoautenticacion.loginFormVisible && estadoautenticacion.authenticatedMarkerVisible;

      return {
        active: true,
        httpStatus: estadohttp,
        loginSuccess: iniciosesionexitoso,
        portalUrl: origensie,
        portalTitle: 'Portal SIE',
        message: iniciosesionexitoso
          ? 'Acceso al portal SIE validado. No se transfirieron ni modificaron datos.'
          : 'No fue posible confirmar el acceso al portal SIE. No se realizaron otras operaciones.',
        checkedAt: verificadoen,
      };
    } catch {
      return {
        active: false,
        httpStatus: estadohttp,
        loginSuccess: false,
        portalUrl: origensie,
        portalTitle: 'Portal SIE no disponible',
        message: redireccionexternabloqueada
          ? 'No se pudo comprobar el acceso al SIE. Revisa el usuario y la contraseña, o verifica que el portal esté habilitado y disponible.'
          : 'No se pudo completar la verificación de acceso al portal SIE.',
        checkedAt: verificadoen,
        error: 'No se pudo completar la operación con el SIE.',
      };
    } finally {
      await navegador?.close().catch(() => undefined);
      await proxyegreso?.cerrar().catch(() => undefined);
    }
  }
}
