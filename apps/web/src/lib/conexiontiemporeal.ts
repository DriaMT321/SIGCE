import { io, Socket } from 'socket.io-client';
import { autenticacionestado } from '../features/auth/services/estadodeautenticacion';

function resolverwebsocketurl(): string {
  const configurado = import.meta.env.VITE_WS_URL;
  if (import.meta.env.PROD) {
    if (!configurado) {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        try {
          const parsed = new URL(apiUrl);
          const esquema = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
          return `${esquema}//${parsed.host}`;
        } catch {
          // Fallback al error
        }
      }
      throw new Error('VITE_WS_URL debe configurarse para la compilación de producción.');
    }
    const url = new URL(configurado);
    if (url.protocol !== 'https:' && url.protocol !== 'wss:') {
      throw new Error('VITE_WS_URL debe usar WSS/HTTPS en producción.');
    }
    return configurado.replace(/^https:/, 'wss:');
  }
  return configurado || 'http://localhost:3000';
}

const constantewsurl = resolverwebsocketurl();

let socket: Socket | null = null;

export function desconectarsocket(): void {
  socket?.disconnect();
  socket = null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('sigce:session-ended', desconectarsocket);
}

export const obtenersocket = (): Socket => {
  if (!socket) {
    socket = io(constantewsurl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: (funcionretorno) => funcionretorno({ token: autenticacionestado.getAccessToken() }),
    });

    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
    });
  }

  return socket;
};
