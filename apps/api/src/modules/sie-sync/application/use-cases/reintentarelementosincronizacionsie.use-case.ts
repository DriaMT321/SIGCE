import type { trabajoprocesamientosie } from '../modelos/trabajoprocesamientosie.model';
import type { puertoreintentarsie } from '../ports/repositoriosincronizacionsie';
import type { puertocolasincronizacionsie } from '../ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from '../ports/publicadorprogresosincronizacionsie.port';

export interface entradareintentarelementosincronizacionsie {
  itemId: string;
  userId: string;
  reason: string;
  ipAddress?: string;
  correlationId?: string;
}

export class casousoreintentarelementosincronizacionsie {
  constructor(
    private readonly repositorio: puertoreintentarsie,
    private readonly cola: puertocolasincronizacionsie,
    private readonly publicadorprogreso: puertopublicadorprogresosincronizacionsie,
  ) {}

  async ejecutar(
    entrada: entradareintentarelementosincronizacionsie,
  ): Promise<{ synchronizationId: string; itemId: string; jobId: string | null }> {
    const tarea: trabajoprocesamientosie =
      await this.repositorio.reintentarelementofallido(entrada);
    const [tareaid] = await this.cola.encolar([tarea]);
    this.publicadorprogreso.publicarencolados({
      synchronizationId: tarea.synchronizationId,
      total: 1,
    });
    return {
      synchronizationId: tarea.synchronizationId,
      itemId: tarea.itemId,
      jobId: tareaid ?? null,
    };
  }
}
