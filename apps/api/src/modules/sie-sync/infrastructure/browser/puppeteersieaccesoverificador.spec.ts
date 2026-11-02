import type { ConfigService } from '@nestjs/config';
import { runInNewContext } from 'node:vm';
import puppeteer from 'puppeteer';
import { verificadoraccesosiepuppeteer } from './puppeteersieaccesoverificador';

jest.mock('puppeteer', () => ({
  __esModule: true,
  default: { launch: jest.fn() },
}));

const origensie = 'https://academico.sie.gob.bo';

function prepararverificador(opciones: {
  urlfinal?: string;
  accionformulario?: string | null;
  destinoformulario?: string;
  destinobase?: string;
  bloquearredireccion?: boolean;
  atacarpopup?: boolean;
  atacarwebsocket?: boolean;
}) {
  type solicitudpausada = {
    requestId: string;
    resourceType: string;
    request: { url: string };
  };
  type eventowebsocket = { url: string };
  type objetivoadjunto = { sessionId: string; targetInfo: { targetId: string; type: string } };
  const campousuario = { type: jest.fn().mockResolvedValue(undefined) };
  const campocontrasena = { type: jest.fn().mockResolvedValue(undefined) };
  let escuchapeticion: ((solicitud: solicitudpausada) => void) | undefined;
  let escuchawebsocket: ((evento: eventowebsocket) => void) | undefined;
  let escuchaadjunto: ((objetivo: objetivoadjunto) => Promise<void>) | undefined;
  const fallarsolicitud = jest.fn().mockResolvedValue(undefined);
  const continuarsolicitud = jest.fn().mockResolvedValue(undefined);
  const sesionhija = {
    on: jest.fn((evento: string, manejador: (solicitud: never) => void) => {
      if (evento === 'Fetch.requestPaused')
        escuchapeticion = manejador as unknown as typeof escuchapeticion;
      if (evento === 'Network.webSocketCreated')
        escuchawebsocket = manejador as unknown as typeof escuchawebsocket;
    }),
    send: jest.fn(async (metodo: string) => {
      if (metodo === 'Fetch.failRequest') fallarsolicitud();
      if (metodo === 'Fetch.continueRequest') continuarsolicitud();
    }),
  };
  const sesionnavegador = {
    on: jest.fn((evento: string, manejador: (objetivo: objetivoadjunto) => Promise<void>) => {
      if (evento === 'Target.attachedToTarget') escuchaadjunto = manejador;
    }),
    send: jest.fn(async (metodo: string) => {
      if (metodo === 'Target.setAutoAttach') {
        await escuchaadjunto?.({
          sessionId: 'pagina-principal',
          targetInfo: { targetId: 'pagina-principal', type: 'page' },
        });
      }
    }),
    connection: jest.fn(() => ({ session: jest.fn(() => sesionhija) })),
  };
  const enviar = {
    click: jest.fn(async () => {
      if (opciones.atacarpopup) {
        await escuchaadjunto?.({
          sessionId: 'pagina-emergente',
          targetInfo: { targetId: 'pagina-emergente', type: 'page' },
        });
        escuchapeticion?.({
          requestId: 'solicitud-emergente',
          resourceType: 'Document',
          request: { url: 'https://fuera-del-sie.example/recibir?password=secreto' },
        });
      }
      if (opciones.atacarwebsocket)
        escuchawebsocket?.({ url: 'wss://fuera-del-sie.example/recibir?password=secreto' });
    }),
  };
  const pagina = {
    evaluateOnNewDocument: jest.fn().mockResolvedValue(undefined),
    waitForNavigation: jest.fn().mockResolvedValue(null),
    goto: jest.fn(async () => {
      if (opciones.bloquearredireccion) {
        escuchapeticion?.({
          requestId: 'solicitud-redireccion',
          resourceType: 'Document',
          request: { url: 'https://fuera-del-sie.example/continuar' },
        });
        if (fallarsolicitud.mock.calls.length > 0) throw new Error('net::ERR_BLOCKED_BY_CLIENT');
      }
      return { status: () => 200 };
    }),
    url: jest.fn(() => opciones.urlfinal ?? origensie),
    $: jest.fn(async (selector: string) => {
      if (selector === '#username') return campousuario;
      if (selector === '#password') return campocontrasena;
      if (selector === '.btn-aceptar') return enviar;
      return null;
    }),
    evaluate: jest.fn().mockResolvedValue({
      accion: opciones.accionformulario ?? `${origensie}/login`,
      destino: opciones.destinoformulario ?? opciones.destinobase ?? '',
    }),
    close: jest.fn().mockResolvedValue(undefined),
  };
  const navegador = {
    newPage: jest.fn().mockResolvedValue(pagina),
    target: jest.fn(() => ({ createCDPSession: jest.fn().mockResolvedValue(sesionnavegador) })),
    close: jest.fn().mockResolvedValue(undefined),
  };
  jest.mocked(puppeteer.launch).mockResolvedValue(navegador as never);
  const configuracion = {
    get: jest.fn((_clave: string, predeterminado?: number) => predeterminado),
  } as unknown as ConfigService;

  return {
    verificador: new verificadoraccesosiepuppeteer(configuracion),
    pagina,
    navegador,
    sesionhija,
    campousuario,
    campocontrasena,
    enviar,
    fallarsolicitud,
    continuarsolicitud,
  };
}

