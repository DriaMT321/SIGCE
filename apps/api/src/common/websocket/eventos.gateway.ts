import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { resultadosincronizacionsie } from '@academic/shared-types';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { servicioprisma } from '../database/prisma.service';
import { revocacionsesionesusuario } from '../../modules/auth/application/ports/usuariosesionrevocacion.port';

const constantecanaleventossincronizacionsie = 'sie-synchronization-eventos';
const constanteeventossiepublicos = new Set([
  'sie.sync.queued',
  'sie.sync.started',
  'sie.sync.progress',
  'sie.sync.verified',
  'sie.sync.discrepancy',
  'sie.sync.authentication_required',
  'sie.sync.failed',
]);
const constanteestadossie = new Set([
  'PENDING',
  'QUEUED',
  'PROCESSING',
  'PAUSED',
  'VERIFIED',
  'DISCREPANCY',
  'AUTH_REQUIRED',
  'FAILED',
  'CANCELLED',
]);
const constanteretrasomaximotemporizadorms = 2_147_000_000;

/**
 * Socket.IO is a public progress channel. Never relay RUDE, grades, free-form
 * browser errors, or the original Redis envelope to its subscribers.
 */
export function convertiracargapublicasincronizacionsie(
  evento: string,
  carga: unknown,
): Record<string, string | number | boolean> | null {
  if (
    !constanteeventossiepublicos.has(evento) ||
    !carga ||
    typeof carga !== 'object' ||
    Array.isArray(carga)
  )
    return null;
  const datos = carga as Record<string, unknown>;
  if (typeof datos.synchronizationId !== 'string' || !datos.synchronizationId) return null;
  const estadoalternativo =
    evento === 'sie.sync.failed'
      ? 'FAILED'
      : evento === 'sie.sync.verified'
        ? 'VERIFIED'
        : evento === 'sie.sync.discrepancy'
          ? 'DISCREPANCY'
          : evento === 'sie.sync.authentication_required'
            ? 'AUTH_REQUIRED'
            : evento === 'sie.sync.queued'
              ? 'QUEUED'
              : evento === 'sie.sync.started'
                ? 'PROCESSING'
                : null;
  const estadosincronizacion =
    typeof datos.status === 'string' && constanteestadossie.has(datos.status)
      ? datos.status
      : estadoalternativo;
  if (!estadosincronizacion) return null;

  const cargasegura: Record<string, string | number | boolean> = {
    synchronizationId: datos.synchronizationId,
    status: estadosincronizacion,
  };
  if (datos.source === 'LOCAL_SIE_SIMULATION' || datos.source === 'SIE_REAL')
    cargasegura.source = datos.source;
  return cargasegura;
}

