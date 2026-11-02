import { Worker, Job, UnrecoverableError } from 'bullmq';
import { datosprocesosincronizacionsie, resultadosincronizacionsie } from '@academic/shared-types';
import { configuraciontrabajador } from '../../config/configuraciontrabajador.config';
import { casousoprocesarsincronizacionsie } from '../../application/use-cases/procesarsincronizacionsie.use-case';
import { publicadoreventossie } from '../../application/ports/publicadoreventossie.port';
import type { trabajoprocesamientosie } from '../../application/modelos/sincronizacion.model';
import { errordestinosincronizacionincompatible } from '../../domain/errors/destinosincronizacionincompatible.error';

export class consumidorcolasie {
  private trabajador: Worker<datosprocesosincronizacionsie, resultadosincronizacionsie> | null =
    null;

  constructor(
    private readonly casousoprocesarsincronizacion: casousoprocesarsincronizacionsie,
    private readonly publicadoreventos: publicadoreventossie,
  ) {}

  iniciar(): void {
    console.log(
      `[BullMQ Worker] Escuchando la cola "${configuraciontrabajador.nombrecola}" en Redis ${configuraciontrabajador.redis.servidor}:${configuraciontrabajador.redis.puerto}...`,
    );

    this.trabajador = new Worker<datosprocesosincronizacionsie, resultadosincronizacionsie>(
      configuraciontrabajador.nombrecola,
      async (trabajo: Job<datosprocesosincronizacionsie, resultadosincronizacionsie>) => {
        console.log(`\n[BullMQ] Trabajo recibido [ID: ${trabajo.id}, Name: ${trabajo.name}]`);
        const datostrabajo: trabajoprocesamientosie = {
          synchronizationId: trabajo.data.synchronizationId,
          itemId: trabajo.data.itemId,
          studentRude: trabajo.data.studentRude,
          academicYear: trabajo.data.academicYear,
          periodNumber: trabajo.data.periodNumber,
          subjectCode: trabajo.data.subjectCode,
          subjectName: trabajo.data.subjectName,
          courseGradeLevel: trabajo.data.courseGradeLevel,
          courseSection: trabajo.data.courseSection,
          courseShift: trabajo.data.courseShift,
          localGrade: trabajo.data.localGrade,
          correlationId: trabajo.data.correlationId,
          retryCount: trabajo.data.retryCount,
        };
        try {
          await this.casousoprocesarsincronizacion.validardestino(datostrabajo.synchronizationId);
        } catch (error) {
          if (error instanceof errordestinosincronizacionincompatible) {
            throw new UnrecoverableError(error.message);
          }
          throw error;
        }
        await this.publicadoreventos.publicar('sie.sync.started', {
          synchronizationId: datostrabajo.synchronizationId,
          status: 'PROCESSING',
          source: configuraciontrabajador.sie.fuente,
        });
        await this.publicadoreventos.publicar('sie.sync.progress', {
          synchronizationId: datostrabajo.synchronizationId,
          status: 'PROCESSING',
          source: configuraciontrabajador.sie.fuente,
        });
        try {
          const intentos = trabajo.opts.attempts ?? 1;
          const esintentofinal = trabajo.attemptsMade + 1 >= intentos;
          const resultado = await this.casousoprocesarsincronizacion.ejecutar(datostrabajo, {
            esintentofinal,
          });
          if (resultado.skipped) {
            await this.publicadoreventos.publicar('sie.sync.progress', {
              synchronizationId: datostrabajo.synchronizationId,
              status: 'PAUSED',
              source: configuraciontrabajador.sie.fuente,
            });
            return resultado;
          }
          await this.publicadoreventos.publicar('sie.sync.progress', {
            synchronizationId: datostrabajo.synchronizationId,
            status: resultado.status,
            source: resultado.source,
          });
          const eventofinalizacion = resultado.isMatched
            ? 'sie.sync.verified'
            : resultado.status === 'DISCREPANCY'
              ? 'sie.sync.discrepancy'
              : resultado.status === 'AUTH_REQUIRED'
                ? 'sie.sync.authentication_required'
                : 'sie.sync.failed';
          await this.publicadoreventos.publicar(eventofinalizacion, {
            synchronizationId: resultado.synchronizationId,
            status: resultado.status,
            source: resultado.source,
          });
          return resultado;
        } catch (fallo: unknown) {
          const intentos = trabajo.opts.attempts ?? 1;
          const esintentofinal = trabajo.attemptsMade + 1 >= intentos;
          if (esintentofinal) {
            await this.publicadoreventos.publicar('sie.sync.failed', {
              synchronizationId: datostrabajo.synchronizationId,
              status: 'FAILED',
              source: configuraciontrabajador.sie.fuente,
            });
          } else {
            await this.publicadoreventos.publicar('sie.sync.progress', {
              synchronizationId: datostrabajo.synchronizationId,
              status: 'QUEUED',
              source: configuraciontrabajador.sie.fuente,
            });
          }
          throw fallo;
        }
      },
      {
        connection: {
          host: configuraciontrabajador.redis.servidor,
          port: configuraciontrabajador.redis.puerto,
          password: configuraciontrabajador.redis.contrasena,
          ...(configuraciontrabajador.redis.usartls ? { tls: {} } : {}),
        },
        concurrency: 1,
        limiter: { max: 1, duration: 1000 },
      },
    );

    this.trabajador.on(
      'completed',
      (trabajo: Job<datosprocesosincronizacionsie, resultadosincronizacionsie>) => {
        console.log(`[BullMQ] Trabajo completado exitosamente: ${trabajo.id}`);
      },
    );

    this.trabajador.on(
      'failed',
      (
        trabajo: Job<datosprocesosincronizacionsie, resultadosincronizacionsie> | undefined,
        err: Error,
      ) => {
        console.error(`[BullMQ] Trabajo fallido [ID: ${trabajo?.id}]: ${err.message}`);
      },
    );
  }

  async detener(): Promise<void> {
    if (this.trabajador) {
      await this.trabajador.close();
      console.log('[BullMQ Worker] Worker detenido.');
    }
  }
}
