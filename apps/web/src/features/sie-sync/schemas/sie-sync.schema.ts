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

export const sieSyncItemSchema = z.object({
  id: z.string(),
  synchronizationId: z.string(),
  studentId: z.string(),
  subjectId: z.string(),
  periodId: z.string(),
  localValue: z.number(),
  sieValue: z.number().nullable(),
  status: z.enum(['PENDING', 'QUEUED', 'PROCESSING', 'VERIFIED', 'FAILED', 'CANCELLED']),
  errorMessage: z.string().nullable(),
  retryCount: z.number(),
  verifiedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  student: z.object({ rude: z.string(), firstName: z.string(), lastName: z.string() }),
  subject: z.object({ code: z.string(), name: z.string() }),
  period: z.object({ name: z.string(), number: z.number() }),
});

export const sieSynchronizationSchema = z.object({
  id: z.string(),
  requestedById: z.string(),
  status: z.enum(['PENDING', 'QUEUED', 'PROCESSING', 'VERIFIED', 'FAILED', 'CANCELLED']),
  syncType: z.string(),
  totalItems: z.number(),
  processedItems: z.number(),
  errorCount: z.number(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(sieSyncItemSchema),
});

export const sieSyncListResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.array(sieSynchronizationSchema),
  total: z.number(),
});

export type SieSyncTriggerResponse = z.infer<typeof sieSyncTriggerResponseSchema>;
