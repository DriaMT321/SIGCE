import { SieSyncStatus } from '@academic/shared-types';

export class SieSyncResultEntity {
  constructor(
    public readonly synchronizationId: string,
    public readonly itemId: string,
    public readonly studentRude: string,
    public readonly localValue: number,
    public readonly sieValue: number,
    public readonly status: SieSyncStatus,
    public readonly isMatched: boolean,
    public readonly verifiedAt: Date,
    public readonly errorMessage?: string,
  ) {}
}