@WebSocketGateway({
  cors: {
    origin: (origen, continuacion) => {
      const configurado = process.env.CORS_ORIGINS?.split(',')
        .map((valor) => valor.trim().replace(/\/$/, ''))
        .filter(Boolean);
      const origenespermitidos = configurado?.length
        ? configurado
        : ['http://localhost:5173', 'http://127.0.0.1:5173'];
      if (!origen || origenespermitidos.includes(origen)) return continuacion(null, true);
      return continuacion(new Error('Origin is not allowed by CORS'));
    },
  },
})
export class pasarelaeventos
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy,
    revocacionsesionesusuario
{
  private readonly registrador = new Logger(pasarelaeventos.name);

  @WebSocketServer()
  servidor!: Server;
  private suscriptor: Redis | null = null;

  constructor(
    private readonly servicioconfiguracion: ConfigService,
    private readonly serviciojwt: JwtService,
    private readonly clienteprisma: servicioprisma,
  ) {}

  afterInit(servidor: Server): void {
    servidor.use((cliente, manejadorsiguiente) => {
      void this.autorizarcliente(cliente)
        .then(() => manejadorsiguiente())
        .catch(() => manejadorsiguiente(new Error('Unauthorized')));
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      this.suscriptor = new Redis({
        host: this.servicioconfiguracion.get<string>('redis.host', 'localhost'),
        port: this.servicioconfiguracion.get<number>('redis.port', 6379),
        password: this.servicioconfiguracion.get<string>('redis.password') || undefined,
        ...(this.servicioconfiguracion.get<boolean>('redis.usarTLS', false) ? { tls: {} } : {}),
        maxRetriesPerRequest: null,
      });

      this.suscriptor.on('error', (error) => {
        this.registrador.warn(`Aviso de conexión Redis (EventsGateway): ${error.message}`);
      });

      await this.suscriptor.subscribe(constantecanaleventossincronizacionsie);
      this.suscriptor.on('message', (_channel, mensaje) => {
        try {
          const envoltura = JSON.parse(mensaje) as { event: string; payload: unknown };
          const cargapublica = convertiracargapublicasincronizacionsie(
            envoltura.event,
            envoltura.payload,
          );
          if (cargapublica) this.servidor.emit(envoltura.event, cargapublica);
        } catch (error: unknown) {
          this.registrador.error(
            `No se pudo publicar evento Redis: ${error instanceof Error ? error.message : 'error desconocido'}`,
          );
        }
      });
    } catch (error: unknown) {
      this.registrador.error(
        `Error al inicializar suscriptor de Redis: ${error instanceof Error ? error.message : 'desconocido'}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.suscriptor) {
      await this.suscriptor.quit();
      this.suscriptor = null;
    }
  }

  handleConnection(cliente: Socket) {
    this.registrador.log(`Cliente WebSocket conectado: ${cliente.id}`);
  }

  private async autorizarcliente(cliente: Socket): Promise<void> {
    const tokenautenticacion =
      typeof cliente.handshake.auth?.token === 'string' ? cliente.handshake.auth.token : '';
    const encabezado = cliente.handshake.headers.authorization;
    const tokenportador =
      typeof encabezado === 'string' && encabezado.startsWith('Bearer ') ? encabezado.slice(7) : '';
    const token = tokenautenticacion || tokenportador;

    try {
      if (!token) throw new Error('Missing access token');
      const carga = this.serviciojwt.verify<{
        sub: string;
        credentialVersion?: number;
        exp?: number;
      }>(token, {
        secret: this.servicioconfiguracion.getOrThrow<string>('jwt.accessSecret'),
      });
      const fechaexpiracion = (carga.exp ?? 0) * 1000;
      const milisegundosrestantes = fechaexpiracion - Date.now();
      if (!Number.isFinite(milisegundosrestantes) || milisegundosrestantes <= 0) {
        throw new Error('Access token must have a future expiration');
      }
      const usuario = await this.clienteprisma.user.findUnique({ where: { id: carga.sub } });
      if (
        !usuario ||
        ((carga.credentialVersion !== undefined || usuario.credentialVersion !== 0) &&
          carga.credentialVersion !== usuario.credentialVersion) ||
        !usuario.isActive ||
        usuario.deletedAt ||
        !['ADMINISTRATIVE', 'SECRETARY'].includes(usuario.role)
      ) {
        throw new Error('User is not allowed to subscribe');
      }
      cliente.data.userId = usuario.id;
      cliente.data.userRole = usuario.role;
      this.programarexpiracionsocket(cliente, fechaexpiracion);
    } catch {
      throw new Error('Unauthorized');
    }
  }

  handleDisconnect(cliente: Socket) {
    const temporizadorexpiracion = cliente.data.jwtExpiryTimer as
      ReturnType<typeof setTimeout> | undefined;
    if (temporizadorexpiracion) clearTimeout(temporizadorexpiracion);
    this.registrador.log(`Cliente WebSocket desconectado: ${cliente.id}`);
  }

  private programarexpiracionsocket(cliente: Socket, fechaexpiracion: number): void {
    const milisegundosrestantes = Math.max(0, fechaexpiracion - Date.now());
    const temporizadorexpiracion = setTimeout(
      () => {
        if (Date.now() >= fechaexpiracion) cliente.disconnect(true);
        else this.programarexpiracionsocket(cliente, fechaexpiracion);
      },
      Math.min(milisegundosrestantes, constanteretrasomaximotemporizadorms),
    );
    temporizadorexpiracion.unref?.();
    cliente.data.jwtExpiryTimer = temporizadorexpiracion;
  }

  revocarsesionesusuario(idusuario: string): void {
    if (!this.servidor) return;
    for (const cliente of this.servidor.sockets.sockets.values()) {
      if (cliente.data.userId === idusuario) cliente.disconnect(true);
    }
  }

  // Emisión de eventos de sincronización SIE en tiempo real
  emitirprogresosincronizacionsie(carga: {
    synchronizationId: string;
    status: string;
    progress: number;
    total: number;
  }) {
    const cargapublica = convertiracargapublicasincronizacionsie('sie.sync.progress', carga);
    if (cargapublica) this.servidor.emit('sie.sync.progress', cargapublica);
  }

  emitirsincronizacionsieencolada(carga: Record<string, unknown>) {
    const cargapublica = convertiracargapublicasincronizacionsie('sie.sync.queued', carga);
    if (cargapublica) this.servidor.emit('sie.sync.queued', cargapublica);
  }

  emitirsincronizacionsieverificada(resultado: resultadosincronizacionsie) {
    const cargapublica = convertiracargapublicasincronizacionsie('sie.sync.verified', resultado);
    if (cargapublica) this.servidor.emit('sie.sync.verified', cargapublica);
  }

  emitirsincronizacionsiefallida(carga: { synchronizationId: string; error: string }) {
    const cargapublica = convertiracargapublicasincronizacionsie('sie.sync.failed', carga);
    if (cargapublica) this.servidor.emit('sie.sync.failed', cargapublica);
  }

  emitircalificacionactualizada(_cargautil: {
    studentId: string;
    subjectId: string;
    newValue: number;
  }) {
    this.servidor.emit('grade.updated', { status: 'UPDATED' });
  }
}
