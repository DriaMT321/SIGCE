import { AuditAction, PrismaClient, SieSyncStatus } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import {
  puertoprocesamientosincronizacionsie,
  guardarresultadosincronizacionsie,
  elementosincronizacionsiealmacenado,
  duracionarrendamientosie,
  resultadoreclamoelementosie,
} from '../../application/ports/procesamientosincronizacionsie.port';
import { estadosincronizacionsie as estadosincronizacionsie } from '@academic/domain-kernel';

export class adaptadorprismaprocesamientosie implements puertoprocesamientosincronizacionsie {
  constructor(private readonly clienteprisma: PrismaClient) {}

  async validardestinosincronizacion(
    idsincronizacion: string,
    destinotrabajador: 'LOCAL_SIE_SIMULATION' | 'SIE_REAL',
  ): Promise<boolean> {
    const confirmacion = await this.clienteprisma.auditLog.findFirst({
      where: {
        action: AuditAction.SYNC_SIE,
        entity: 'SieSynchronization',
        entityId: idsincronizacion,
      },
      select: { newValue: true },
      orderBy: { createdAt: 'asc' },
    });
    const datos = confirmacion?.newValue;
    const esobjeto = datos !== null && typeof datos === 'object' && !Array.isArray(datos);
    if (
      esobjeto &&
      datos.event === 'CONFIRMED_BEFORE_ENQUEUE' &&
      datos.source === destinotrabajador
    ) {
      return true;
    }

    await this.clienteprisma.sieSynchronization.updateMany({
      where: {
        id: idsincronizacion,
        status: { in: [SieSyncStatus.PENDING, SieSyncStatus.QUEUED, SieSyncStatus.PROCESSING] },
      },
      data: {
        status: SieSyncStatus.PAUSED,
        pausedAt: new Date(),
        pausedReason: 'No se pudo confirmar que el destino del lote coincida con el trabajador.',
      },
    });
    return false;
  }

  async obtenerestadosincronizacion(
    idsincronizacion: string,
  ): Promise<estadosincronizacionsie | null> {
    const sincronizacion = await this.clienteprisma.sieSynchronization.findUnique({
      where: { id: idsincronizacion },
      select: { status: true },
    });
    return (sincronizacion?.status as estadosincronizacionsie | undefined) ?? null;
  }

  async reclamarelemento(
    idsincronizacion: string,
    idelemento: string,
  ): Promise<resultadoreclamoelementosie> {
    return this.clienteprisma.$transaction(async (transaccion) => {
      const sincronizacionbloqueada = await transaccion.$queryRaw<
        Array<{ status: SieSyncStatus }>
      >`SELECT "status" FROM "sie_synchronizations" WHERE "id" = ${idsincronizacion} FOR UPDATE`;
      const estadoactual = sincronizacionbloqueada[0]?.status;
      const estadosreclamables = new Set<SieSyncStatus>([
        SieSyncStatus.PENDING,
        SieSyncStatus.QUEUED,
        SieSyncStatus.PROCESSING,
      ]);
      if (!estadoactual || !estadosreclamables.has(estadoactual)) {
        return { tipo: 'nodisponible' };
      }

      const ahora = new Date();
      const token = randomUUID();
      const transicion = await transaccion.sieSynchronizationItem.updateMany({
        where: {
          id: idelemento,
          synchronizationId: idsincronizacion,
          OR: [
            { status: { in: [SieSyncStatus.PENDING, SieSyncStatus.QUEUED] } },
            {
              status: SieSyncStatus.PROCESSING,
              OR: [
                { processingLeaseUntil: { lte: ahora } },
                {
                  processingLeaseUntil: null,
                  updatedAt: { lte: new Date(ahora.getTime() - duracionarrendamientosie) },
                },
              ],
            },
          ],
        },
        data: {
          status: SieSyncStatus.PROCESSING,
          processingToken: token,
          processingLeaseUntil: new Date(ahora.getTime() + duracionarrendamientosie),
        },
      });
      if (transicion.count > 0) return { tipo: 'reclamado', token };

      const elemento = await transaccion.sieSynchronizationItem.findUnique({
        where: { id: idelemento },
        select: { status: true, processingLeaseUntil: true, updatedAt: true },
      });
      if (elemento?.status !== SieSyncStatus.PROCESSING) return { tipo: 'nodisponible' };
      const vencimiento =
        elemento.processingLeaseUntil ??
        new Date(elemento.updatedAt.getTime() + duracionarrendamientosie);
      return {
        tipo: 'ocupado',
        esperarmilisegundos: Math.max(250, vencimiento.getTime() - ahora.getTime()),
      };
    });
  }

  async renovarreclamoelemento(
    idsincronizacion: string,
    idelemento: string,
    token: string,
  ): Promise<boolean> {
    const actualizacion = await this.clienteprisma.sieSynchronizationItem.updateMany({
      where: {
        id: idelemento,
        synchronizationId: idsincronizacion,
        status: SieSyncStatus.PROCESSING,
        processingToken: token,
      },
      data: { processingLeaseUntil: new Date(Date.now() + duracionarrendamientosie) },
    });
    return actualizacion.count === 1;
  }

