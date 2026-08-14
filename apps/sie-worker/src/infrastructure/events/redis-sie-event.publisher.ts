import Redis from 'ioredis';
import { workerConfig } from '../../config/worker.config';
import {
  ISieEventPublisher,
  SieSyncEventName,
} from '../../domain/ports/sie-event-publisher.port';

export const SIE_SYNC_EVENTS_CHANNEL = 'sie-synchronization-events';

export class RedisSieEventPublisher implements ISieEventPublisher {
  private client: Redis | null = null;

  async start(): Promise<void> {
    if (this.client) return;
    this.client = new Redis({
      host: workerConfig.redis.host,
      port: workerConfig.redis.port,
      password: workerConfig.redis.password,
      maxRetriesPerRequest: null,
    });
    await this.client.ping();
  }

  async publish(event: SieSyncEventName, payload: Record<string, unknown>): Promise<void> {
    await this.start();
    await this.client!.publish(SIE_SYNC_EVENTS_CHANNEL, JSON.stringify({ event, payload }));
  }

  async stop(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}
