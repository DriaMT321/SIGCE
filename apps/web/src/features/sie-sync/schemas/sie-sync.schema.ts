import { z } from 'zod';

export const sieSyncTriggerResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    synchronizationId: z.string(),
    jobId: z.string().nullable(),
    status: z.enum(['PENDING', 'QUEUED', 'PROCESSING', 'VERIFIED', 'FAILED', 'CANCELLED']),
    message: z.string(),
  }),
});

export const sieSyncStatusEventSchema = z.object({
  synchronizationId: z.string(),
  itemId: z.string().optional(),
  studentRude: z.string().optional(),
  sieValue: z.number().optional(),
  status: z.enum(['PENDING', 'QUEUED', 'PROCESSING', 'VERIFIED', 'FAILED', 'CANCELLED']),
  isMatched: z.boolean().optional(),
  error: z.string().optional(),
});

export type SieSyncTriggerResponse = z.infer<typeof sieSyncTriggerResponseSchema>;
