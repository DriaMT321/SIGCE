import { io, Socket } from 'socket.io-client';
import { autenticacionestado } from '../features/auth/services/estadodeautenticacion';

function resolverwebsocketurl(): string {
  const configurado = import.meta.env.VITE_WS_URL;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'sigce.lat' || hostname.endsWith('.sigce.lat')) {
      return 'wss://api.sigce.lat';
    }
    if (window.location.protocol === 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const baseHost = hostname.replace(/^www\./, '');
      return 'wss://api.' + baseHost;
    }
  }
  if (configurado && (configurado.startsWith('https://') || configurado.startsWith('wss://'))) {
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
