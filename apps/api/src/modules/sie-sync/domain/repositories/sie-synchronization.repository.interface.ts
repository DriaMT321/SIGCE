import { SieSynchronization } from '@prisma/client';

export const SIE_SYNC_REPOSITORY = 'SIE_SYNC_REPOSITORY';

export interface ISieSynchronizationRepository {
  findById(id: string): Promise<SieSynchronization & { items: unknown[] } | null>;
}
