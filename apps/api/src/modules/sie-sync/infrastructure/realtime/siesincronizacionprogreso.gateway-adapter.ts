import { Injectable } from '@nestjs/common';
import { pasarelaeventos } from '../../../../common/websocket/eventos.gateway';
import { puertopublicadorprogresosincronizacionsie } from '../../application/ports/publicadorprogresosincronizacionsie.port';

@Injectable()
export class adaptadorpasarelaprogresosincronizacionsie implements puertopublicadorprogresosincronizacionsie {
  constructor(private readonly gateway: pasarelaeventos) {}

  publicarencolados(entrada: { synchronizationId: string; total: number }): void {
    this.gateway.emitirprogresosincronizacionsie({
      synchronizationId: entrada.synchronizationId,
      status: 'QUEUED',
      progress: 0,
      total: entrada.total,
    });
    this.gateway.emitirsincronizacionsieencolada({
      synchronizationId: entrada.synchronizationId,
      status: 'QUEUED',
      total: entrada.total,
    });
  }
}
