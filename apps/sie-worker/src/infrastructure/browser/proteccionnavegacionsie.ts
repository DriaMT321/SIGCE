import type { Page } from 'puppeteer';

export function pertenecealorigen(url: string, origen: string): boolean {
  try {
    const destino = new URL(url);
    return destino.origin === origen && !destino.username && !destino.password;
  } catch {
    return false;
  }
}

export async function protegerpagina(pagina: Page, origen: string): Promise<void> {
  await pagina.setRequestInterception(true);
  pagina.on('request', (solicitud) => {
    if (solicitud.isInterceptResolutionHandled()) return;
    const operacion = pertenecealorigen(solicitud.url(), origen)
      ? solicitud.continue()
      : solicitud.abort('blockedbyclient');
    void operacion.catch(() => undefined);
  });

  await pagina.evaluateOnNewDocument(() => {
    const destinopermitido = (formulario: HTMLFormElement, enviador?: HTMLElement | null) => {
      const boton =
        enviador instanceof HTMLButtonElement || enviador instanceof HTMLInputElement
          ? enviador
          : null;
      const base = document.querySelector<HTMLBaseElement>('base[target]')?.target ?? '';
      const destino = (boton?.formTarget || formulario.target || base).toLowerCase();
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
    const enviar = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
      if (destinopermitido(this)) enviar.call(this);
    };
    window.addEventListener(
      'submit',
      (evento) => {
        if (
          evento.target instanceof HTMLFormElement &&
          !destinopermitido(evento.target, (evento as SubmitEvent).submitter as HTMLElement | null)
        ) {
          evento.preventDefault();
        }
      },
      true,
    );
    Object.defineProperty(window, 'open', { value: () => null, configurable: false });
    for (const nombre of ['RTCPeerConnection', 'webkitRTCPeerConnection']) {
      const original = (window as unknown as Record<string, unknown>)[nombre];
      if (typeof original !== 'function') continue;
      const bloqueado = new Proxy(original, {
        construct() {
          throw new DOMException('Conexión directa no permitida.', 'SecurityError');
        },
      });
      Object.defineProperty(window, nombre, { value: bloqueado, configurable: false });
    }
  });
}

export async function marcarformulariodeacceso(
  pagina: Page,
  origen: string,
  selectores: { usuario?: string; contrasena?: string; enviar?: string },
): Promise<boolean> {
  return pagina.evaluate(
    ({ origen, selectores }) => {
      if (location.origin !== origen) return false;
      const password = selectores.contrasena
        ? document.querySelector(selectores.contrasena)
        : document.querySelector('input[type="password"]');
      if (!(password instanceof HTMLInputElement) || password.type !== 'password') return false;
      const formulario = password.form;
      if (!formulario) return false;
      const posibles = Array.from(formulario.querySelectorAll('input')).filter(
        (input) => input !== password && ['text', 'email', 'number', ''].includes(input.type),
      );
      const usuario = selectores.usuario
        ? document.querySelector(selectores.usuario)
        : (posibles.find((input) =>
            /user|usuario|cuenta|login|ci|docente/i.test(input.name + input.id + input.placeholder),
          ) ?? posibles[0]);
      if (!(usuario instanceof HTMLInputElement) || usuario.form !== formulario) return false;
      const boton = selectores.enviar
        ? document.querySelector(selectores.enviar)
        : formulario.querySelector(
            'button[type="submit"], input[type="submit"], button:not([type])',
          );
      if (
        !(boton instanceof HTMLButtonElement || boton instanceof HTMLInputElement) ||
        boton.form !== formulario ||
        boton.type !== 'submit'
      )
        return false;
      const base = document.querySelector<HTMLBaseElement>('base[target]')?.target ?? '';
      const destino = (boton.formTarget || formulario.target || base).toLowerCase();
      const accion = boton.hasAttribute('formaction') ? boton.formAction : formulario.action;
      try {
        if (
          (destino && destino !== '_self') ||
          new URL(accion, document.baseURI).origin !== origen
        ) {
          return false;
        }
      } catch {
        return false;
      }
      usuario.setAttribute('data-sigce-login', 'user');
      password.setAttribute('data-sigce-login', 'password');
      boton.setAttribute('data-sigce-login', 'submit');
      return true;
    },
    { origen, selectores },
  );
}
