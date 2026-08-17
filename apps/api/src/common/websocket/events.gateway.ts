import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SieSyncResult } from '@academic/shared-types';
import Redis from 'ioredis';

const SIE_SYNC_EVENTS_CHANNEL = 'sie-synchronization-events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;
  private subscriber: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.subscriber = new Redis({
      host: this.configService.get<string>('redis.host', 'localhost'),
      port: this.configService.get<number>('redis.port', 6379),
      password: this.configService.get<string>('redis.password') || undefined,
      maxRetriesPerRequest: null,
    });
    await this.subscriber.subscribe(SIE_SYNC_EVENTS_CHANNEL);
    this.subscriber.on('message', (_channel, message) => {
      try {
        const envelope = JSON.parse(message) as { event: string; payload: unknown };
        this.server.emit(envelope.event, envelope.payload);
      } catch (error: unknown) {
        this.logger.error(
          `No se pudo publicar evento Redis: ${error instanceof Error ? error.message : 'error desconocido'}`,
        );
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente WebSocket conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente WebSocket desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: unknown): string {
    this.logger.log(`Ping recibido de ${client.id}: ${JSON.stringify(data)}`);
    return 'pong';
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string },
  ) {
    client.join(payload.room);
    this.logger.log(`Cliente ${client.id} se unió a la sala: ${payload.room}`);
    return { status: 'joined', room: payload.room };
  }

  // Emisión de eventos de sincronización SIE en tiempo real
  emitSieSyncProgress(payload: {
    synchronizationId: string;
    status: string;
    progress: number;
    total: number;
  }) {
    this.server.emit('sie.sync.progress', payload);
  }

  emitSieSyncQueued(payload: Record<string, unknown>) {
    this.server.emit('sie.sync.queued', payload);
  }

  emitSieSyncVerified(result: SieSyncResult) {
    this.server.emit('sie.sync.verified', result);
  }

  emitSieSyncFailed(payload: { synchronizationId: string; error: string }) {
    this.server.emit('sie.sync.failed', payload);
  }

  emitGradeUpdated(payload: {
    studentId: string;
    subjectId: string;
    newValue: number;
  }) {
    this.server.emit('grade.updated', payload);
  }
}