  async buscarelemento(idelemento: string): Promise<elementosincronizacionsiealmacenado | null> {
    const elemento = await this.clienteprisma.sieSynchronizationItem.findUnique({
      where: { id: idelemento },
    });
    if (!elemento) return null;
    return {
      estado: elemento.status as estadosincronizacionsie,
      valorlocal: elemento.localValue,
      valorsie: elemento.sieValue,
      mensajeerror: elemento.errorMessage,
      verificadoen: elemento.verifiedAt,
    };
  }

  async marcarinicioyprocesamiento(idsincronizacion: string, fechainicio: Date): Promise<void> {
    await this.clienteprisma.sieSynchronization.updateMany({
      where: { id: idsincronizacion, startedAt: null },
      data: { startedAt: fechainicio },
    });
    await this.clienteprisma.sieSynchronization.updateMany({
      where: {
        id: idsincronizacion,
        status: { in: [SieSyncStatus.PENDING, SieSyncStatus.QUEUED] },
      },
      data: { status: SieSyncStatus.PROCESSING },
    });
  }

  async devolverelementoalacola(
    idelemento: string,
    token: string,
    mensajeerror: string,
  ): Promise<void> {
    await this.clienteprisma.sieSynchronizationItem.updateMany({
      where: {
        id: idelemento,
        status: SieSyncStatus.PROCESSING,
        processingToken: token,
      },
      data: {
        status: SieSyncStatus.QUEUED,
        processingToken: null,
        processingLeaseUntil: null,
        errorMessage: mensajeerror,
        retryCount: { increment: 1 },
      },
    });
  }