describe('verificación de acceso al SIE', () => {
  beforeEach(() => jest.clearAllMocks());

  it('bloquea una redirección externa antes de enviar credenciales', async () => {
    const contexto = prepararverificador({ bloquearredireccion: true });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.fallarsolicitud).toHaveBeenCalledTimes(1);
    expect(contexto.campousuario.type).not.toHaveBeenCalled();
    expect(contexto.campocontrasena.type).not.toHaveBeenCalled();
    expect(resultado.loginSuccess).toBe(false);
    expect(contexto.navegador.close).toHaveBeenCalled();
  });

  it('bloquea solicitudes externas de ventanas emergentes antes de que alcancen su destino', async () => {
    const contexto = prepararverificador({ atacarpopup: true });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.fallarsolicitud).toHaveBeenCalledTimes(1);
    expect(contexto.continuarsolicitud).not.toHaveBeenCalled();
    expect(contexto.campousuario.type).toHaveBeenCalledWith('operador');
    expect(contexto.campocontrasena.type).toHaveBeenCalledWith('secreto');
    expect(resultado.message).toContain('Revisa el usuario y la contraseña');
  });

  it('detecta y deniega intentos de WebSocket fuera del origen SIE', async () => {
    const contexto = prepararverificador({ atacarwebsocket: true });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.sesionhija.send).toHaveBeenCalledWith('Network.enable');
    expect(resultado.message).toContain('Revisa el usuario y la contraseña');
  });

  it('rechaza una página final fuera del origen autorizado', async () => {
    const contexto = prepararverificador({ urlfinal: 'https://fuera-del-sie.example/login' });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.pagina.$).not.toHaveBeenCalled();
    expect(contexto.campousuario.type).not.toHaveBeenCalled();
    expect(contexto.campocontrasena.type).not.toHaveBeenCalled();
    expect(resultado.message).toContain('No se enviaron credenciales');
  });

  it('rechaza formularios cuyo destino está fuera del origen autorizado', async () => {
    const contexto = prepararverificador({
      accionformulario: 'https://fuera-del-sie.example/login',
    });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.campousuario.type).not.toHaveBeenCalled();
    expect(contexto.campocontrasena.type).not.toHaveBeenCalled();
    expect(resultado.message).toContain('No se enviaron credenciales');
  });

  it('rechaza envíos que abrirían una ventana emergente antes de usar las credenciales', async () => {
    const contexto = prepararverificador({ destinoformulario: '_blank' });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.campousuario.type).not.toHaveBeenCalled();
    expect(contexto.campocontrasena.type).not.toHaveBeenCalled();
    expect(contexto.enviar.click).not.toHaveBeenCalled();
    expect(resultado.message).toContain('No se enviaron credenciales');
  });

  it('rechaza un destino de formulario compuesto por espacios', async () => {
    const contexto = prepararverificador({ destinoformulario: '   ' });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.campousuario.type).not.toHaveBeenCalled();
    expect(contexto.campocontrasena.type).not.toHaveBeenCalled();
    expect(contexto.enviar.click).not.toHaveBeenCalled();
    expect(resultado.message).toContain('No se enviaron credenciales');
  });

  it('rechaza destinos emergentes heredados de base target antes de usar las credenciales', async () => {
    const contexto = prepararverificador({ destinobase: '_blank' });

    const resultado = await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    expect(contexto.campousuario.type).not.toHaveBeenCalled();
    expect(contexto.campocontrasena.type).not.toHaveBeenCalled();
    expect(contexto.enviar.click).not.toHaveBeenCalled();
    expect(resultado.message).toContain('No se enviaron credenciales');
  });

  it('bloquea ventanas emergentes abiertas por scripts antes de cargar el portal', async () => {
    const contexto = prepararverificador({});

    await contexto.verificador.verificar({
      username: 'operador',
      password: 'secreto',
    });

    const guardapopups = contexto.pagina.evaluateOnNewDocument.mock.calls[0][0];
    expect(contexto.pagina.evaluateOnNewDocument.mock.invocationCallOrder[0]).toBeLessThan(
      contexto.pagina.goto.mock.invocationCallOrder[0],
    );

    class Conexiondirectafalsa {}
    const ventanafalsa = {
      open: jest.fn(),
      addEventListener: jest.fn(),
      RTCPeerConnection: Conexiondirectafalsa,
    };
    const documentofalso = {
      addEventListener: jest.fn(),
      querySelector: jest.fn(() => ({ target: '_blank' })),
      baseURI: `${origensie}/login`,
    };
    const enviarformulario = jest.fn();
    class Formulariofalso {
      target = '';

      action = `${origensie}/login`;

      submit() {}
    }
    Object.defineProperty(Formulariofalso.prototype, 'submit', { value: enviarformulario });
    class Botonfalso {
      formTarget = '_blank';
    }
    class Entradasfalsa {}
    class Elementofalso {
      constructor(private readonly destino: string) {}

      matches(selector: string) {
        return selector === 'a, area';
      }

      getAttribute(nombre: string) {
        return nombre === 'target' ? this.destino : null;
      }

      attachShadow(opciones: ShadowRootInit) {
        return adjuntarsombraoriginal.call(this, opciones);
      }
    }
    const escuchasombra = jest.fn();
    const raizamock = { addEventListener: escuchasombra };
    const adjuntarsombraoriginal = jest.fn(() => raizamock);
    Elementofalso.prototype.attachShadow = adjuntarsombraoriginal;

    runInNewContext(`(${guardapopups.toString()})()`, {
      window: ventanafalsa,
      document: documentofalso,
      HTMLFormElement: Formulariofalso,
      HTMLButtonElement: Botonfalso,
      HTMLInputElement: Entradasfalsa,
      Element: Elementofalso,
      URL,
      DOMException,
      location: { origin: origensie },
    });

    expect(ventanafalsa.open()).toBeNull();
    expect(() => new ventanafalsa.RTCPeerConnection()).toThrow('no permite conexiones directas');
    expect(ventanafalsa.RTCPeerConnection.prototype.constructor).toBe(
      ventanafalsa.RTCPeerConnection,
    );
    expect(() =>
      Reflect.construct(ventanafalsa.RTCPeerConnection.prototype.constructor, []),
    ).toThrow('no permite conexiones directas');
    const anfitrionfalso = new Elementofalso('');
    expect(anfitrionfalso.attachShadow({ mode: 'closed' })).toBe(raizamock);
    expect(adjuntarsombraoriginal).toHaveBeenCalledWith({ mode: 'closed' });
    expect(escuchasombra).toHaveBeenCalledWith(
      'click',
      ventanafalsa.addEventListener.mock.calls.find(([nombre]) => nombre === 'click')?.[1],
      true,
    );
    const manejadorsubmit = ventanafalsa.addEventListener.mock.calls.find(
      ([nombre]) => nombre === 'submit',
    )?.[1];
    const prevenirenvio = jest.fn();
    const detenerenvio = jest.fn();
    const formulariocambiado = new Formulariofalso();
    formulariocambiado.target = '_blank';
    formulariocambiado.action = 'https://fuera-del-sie.example/recibir';
    manejadorsubmit?.({
      target: formulariocambiado,
      submitter: null,
      preventDefault: prevenirenvio,
      stopImmediatePropagation: detenerenvio,
    });
    expect(prevenirenvio).toHaveBeenCalled();
    expect(detenerenvio).toHaveBeenCalled();

    const formularioautorizado = new Formulariofalso();
    documentofalso.querySelector.mockReturnValue({ target: '' });
    const prevenirenvioautorizado = jest.fn();
    const detenerenvioautorizado = jest.fn();
    manejadorsubmit?.({
      target: formularioautorizado,
      submitter: null,
      preventDefault: prevenirenvioautorizado,
      stopImmediatePropagation: detenerenvioautorizado,
    });
    expect(prevenirenvioautorizado).not.toHaveBeenCalled();
    expect(detenerenvioautorizado).toHaveBeenCalled();
    documentofalso.querySelector.mockReturnValue({ target: '_blank' });

    const formularioventanaseparada = new Formulariofalso();
    formularioventanaseparada.target = '_blank';
    formularioventanaseparada.submit();
    expect(enviarformulario).not.toHaveBeenCalled();

    const formularioheredado = new Formulariofalso();
    formularioheredado.submit();
    expect(enviarformulario).not.toHaveBeenCalled();

    const formularioconespacios = new Formulariofalso();
    formularioconespacios.target = '   ';
    formularioconespacios.submit();
    expect(enviarformulario).not.toHaveBeenCalled();

    const manejadorclic = ventanafalsa.addEventListener.mock.calls.find(
      ([nombre]) => nombre === 'click',
    )?.[1];
    const prevenirclic = jest.fn();
    const detenerclic = jest.fn();
    manejadorclic?.({
      target: new Elementofalso('_blank'),
      composedPath: () => [new Elementofalso('_blank')],
      preventDefault: prevenirclic,
      stopImmediatePropagation: detenerclic,
    });
    expect(prevenirclic).toHaveBeenCalled();
    expect(detenerclic).toHaveBeenCalled();

    documentofalso.querySelector.mockReturnValue({ target: '' });
    const prevenirclicseguro = jest.fn();
    const detenerclicseguro = jest.fn();
    manejadorclic?.({
      target: new Elementofalso(''),
      composedPath: () => [new Elementofalso('')],
      preventDefault: prevenirclicseguro,
      stopImmediatePropagation: detenerclicseguro,
    });
    expect(prevenirclicseguro).not.toHaveBeenCalled();
    expect(detenerclicseguro).toHaveBeenCalled();

    documentofalso.querySelector.mockReturnValue({ target: '_blank' });
    const prevenirclicheredado = jest.fn();
    manejadorclic?.({
      target: new Elementofalso(''),
      composedPath: () => [new Elementofalso('')],
      preventDefault: prevenirclicheredado,
      stopImmediatePropagation: jest.fn(),
    });
    expect(prevenirclicheredado).toHaveBeenCalled();

    const prevenirclicconespacios = jest.fn();
    manejadorclic?.({
      target: new Elementofalso('   '),
      composedPath: () => [new Elementofalso('   ')],
      preventDefault: prevenirclicconespacios,
      stopImmediatePropagation: jest.fn(),
    });
    expect(prevenirclicconespacios).toHaveBeenCalled();
  });
});
