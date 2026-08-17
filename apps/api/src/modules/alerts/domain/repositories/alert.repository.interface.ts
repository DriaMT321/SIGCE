import { AlertEntity } from '../entities/alert.entity';

export const ALERT_REPOSITORY = Symbol('ALERT_REPOSITORY');

export interface AlertRepository {
  findByUser(userId: string, limit: number, offset: number): Promise<{ items: AlertEntity[]; total: number }>;
  markRead(id: string, userId: string): Promise<AlertEntity>;
}