  async guardarresultado(entrada: guardarresultadosincronizacionsie): Promise<boolean> {
    const {
      datostrabajo,
      tokenreclamo,
      resultado,
      falloreintentable,
      umbralpausadiscrepancias,
      plazorevisiondiscrepanciashoras,
    } = entrada;
    const estadopersistido =
      resultado.status === estadosincronizacionsie.VERIFIED
        ? SieSyncStatus.VERIFIED
        : resultado.status === estadosincronizacionsie.DISCREPANCY
          ? SieSyncStatus.DISCREPANCY
          : resultado.status === estadosincronizacionsie.AUTH_REQUIRED
            ? SieSyncStatus.AUTH_REQUIRED
            : SieSyncStatus.FAILED;

    return this.clienteprisma.$transaction(async (transaccion) => {
      await transaccion.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "sie_synchronizations" WHERE "id" = ${datostrabajo.synchronizationId} FOR UPDATE
      `;
      const estadoanterior = await transaccion.sieSynchronization.findUnique({
        where: { id: datostrabajo.synchronizationId },
        select: { status: true },
      });
      if (!estadoanterior) throw new Error('La sincronización dejó de existir');

      const transicionelemento = await transaccion.sieSynchronizationItem.updateMany({
        where: {
          id: datostrabajo.itemId,
          synchronizationId: datostrabajo.synchronizationId,
          status: SieSyncStatus.PROCESSING,
          processingToken: tokenreclamo,
        },
        data: {
          localValue: resultado.localValue,
          sieValue: resultado.sieValue,
          status: estadopersistido,
          processingToken: null,
          processingLeaseUntil: null,
          errorMessage: resultado.errorMessage || null,
          verifiedAt: resultado.verifiedAt ? new Date(resultado.verifiedAt) : null,
          ...(falloreintentable ? { retryCount: { increment: 1 } } : {}),
        },
      });
      if (transicionelemento.count === 0) return false;

      const requiereAutenticacion = estadopersistido === SieSyncStatus.AUTH_REQUIRED;
      const sincronizacion = await transaccion.sieSynchronization.update({
        where: { id: datostrabajo.synchronizationId },
        data: requiereAutenticacion
          ? {
              status: SieSyncStatus.PAUSED,
              pausedAt: new Date(),
              pausedReason: 'El adaptador requiere revisar la autenticación antes de continuar.',
            }
          : {
              processedItems: { increment: 1 },
              discrepancyCount:
                estadopersistido === SieSyncStatus.DISCREPANCY ? { increment: 1 } : undefined,
              errorCount: estadopersistido === SieSyncStatus.FAILED ? { increment: 1 } : undefined,
            },
      });

      let pausadapordiscrepancias = false;
      if (requiereAutenticacion) {
        await transaccion.auditLog.create({
          data: {
            userId: sincronizacion.requestedById,
            action: 'SYNC_SIE',
            entity: 'SieSynchronization',
            entityId: datostrabajo.synchronizationId,
            correlationId: datostrabajo.correlationId ?? datostrabajo.synchronizationId,
            studentIds: [],
            newValue: {
              event: 'BATCH_PAUSED_FOR_AUTHENTICATION',
              status: estadosincronizacionsie.AUTH_REQUIRED,
              source: resultado.source,
              itemId: datostrabajo.itemId,
            },
            reason: 'El adaptador solicitó revisar la autenticación; el lote quedó detenido.',
            userAgent: 'SieWorker/1.0',
          },
        });
      }

      if (
        !requiereAutenticacion &&
        estadoanterior.status !== SieSyncStatus.PAUSED &&
        estadopersistido === SieSyncStatus.DISCREPANCY &&
        sincronizacion.totalItems > sincronizacion.processedItems &&
        sincronizacion.discrepancyCount / sincronizacion.totalItems > umbralpausadiscrepancias
      ) {
        pausadapordiscrepancias = true;
        await transaccion.sieSynchronization.update({
          where: { id: datostrabajo.synchronizationId },
          data: {
            status: SieSyncStatus.PAUSED,
            pausedAt: new Date(),
            pausedReason: `La proporción de discrepancias superó el umbral operativo de ${umbralpausadiscrepancias}.`,
          },
        });
      } else if (
        !requiereAutenticacion &&
        estadoanterior.status !== SieSyncStatus.PAUSED &&
        sincronizacion.processedItems >= sincronizacion.totalItems
      ) {
        await transaccion.sieSynchronization.update({
          where: { id: datostrabajo.synchronizationId },
          data: {
            status:
              sincronizacion.errorCount > 0
                ? SieSyncStatus.FAILED
                : sincronizacion.discrepancyCount > 0
                  ? SieSyncStatus.DISCREPANCY
                  : SieSyncStatus.VERIFIED,
            completedAt: new Date(),
          },
        });
      }

      const elementosincronizacion = await transaccion.sieSynchronizationItem.findUnique({
        where: { id: datostrabajo.itemId },
        select: { studentId: true, subjectId: true, periodId: true },
      });
      if (estadopersistido === SieSyncStatus.DISCREPANCY && elementosincronizacion) {
        const calificacion = await transaccion.grade.findFirst({
          where: {
            studentId: elementosincronizacion.studentId,
            subjectId: elementosincronizacion.subjectId,
            periodId: elementosincronizacion.periodId,
          },
          select: { enrollment: { select: { courseId: true } } },
        });
        if (!calificacion) throw new Error('No se encontró el curso para agrupar la discrepancia');
        const fechalimite = new Date(Date.now() + plazorevisiondiscrepanciashoras * 60 * 60 * 1000);
        const grupo = await transaccion.sieDiscrepancyGroup.upsert({
          where: {
            synchronizationId_courseId_subjectId_periodId: {
              synchronizationId: datostrabajo.synchronizationId,
              courseId: calificacion.enrollment.courseId,
              subjectId: elementosincronizacion.subjectId,
              periodId: elementosincronizacion.periodId,
            },
          },
          create: {
            synchronizationId: datostrabajo.synchronizationId,
            courseId: calificacion.enrollment.courseId,
            subjectId: elementosincronizacion.subjectId,
            periodId: elementosincronizacion.periodId,
            assignedToId: sincronizacion.requestedById,
            dueAt: fechalimite,
          },
          update: {},
          select: { id: true },
        });
        await transaccion.sieSynchronizationItem.update({
          where: { id: datostrabajo.itemId },
          data: { discrepancyGroupId: grupo.id },
        });
      }
      await transaccion.auditLog.create({
        data: {
          userId: sincronizacion.requestedById,
          action: 'SYNC_SIE',
          entity: 'SieSynchronization',
          entityId: datostrabajo.synchronizationId,
          correlationId: datostrabajo.correlationId ?? datostrabajo.synchronizationId,
          studentIds: elementosincronizacion ? [elementosincronizacion.studentId] : [],
          newValue: {
            source: resultado.source,
            itemId: datostrabajo.itemId,
            studentRude: datostrabajo.studentRude,
            localValue: resultado.localValue,
            sieValue: resultado.sieValue,
            status: resultado.status,
            verified: resultado.isMatched,
            errorMessage: resultado.errorMessage || null,
          },
          userAgent: 'SieLocalSimulationWorker/1.0',
        },
      });
      if (pausadapordiscrepancias) {
        await transaccion.auditLog.create({
          data: {
            userId: sincronizacion.requestedById,
            action: 'SYNC_SIE',
            entity: 'SieSynchronization',
            entityId: datostrabajo.synchronizationId,
            correlationId: datostrabajo.correlationId ?? datostrabajo.synchronizationId,
            newValue: {
              event: 'BATCH_PAUSED_FOR_DISCREPANCIES',
              status: estadosincronizacionsie.PAUSED,
              source: resultado.source,
              discrepancyCount: sincronizacion.discrepancyCount,
              totalItems: sincronizacion.totalItems,
              threshold: umbralpausadiscrepancias,
            },
            reason: 'La proporción de discrepancias superó el umbral antes de completar el lote.',
            userAgent: 'SieLocalSimulationWorker/1.0',
          },
        });
      }
      return true;
    });
  }
}
