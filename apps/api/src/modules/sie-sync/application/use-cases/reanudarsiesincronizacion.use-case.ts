import type { puertoreanudarsie } from '../ports/repositoriosincronizacionsie';
import type { puertocolasincronizacionsie } from '../ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from '../ports/publicadorprogresosincronizacionsie.port';

export interface entradareanudarsincronizacionsie {
  synchronizationId: string;
  userId: string;
  reason: string;
  ipAddress?: string;
  correlationId?: string;
}

export class casousoreanudarsincronizacionsie {
  constructor(
    private readonly repositorio: puertoreanudarsie,
    private readonly cola: puertocolasincronizacionsie,
    private readonly publicadorprogreso: puertopublicadorprogresosincronizacionsie,
  ) {}

  async ejecutar(entrada: entradareanudarsincronizacionsie) {
    const reanudado = await this.repositorio.reanudarsincronizacionpausada(entrada);
    const tareaids = reanudado.jobs.length > 0 ? await this.cola.encolar(reanudado.jobs) : [];
    if (reanudado.status === 'QUEUED') {
      this.publicadorprogreso.publicarencolados({
        synchronizationId: reanudado.synchronizationId,
        total: reanudado.totalItems,
      });
    }
    return {
      synchronizationId: reanudado.synchronizationId,
      jobIds: tareaids,
      status: reanudado.status,
    };
  }
}
