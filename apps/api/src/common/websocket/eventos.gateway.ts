import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { servicioprisma } from '../database/prisma.service';
import { revocacionsesionesusuario } from '../../modules/auth/application/ports/usuariosesionrevocacion.port';

const constanteretrasomaximotemporizadorms = 2_147_000_000;

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
    revocacionsesionesusuario
{
  private readonly registrador = new Logger(pasarelaeventos.name);

  @WebSocketServer()
  servidor!: Server;

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

  emitircalificacionactualizada(_cargautil: {
    studentId: string;
    subjectId: string;
    newValue: number;
  }) {
    this.servidor.emit('grade.updated', { status: 'UPDATED' });
  }
}
