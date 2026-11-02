import type { origenauditoriasie } from '@academic/shared-types';

export type resultadoorigen = origenauditoriasie | null | undefined;

export const estadoetiquetas: Record<string, string> = {
  PENDING: 'Pendiente',
  QUEUED: 'En cola',
  PROCESSING: 'Procesando',
  PAUSED: 'Pausada por discrepancias',
  VERIFIED: 'Verificada',
  DISCREPANCY: 'Discrepancia',
  AUTH_REQUIRED: 'Requiere autenticación SIE',
  FAILED: 'Fallida',
  CANCELLED: 'Cancelada',
};

export const estadogrupoetiquetas: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En revisión',
  RESOLVED: 'Resuelto',
};

const eventosetiquetas: Record<string, string> = {
  CONFIRMED_BEFORE_ENQUEUE: 'Lote confirmado para su procesamiento',
  BATCH_PAUSED_FOR_AUTHENTICATION: 'Lote pausado: se requiere acceso',
  BATCH_PAUSED_FOR_DISCREPANCIES: 'Lote pausado por discrepancias',
  BATCH_RESUMED_AFTER_REVIEW: 'Lote reanudado tras la revisión',
  BATCH_RESUMED_WITH_ACTIVE_ITEMS: 'Lote reanudado con registros pendientes',
  BATCH_FINALIZED_AFTER_REVIEW: 'Lote finalizado tras la revisión',
};

export function eventoetiqueta(evento: string): string {
  return eventosetiquetas[evento] ?? 'Actualización del lote';
}

export function tipoetiqueta(tipo: string): string {
  if (tipo === 'GRADES') return 'Calificaciones';
  if (tipo === 'STUDENTS') return 'Estudiantes';
  if (tipo === 'ATTENDANCE') return 'Asistencia';
  return 'Datos académicos';
}

export function origenetiqueta(origen: resultadoorigen): string {
  if (origen === 'LOCAL_SIE_SIMULATION') return 'Verificación local simulada';
  if (origen === 'SIE_REAL') return 'Consulta al SIE real';
  return 'Origen no verificado';
}
