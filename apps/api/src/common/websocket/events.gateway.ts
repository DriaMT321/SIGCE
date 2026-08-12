import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SieSyncResult } from '@academic/shared-types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(` Cliente WebSocket conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Cliente WebSocket desconectado: ${client.id}`);
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
