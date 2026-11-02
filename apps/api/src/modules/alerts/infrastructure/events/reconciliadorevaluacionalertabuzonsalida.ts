import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { casousoprocesarevaluacionesalertaspendientes } from '../../application/use-cases/alerta.use-cases';

const constanteintervaloreconciliacionms = 15_000;

@Injectable()
export class reconciliadoroutboxevaluacionalertas implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(reconciliadoroutboxevaluacionalertas.name);
  private timer: NodeJS.Timeout | undefined;
  private running = false;

  constructor(private readonly processor: casousoprocesarevaluacionesalertaspendientes) {}

  onModuleInit(): void {
    this.timer = setInterval(
      () => void this.procesarpendiente(),
      constanteintervaloreconciliacionms,
    );
    this.timer.unref();
    void this.procesarpendiente();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async procesarpendiente(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const resultado = await this.processor.ejecutar();
      if (resultado.retried > 0) {
        this.logger.warn(
          `Se reprogramaron ${resultado.retried} evaluaciones de alertas para un nuevo intento.`,
        );
      }
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      this.logger.error(`Falló la conciliación pendiente de alertas: ${mensaje}`);
    } finally {
      this.running = false;
    }
  }
}
