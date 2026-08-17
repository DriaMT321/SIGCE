import { Inject, Injectable } from '@nestjs/common';
import { ALERT_REPOSITORY, AlertRepository } from '../../domain/repositories/alert.repository.interface';

@Injectable()
export class ListAlertsUseCase {
  constructor(@Inject(ALERT_REPOSITORY) private readonly repository: AlertRepository) {}
  execute(userId: string, limit: number, offset: number) { return this.repository.findByUser(userId, limit, offset); }
}

@Injectable()
export class MarkAlertReadUseCase {
  constructor(@Inject(ALERT_REPOSITORY) private readonly repository: AlertRepository) {}
  execute(id: string, userId: string) { return this.repository.markRead(id, userId); }
}
