export type nombreeventosincronizacionsie =
  | 'sie.sync.queued'
  | 'sie.sync.started'
  | 'sie.sync.progress'
  | 'sie.sync.verified'
  | 'sie.sync.discrepancy'
  | 'sie.sync.authentication_required'
  | 'sie.sync.failed';

export interface publicadoreventossie {
  iniciar(): Promise<void>;
  publicar(evento: nombreeventosincronizacionsie, carga: Record<string, unknown>): Promise<void>;
  detener(): Promise<void>;
}
