export const tokenpublicadorprogresosincronizacionsie = Symbol('SIE_SYNC_PROGRESS_PUBLISHER');

export interface puertopublicadorprogresosincronizacionsie {
  publicarencolados(entrada: { synchronizationId: string; total: number }): void;
}
