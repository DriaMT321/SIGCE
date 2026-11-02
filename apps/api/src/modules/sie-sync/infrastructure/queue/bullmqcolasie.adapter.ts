import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { datosprocesosincronizacionsie } from '@academic/shared-types';
import { constantecolasincronizacionsie } from '../../../../common/queue/cola.module';
import { puertocolasincronizacionsie } from '../../application/ports/siesincronizacioncola.port';
import { trabajoprocesamientosie } from '../../application/modelos/trabajoprocesamientosie.model';

@Injectable()
export class adaptadorcolasincronizacionsiebullmq implements puertocolasincronizacionsie {
  constructor(
    @InjectQueue(constantecolasincronizacionsie)
    private readonly cola: Queue<datosprocesosincronizacionsie>,
  ) {}

  async encolar(tareas: trabajoprocesamientosie[]): Promise<string[]> {
    const idsporelemento = new Map<string, string>();
    const acrear: datosprocesosincronizacionsie[] = [];
    for (const tarea of tareas) {
      const existente = await this.cola.getJob(tarea.itemId);
      if (existente) {
        const estado = await existente.getState();
        if (estado === 'completed' || estado === 'failed') {
          await existente.remove();
        } else {
          idsporelemento.set(tarea.itemId, existente.id ?? tarea.itemId);
          continue;
        }
      }
      acrear.push({ ...tarea });
    }

    if (acrear.length > 0) {
      const creado = await this.cola.addBulk(
        acrear.map((tarea) => ({
          name: 'sync-grade-sie',
          data: tarea,
          opts: {
            jobId: tarea.itemId,
            attempts: 3,
            backoff: { type: 'exponential' as const, delay: 2000 },
            removeOnComplete: { age: 24 * 60 * 60, count: 1000 },
            removeOnFail: { age: 7 * 24 * 60 * 60, count: 1000 },
          },
        })),
      );
      creado.forEach((queued, indice) => {
        const elementoid = acrear[indice]?.itemId;
        if (elementoid) idsporelemento.set(elementoid, queued.id ?? elementoid);
      });
    }
    return tareas.flatMap((tarea) => {
      const id = idsporelemento.get(tarea.itemId);
      return id ? [id] : [];
    });
  }
}
