import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { tokenpuertocolasincronizacionsie } from '../../application/ports/siesincronizacioncola.port';
import type { puertocolasincronizacionsie } from '../../application/ports/siesincronizacioncola.port';
import {
  puertobusquedatrabajossie,
  constanterepositoriosincronizacionsie,
} from '../../application/ports/repositoriosincronizacionsie';

@Injectable()
export class reconciliadorcolasincronizacionsie implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(reconciliadorcolasincronizacionsie.name);
  private interval?: ReturnType<typeof setInterval>;
  private running = false;

  constructor(
    @Inject(constanterepositoriosincronizacionsie)
    private readonly repositorio: puertobusquedatrabajossie,
    @Inject(tokenpuertocolasincronizacionsie) private readonly cola: puertocolasincronizacionsie,
  ) {}

  onModuleInit(): void {
    void this.reconcile();
    this.interval = setInterval(() => void this.reconcile(), 30_000);
    this.interval.unref?.();
  }

  onModuleDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  async reconcile(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const pendientetareas = await this.repositorio.buscartrabajosencola(500);
      if (pendientetareas.length === 0) return;
      await this.cola.encolar(pendientetareas);
    } catch (error) {
      this.logger.error(
        'No se pudo reconciliar la cola SIE; los ítems seguirán pendientes para el próximo ciclo',
        error,
      );
    } finally {
      this.running = false;
    }
  }
}
