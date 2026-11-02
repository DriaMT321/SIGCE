import type { estadosincronizacionsie } from '@academic/domain-kernel';
import type { trabajoprocesamientosie } from '../modelos/trabajoprocesamientosie.model';

export const constanterepositoriosincronizacionsie = 'SIE_SYNC_REPOSITORY';

export type origenresultadosie = 'LOCAL_SIE_SIMULATION' | 'SIE_REAL';
export type valorestadosincronizacionsie = `${estadosincronizacionsie}`;
export type decisiondiscrepanciasie = 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';

export interface filtroslistadosincronizacionsie {
  academicYear?: number;
  periodNumber?: number;
  courseName?: string;
  studentRude?: string;
  status?: valorestadosincronizacionsie;
}

export interface filtrossincronizacionsie {
  academicYearId: string;
  periodNumber: number;
  courseId?: string;
  subjectId?: string;
}

export interface vistapreviasincronizacionsie {
  fingerprint: string;
  academicYearId: string;
  periodNumber: number;
  maxBatchSize: number;
  academicYears: number[];
  totalGrades: number;
  studentCount: number;
  courseCount: number;
  subjectCount: number;
  courses: Array<{ id: string; name: string; gradeCount: number }>;
}

export interface registroelementosincronizacionsie {
  id: string;
  synchronizationId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  localValue: number;
  sieValue: number | null;
  status: valorestadosincronizacionsie;
  errorMessage: string | null;
  retryCount: number;
  verifiedAt: Date | null;
  discrepancyResolvedById: string | null;
  discrepancyResolvedAt: Date | null;
  discrepancyResolutionReason: string | null;
  discrepancyDecision: string | null;
  createdAt: Date;
  updatedAt: Date;
  source?: origenresultadosie | null;
  student: { rude: string; firstName: string; lastName: string };
  subject: { code: string; name: string };
  period: { name: string; number: number };
  discrepancyResolvedBy?: { id: string; firstName: string; lastName: string } | null;
  course?: { id: string; name: string } | null;
  discrepancyGroup?: {
    id: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    dueAt: Date;
    assignedTo: { id: string; firstName: string; lastName: string };
  } | null;
}

export interface sincronizacionsieconelementos {
  id: string;
  requestedById: string;
  status: valorestadosincronizacionsie;
  syncType: string;
  totalItems: number;
  processedItems: number;
  discrepancyCount: number;
  errorCount: number;
  pausedAt: Date | null;
  pausedReason: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  source?: origenresultadosie | null;
  items: registroelementosincronizacionsie[];
  timelineHasMore?: boolean;
  timeline?: Array<{
    event: string;
    status: string | null;
    itemId: string | null;
    correlationId: string | null;
    actorId: string | null;
    createdAt: Date;
  }>;
}

export interface entradacrearsincronizacion extends filtrossincronizacionsie {
  idempotencyKey: string;
  requestedById: string;
  syncType: string;
  confirmSend: true;
  expectedFingerprint: string;
  expectedGradeCount: number;
  ipAddress?: string;
  correlationId?: string;
}

export interface repositoriosincronizacionsie {
  buscarporidentificador(id: string): Promise<sincronizacionsieconelementos | null>;
  buscartodos(
    limite: number,
    desplazamiento: number,
    filtros?: filtroslistadosincronizacionsie,
  ): Promise<{ items: sincronizacionsieconelementos[]; total: number }>;
  buscartrabajosencola(limite: number): Promise<trabajoprocesamientosie[]>;
  reintentarelementofallido(entrada: {
    itemId: string;
    userId: string;
    reason: string;
    ipAddress?: string;
    correlationId?: string;
  }): Promise<trabajoprocesamientosie>;
  reanudarsincronizacionpausada(entrada: {
    synchronizationId: string;
    userId: string;
    reason: string;
    ipAddress?: string;
    correlationId?: string;
  }): Promise<{
    synchronizationId: string;
    totalItems: number;
    status: valorestadosincronizacionsie;
    jobs: trabajoprocesamientosie[];
  }>;
  previsualizardesdecalificaciones(
    entrada: filtrossincronizacionsie,
  ): Promise<vistapreviasincronizacionsie>;
  resolverdiscrepancia(entrada: {
    itemId: string;
    decision: decisiondiscrepanciasie;
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }): Promise<registroelementosincronizacionsie>;
  resolvergrupodiscrepancias(entrada: {
    groupId: string;
    decision: decisiondiscrepanciasie;
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }): Promise<{ groupId: string; resolvedItemCount: number }>;
  creardesdecalificaciones(entrada: entradacrearsincronizacion): Promise<{
    synchronization: Pick<sincronizacionsieconelementos, 'id' | 'status' | 'totalItems'>;
    jobs: trabajoprocesamientosie[];
    reutilizado: boolean;
  } | null>;
}

export type puertoconsultasincronizacionsie = Pick<
  repositoriosincronizacionsie,
  'buscarporidentificador' | 'buscartodos'
>;
export type puertobusquedatrabajossie = Pick<repositoriosincronizacionsie, 'buscartrabajosencola'>;
export type puertoprevisualizacionsie = Pick<
  repositoriosincronizacionsie,
  'previsualizardesdecalificaciones'
>;
export type puertocrearlotesie = Pick<repositoriosincronizacionsie, 'creardesdecalificaciones'>;
export type puertoreintentarsie = Pick<repositoriosincronizacionsie, 'reintentarelementofallido'>;
export type puertoreanudarsie = Pick<repositoriosincronizacionsie, 'reanudarsincronizacionpausada'>;
export type puertoresolverdiscrepanciasie = Pick<
  repositoriosincronizacionsie,
  'resolverdiscrepancia'
>;
export type puertoresolvergrupodiscrepanciassie = Pick<
  repositoriosincronizacionsie,
  'resolvergrupodiscrepancias'
>;
