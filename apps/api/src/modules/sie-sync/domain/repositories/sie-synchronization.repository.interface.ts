import { Prisma } from '@prisma/client';
import { SieSyncJobData } from '@academic/shared-types';

export const SIE_SYNC_REPOSITORY = 'SIE_SYNC_REPOSITORY';

export type SieSynchronizationWithItems = Prisma.SieSynchronizationGetPayload<{ include: { items: { include: { student: true; subject: true; period: true } } } }>;

export interface CreateSynchronizationInput {
  requestedById: string;
  syncType: string;
  courseId?: string;
  subjectId?: string;
  periodNumber?: number;
}

export interface ISieSynchronizationRepository {
  findById(id: string): Promise<SieSynchronizationWithItems | null>;
  findAll(limit: number, offset: number): Promise<{ items: SieSynchronizationWithItems[]; total: number }>;
  createFromGrades(input: CreateSynchronizationInput): Promise<{ synchronization: SieSynchronizationWithItems; jobs: SieSyncJobData[] } | null>;
}
