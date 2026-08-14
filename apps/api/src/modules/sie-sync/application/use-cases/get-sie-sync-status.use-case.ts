import { Inject, Injectable } from '@nestjs/common';
import {
  ISieSynchronizationRepository,
  SIE_SYNC_REPOSITORY,
} from '../../domain/repositories/sie-synchronization.repository.interface';

@Injectable()
export class GetSieSyncStatusUseCase {
  constructor(
    @Inject(SIE_SYNC_REPOSITORY)
    private readonly repository: ISieSynchronizationRepository,
  ) {}

  execute(id: string) {
    return this.repository.findById(id);
  }
}
