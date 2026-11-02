import { trabajoprocesamientosie } from '../modelos/trabajoprocesamientosie.model';

export const tokenpuertocolasincronizacionsie = Symbol('SIE_SYNC_QUEUE_PORT');

export interface puertocolasincronizacionsie {
  encolar(tareas: trabajoprocesamientosie[]): Promise<string[]>;
}
