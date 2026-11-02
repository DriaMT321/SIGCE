import { createServer, request } from 'node:http';
import type { AddressInfo } from 'node:net';
import { connect } from 'node:net';
import { crearproxyegresoviejecutacion } from './proxyegresoviejecutacion';

describe('proxy de salida para la verificación SIE', () => {
  it('reenvía solo el origen permitido y deniega otro origen HTTP', async () => {
    let accesosexternos = 0;
    const permitidoservidor = createServer((_solicitud, respuesta) => respuesta.end('permitido'));
    const externoservidor = createServer((_solicitud, respuesta) => {
      accesosexternos += 1;
      respuesta.end('externo');
    });
    await new Promise<void>((resolve) => permitidoservidor.listen(0, '127.0.0.1', resolve));
    await new Promise<void>((resolve) => externoservidor.listen(0, '127.0.0.1', resolve));
    const origenpermitido = `http://127.0.0.1:${(permitidoservidor.address() as AddressInfo).port}`;
    const origenexterno = `http://127.0.0.1:${(externoservidor.address() as AddressInfo).port}`;
    const proxy = await crearproxyegresoviejecutacion(origenpermitido);

    try {
      const solicitar = (destino: string) =>
        new Promise<{ estado: number; contenido: string }>((resolve, reject) => {
          const solicitud = request(proxy.url, { method: 'GET', path: destino }, (respuesta) => {
            let contenido = '';
            respuesta.setEncoding('utf8');
            respuesta.on('data', (fragmento: string) => (contenido += fragmento));
            respuesta.on('end', () => resolve({ estado: respuesta.statusCode ?? 0, contenido }));
          });
          solicitud.on('error', reject);
          solicitud.end();
        });

      await expect(solicitar(`${origenpermitido}/consulta`)).resolves.toEqual({
        estado: 200,
        contenido: 'permitido',
      });
      await expect(solicitar(`${origenexterno}/recibir?password=secreto`)).resolves.toMatchObject({
        estado: 403,
      });
      expect(accesosexternos).toBe(0);
    } finally {
      await proxy.cerrar();
      await Promise.all([
        new Promise<void>((resolve) => permitidoservidor.close(() => resolve())),
        new Promise<void>((resolve) => externoservidor.close(() => resolve())),
      ]);
    }
  });

  it('deniega túneles CONNECT a destinos distintos del origen permitido', async () => {
    let accesosexternos = 0;
    const externoservidor = createServer();
    externoservidor.on('connection', () => (accesosexternos += 1));
    await new Promise<void>((resolve) => externoservidor.listen(0, '127.0.0.1', resolve));
    const proxy = await crearproxyegresoviejecutacion('https://academico.sie.gob.bo');
    const puertodestino = (externoservidor.address() as AddressInfo).port;

    try {
      const respuesta = await new Promise<string>((resolve, reject) => {
        const socket = connect(Number(new URL(proxy.url).port), '127.0.0.1', () => {
          socket.write(
            `CONNECT 127.0.0.1:${puertodestino} HTTP/1.1\r\nHost: 127.0.0.1:${puertodestino}\r\n\r\n`,
          );
        });
        socket.on('data', (fragmento) => {
          resolve(fragmento.toString());
          socket.destroy();
        });
        socket.on('error', reject);
      });

      expect(respuesta).toContain('403 Forbidden');
      expect(accesosexternos).toBe(0);
    } finally {
      await proxy.cerrar();
      await new Promise<void>((resolve) => externoservidor.close(() => resolve()));
    }
  });

  it('deniega WebSocket plano antes de abrir el socket de destino', async () => {
    let actualizacionexterna = 0;
    const externoservidor = createServer();
    externoservidor.on('upgrade', () => (actualizacionexterna += 1));
    await new Promise<void>((resolve) => externoservidor.listen(0, '127.0.0.1', resolve));
    const proxy = await crearproxyegresoviejecutacion('https://academico.sie.gob.bo');
    const puertodestino = (externoservidor.address() as AddressInfo).port;

    try {
      const respuesta = await new Promise<string>((resolve, reject) => {
        const socket = connect(Number(new URL(proxy.url).port), '127.0.0.1', () => {
          socket.write(
            `GET ws://127.0.0.1:${puertodestino}/recibir?password=secreto HTTP/1.1\r\nHost: 127.0.0.1:${puertodestino}\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n\r\n`,
          );
        });
        socket.on('data', (fragmento) => {
          resolve(fragmento.toString());
          socket.destroy();
        });
        socket.on('error', reject);
      });

      expect(respuesta).toContain('403 Forbidden');
      expect(actualizacionexterna).toBe(0);
    } finally {
      await proxy.cerrar();
      await new Promise<void>((resolve) => externoservidor.close(() => resolve()));
    }
  });
});
