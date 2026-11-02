import { z } from 'zod';

export const sieresultadoorigenesquema = z.enum(['LOCAL_SIE_SIMULATION', 'SIE_REAL']);

export const siesincronizacionestadoesquema = z.enum([
  'PENDING',
  'QUEUED',
  'PROCESSING',
  'PAUSED',
  'VERIFIED',
  'DISCREPANCY',
  'AUTH_REQUIRED',
  'FAILED',
  'CANCELLED',
]);
export type siesincronizacionestado = z.infer<typeof siesincronizacionestadoesquema>;

export const siemateriacalificacioncomparacionesquema = z.object({
  sieSubject: z.string(),
  sigceSubject: z.string().optional(),
  sieGrade1T: z.number().nullable().optional(),
  sigceGrade1T: z.number().nullable().optional(),
  sieGrade2T: z.number().nullable().optional(),
  status: z.enum(['COINCIDE', 'DISCREPANCIA', 'SOLO_EN_SIE', 'SOLO_EN_SIGCE']),
  diff: z.number().optional(),
});

export const sieestudiantecomparacionesquema = z.object({
  rude: z.string(),
  studentName: z.string(),
  courseName: z.string(),
  level: z.string().optional(),
  grade: z.string().optional(),
  parallel: z.string().optional(),
  turn: z.string().optional(),
  comparisons: z.array(siemateriacalificacioncomparacionesquema),
  overallMatch: z.boolean(),
  totalSubjectsMatched: z.number(),
  totalDiscrepancies: z.number(),
  sieAverage: z.number(),
  sigceAverage: z.number(),
});
export type sieestudiantecomparacionresultado = z.infer<typeof sieestudiantecomparacionesquema>;

export const sieauditoriarespuestadatosesquema = z.object({
  hasData: z.boolean(),
  summary: z
    .object({
      totalStudents: z.number(),
      totalExactMatches: z.number(),
      totalWithDiscrepancies: z.number(),
      matchPercentage: z.number(),
      sieAverage: z.number(),
      sigceAverage: z.number(),
      auditedCoursesCount: z.number(),
      auditedAt: z.string(),
    })
    .nullable(),
  students: z.array(sieestudiantecomparacionesquema),
  source: sieresultadoorigenesquema.nullable().optional(),
  auditedAt: z.string().optional(),
  reportFile: z.string().optional(),
});

export type sieauditoriarespuestadatos = z.infer<typeof sieauditoriarespuestadatosesquema>;

export const siesincronizacionvistapreviaesquema = z.object({
  fingerprint: z.string().length(64),
  academicYearId: z.string(),
  periodNumber: z.number().int().min(1).max(3),
  maxBatchSize: z.number().int().positive(),
  academicYears: z.array(z.number().int()),
  totalGrades: z.number().int().nonnegative(),
  studentCount: z.number().int().nonnegative(),
  courseCount: z.number().int().nonnegative(),
  subjectCount: z.number().int().nonnegative(),
  courses: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      gradeCount: z.number().int().nonnegative(),
    }),
  ),
});

export const siesincronizacionvistapreviarespuestaesquema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: siesincronizacionvistapreviaesquema,
});

export type siesincronizacionvistaprevia = z.infer<typeof siesincronizacionvistapreviaesquema>;

export interface siesincronizacionlistarfiltros {
  academicYear?: number;
  periodNumber?: number;
  courseName?: string;
  studentRude?: string;
  status?: siesincronizacionestado;
}

export const siesincronizaciondisparadorrespuestaesquema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    synchronizationId: z.string(),
    jobId: z.string().nullable(),
    jobIds: z.array(z.string()),
    totalItems: z.number().int().nonnegative(),
    status: siesincronizacionestadoesquema,
    message: z.string(),
  }),
});

export const siesincronizacionestadoeventoesquema = z.object({
  synchronizationId: z.string(),
  itemId: z.string().optional(),
  studentRude: z.string().optional(),
  sieValue: z.number().optional(),
  status: siesincronizacionestadoesquema,
  isMatched: z.boolean().optional(),
  error: z.string().optional(),
  source: sieresultadoorigenesquema.nullable().optional(),
});
export type siesincronizacionestadoevento = z.infer<typeof siesincronizacionestadoeventoesquema>;

export const siesincronizacionelementoesquema = z.object({
  id: z.string(),
  synchronizationId: z.string(),
  studentId: z.string(),
  subjectId: z.string(),
  periodId: z.string(),
  localValue: z.number(),
  sieValue: z.number().nullable(),
  status: siesincronizacionestadoesquema,
  errorMessage: z.string().nullable(),
  retryCount: z.number(),
  verifiedAt: z.string().nullable(),
  discrepancyResolvedById: z.string().nullable(),
  discrepancyResolvedAt: z.string().nullable(),
  discrepancyResolutionReason: z.string().nullable(),
  discrepancyDecision: z.enum(['KEEP_SIGCE', 'KEEP_SIE_AS_REFERENCE']).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  source: sieresultadoorigenesquema.nullable().optional(),
  student: z.object({ rude: z.string(), firstName: z.string(), lastName: z.string() }),
  subject: z.object({ code: z.string(), name: z.string() }),
  period: z.object({ name: z.string(), number: z.number() }),
  discrepancyResolvedBy: z
    .object({ id: z.string(), firstName: z.string(), lastName: z.string() })
    .nullable(),
  course: z.object({ id: z.string(), name: z.string() }).nullable().optional(),
  discrepancyGroup: z
    .object({
      id: z.string(),
      status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
      dueAt: z.string(),
      assignedTo: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }),
    })
    .nullable()
    .optional(),
});
export type siesincronizacionelemento = z.infer<typeof siesincronizacionelementoesquema>;

export const siesincronizacionesquema = z.object({
  id: z.string(),
  requestedById: z.string(),
  status: siesincronizacionestadoesquema,
  syncType: z.string(),
  totalItems: z.number(),
  processedItems: z.number(),
  discrepancyCount: z.number(),
  errorCount: z.number(),
  pausedAt: z.string().nullable(),
  pausedReason: z.string().nullable(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  source: sieresultadoorigenesquema.nullable().optional(),
  timelineHasMore: z.boolean().optional(),
  items: z.array(siesincronizacionelementoesquema),
  timeline: z
    .array(
      z.object({
        event: z.string(),
        status: z.string().nullable(),
        itemId: z.string().nullable(),
        correlationId: z.string().nullable(),
        actorId: z.string().nullable(),
        createdAt: z.string(),
      }),
    )
    .optional(),
});

export const siesincronizacionlistarrespuestaesquema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.array(siesincronizacionesquema),
  total: z.number(),
});

export type siesincronizaciondisparadorrespuesta = z.infer<
  typeof siesincronizaciondisparadorrespuestaesquema
>;
export type siesincronizacion = z.infer<typeof siesincronizacionesquema>;
