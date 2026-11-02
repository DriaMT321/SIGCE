import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import puppeteer, { type Browser, type Page } from 'puppeteer';
import {
  marcarformulariodeacceso,
  pertenecealorigen,
  protegerpagina,
} from './proteccionnavegacionsie';

describe('protección de navegación del worker SIE', () => {
  let servidor: Server;
  let externo: Server;
  let navegador: Browser;
  let origen: string;
  let origenexterno: string;
  let accesosexternos = 0;

  beforeAll(async () => {
    externo = createServer((_solicitud, respuesta) => {
      accesosexternos += 1;
      respuesta.end('externo');
    });
    await new Promise<void>((resolver) => externo.listen(0, '127.0.0.1', resolver));
    origenexterno = `http://127.0.0.1:${(externo.address() as AddressInfo).port}`;
    servidor = createServer((solicitud, respuesta) => {
      const accion = solicitud.url === '/externo' ? `${origenexterno}/recibir` : '/ingresar';
      const destino = solicitud.url === '/ventana' ? ' target="_blank"' : '';
      respuesta.setHeader('Content-Type', 'text/html; charset=utf-8');
      respuesta.end(
        `<form action="${accion}"${destino}><input name="usuario"><input name="clave" type="password"><button type="submit">Ingresar</button></form>`,
      );
    });
    await new Promise<void>((resolver) => servidor.listen(0, '127.0.0.1', resolver));
    origen = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
    navegador = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  }, 30000);

  afterAll(async () => {
    await navegador?.close();
    if (servidor) await new Promise<void>((resolver) => servidor.close(() => resolver()));
    if (externo) await new Promise<void>((resolver) => externo.close(() => resolver()));
  });

  async function abrir(ruta: string): Promise<Page> {
    const pagina = await navegador.newPage();
    await protegerpagina(pagina, origen);
    await pagina.goto(`${origen}${ruta}`, { waitUntil: 'domcontentloaded' });
    return pagina;
  }

  it('solo acepta la URL exacta del origen permitido', () => {
    expect(pertenecealorigen(`${origen}/acceso`, origen)).toBe(true);
    expect(pertenecealorigen(`${origenexterno}/acceso`, origen)).toBe(false);
    expect(pertenecealorigen('data:text/html,contenido', origen)).toBe(false);
  });

  it('acepta un formulario de acceso cuyo destino es el mismo origen', async () => {
    const pagina = await abrir('/interno');
    try {
      await expect(marcarformulariodeacceso(pagina, origen, {})).resolves.toBe(true);
      expect(await pagina.$('[data-sigce-login="password"]')).not.toBeNull();
    } finally {
      await pagina.close();
    }
  });

  it.each(['/externo', '/ventana'])(
    'rechaza el formulario que apunta fuera del origen o a otra ventana (%s)',
    async (ruta) => {
      const pagina = await abrir(ruta);
      try {
        await expect(marcarformulariodeacceso(pagina, origen, {})).resolves.toBe(false);
      } finally {
        await pagina.close();
      }
    },
  );

  it('bloquea solicitudes y cambios posteriores del formulario hacia un origen externo', async () => {
    const pagina = await abrir('/interno');
    accesosexternos = 0;
    try {
      expect(await marcarformulariodeacceso(pagina, origen, {})).toBe(true);
      const resultado = await pagina.evaluate(async (externoUrl) => {
        const formulario = document.querySelector('form')!;
        formulario.action = `${externoUrl}/recibir`;
        let cancelado = false;
        formulario.addEventListener('submit', (evento) => {
          cancelado = evento.defaultPrevented;
        });
        formulario.requestSubmit();
        const envio = await fetch(`${externoUrl}/recibir`, { mode: 'no-cors' })
          .then(() => true)
          .catch(() => false);
        return { cancelado, envio };
      }, origenexterno);
      expect(resultado).toEqual({ cancelado: true, envio: false });
      expect(accesosexternos).toBe(0);
    } finally {
      await pagina.close();
    }
  });
});
