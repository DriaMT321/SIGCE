import { request as solicitudhttp, createServer, type OutgoingHttpHeaders } from 'node:http';
import { connect as conectarsocket } from 'node:net';
import { request as solicitudhttps } from 'node:https';

export async function crearproxyegresoviejecutacion(origenpermitido: string) {
  const servidor = createServer((solicitud, respuesta) => {
    let destino: URL;
    try {
      destino = new URL(solicitud.url ?? '');
    } catch {
      respuesta.writeHead(400).end();
      return;
    }
    if (destino.origin !== origenpermitido || destino.username || destino.password) {
      respuesta.writeHead(403).end();
      return;
    }
    const transporte = destino.protocol === 'https:' ? solicitudhttps : solicitudhttp;
    const cabeceras: OutgoingHttpHeaders = { ...solicitud.headers, host: destino.host };
    delete cabeceras['proxy-connection'];
    delete cabeceras.connection;
    delete cabeceras.upgrade;
    const respuestaorigen = transporte(
      destino,
      { method: solicitud.method, headers: cabeceras },
      (respuestaorigen) => {
        respuesta.writeHead(respuestaorigen.statusCode ?? 502, respuestaorigen.headers);
        respuestaorigen.pipe(respuesta);
      },
    );
    respuestaorigen.on('error', () => respuesta.writeHead(502).end());
    solicitud.pipe(respuestaorigen);
  });

  servidor.on('connect', (solicitud, socket, cabecerasiniciales) => {
    let destino: URL;
    try {
      destino = new URL(`https://${solicitud.url ?? ''}`);
    } catch {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      return;
    }
    if (
      destino.origin !== origenpermitido ||
      destino.protocol !== 'https:' ||
      destino.username ||
      destino.password
    ) {
      socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
      return;
    }
    const puertodestino = Number(destino.port || 443);
    const socketorigen = conectarsocket(puertodestino, destino.hostname, () => {
      socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (cabecerasiniciales.length) socketorigen.write(cabecerasiniciales);
      socketorigen.pipe(socket);
      socket.pipe(socketorigen);
    });
    socketorigen.on('error', () => socket.destroy());
  });

  servidor.on('upgrade', (_solicitud, socket) => {
    socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
  });

  await new Promise<void>((resolve, reject) => {
    servidor.once('error', reject);
    servidor.listen(0, '127.0.0.1', () => resolve());
  });
  const direccion = servidor.address();
  if (!direccion || typeof direccion === 'string') {
    await new Promise<void>((resolve) => servidor.close(() => resolve()));
    throw new Error('No se pudo iniciar el proxy local del SIE.');
  }

  return {
    url: `http://127.0.0.1:${direccion.port}`,
    cerrar: () =>
      new Promise<void>((resolve, reject) => {
        servidor.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
