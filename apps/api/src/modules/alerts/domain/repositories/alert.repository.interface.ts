import { AlertEntity } from '../entities/alert.entity';

export const ALERT_REPOSITORY = Symbol('ALERT_REPOSITORY');

export interface AlertRepository {
  findByUser(userId: string, limit: number, offset: number, status?: string): Promise<{ items: AlertEntity[]; total: number }>;
  markRead(id: string, userId: string): Promise<AlertEntity>;
  updateStatus(id: string, userId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'): Promise<AlertEntity>;
}
