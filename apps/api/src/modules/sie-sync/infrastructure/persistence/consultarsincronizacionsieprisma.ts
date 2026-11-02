import { SieSyncStatus as PrismaSieSyncStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import type { valorestadosincronizacionsie } from '../../application/ports/repositoriosincronizacionsie';
import type { servicioprisma } from '../../../../common/database/prisma.service';
import type {
  filtroslistadosincronizacionsie,
  origenresultadosie,
  sincronizacionsieconelementos,
} from '../../application/ports/repositoriosincronizacionsie';

const estadossincronizacionprisma: Record<valorestadosincronizacionsie, PrismaSieSyncStatus> = {
  PENDING: PrismaSieSyncStatus.PENDING,
  QUEUED: PrismaSieSyncStatus.QUEUED,
  PROCESSING: PrismaSieSyncStatus.PROCESSING,
  PAUSED: PrismaSieSyncStatus.PAUSED,
  VERIFIED: PrismaSieSyncStatus.VERIFIED,
  DISCREPANCY: PrismaSieSyncStatus.DISCREPANCY,
  AUTH_REQUIRED: PrismaSieSyncStatus.AUTH_REQUIRED,
  FAILED: PrismaSieSyncStatus.FAILED,
  CANCELLED: PrismaSieSyncStatus.CANCELLED,
};

export const sincronizacionitemrelacionesinclude = {
  student: { select: { rude: true, firstName: true, lastName: true } },
  subject: { select: { code: true, name: true } },
  period: { select: { name: true, number: true } },
  discrepancyResolvedBy: { select: { id: true, firstName: true, lastName: true } },
  discrepancyGroup: {
    select: {
      id: true,
      status: true,
      dueAt: true,
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
    },
  },
} satisfies Prisma.SieSynchronizationItemInclude;

const sincronizacionconitemsinclude = {
  items: { include: sincronizacionitemrelacionesinclude },
} satisfies Prisma.SieSynchronizationInclude;

const limiteeventosportimeline = 100;
const maximoidentidadesporcurso = 1000;

export class consultarsincronizacionsieprisma {
  constructor(private readonly prisma: servicioprisma) {}

  async buscarporidentificador(id: string): Promise<sincronizacionsieconelementos | null> {
    const sincronizacion = await this.prisma.sieSynchronization.findUnique({
      where: { id },
      include: sincronizacionconitemsinclude,
    });
    if (!sincronizacion) return null;
    const [conorigen] = await this.anotarfuentes([sincronizacion]);
    const [concurso] = await this.anotarcursos([conorigen]);
    return concurso;
  }

  async buscartodos(
    limite: number,
    desplazamiento: number,
    filtros: filtroslistadosincronizacionsie = {},
  ): Promise<{ items: sincronizacionsieconelementos[]; total: number }> {
    const condicionesfiltroelemento: Prisma.SieSynchronizationItemWhereInput[] = [];
    if (filtros.periodNumber !== undefined || filtros.academicYear !== undefined) {
      condicionesfiltroelemento.push({
        period: {
          ...(filtros.periodNumber !== undefined ? { number: filtros.periodNumber } : {}),
          ...(filtros.academicYear !== undefined
            ? { academicYear: { year: filtros.academicYear } }
            : {}),
        },
      });
    }
    if (filtros.studentRude) {
      condicionesfiltroelemento.push({
        student: {
          rude: { contains: filtros.studentRude.trim(), mode: 'insensitive' },
        },
      });
    }
    if (filtros.courseName) {
      const calificacionesdelcurso = await this.prisma.grade.findMany({
        where: {
          ...(filtros.studentRude
            ? {
                student: {
                  rude: { contains: filtros.studentRude.trim(), mode: 'insensitive' },
                },
              }
            : {}),
          period: {
            ...(filtros.periodNumber !== undefined ? { number: filtros.periodNumber } : {}),
            ...(filtros.academicYear !== undefined
              ? { academicYear: { year: filtros.academicYear } }
              : {}),
          },
          enrollment: {
            course: {
              name: { contains: filtros.courseName.trim(), mode: 'insensitive' },
            },
            ...(filtros.academicYear !== undefined
              ? { academicYear: { year: filtros.academicYear } }
              : {}),
          },
        },
        select: {
          studentId: true,
          subjectId: true,
          periodId: true,
          enrollment: { select: { academicYear: { select: { year: true } } } },
          period: { select: { academicYear: { select: { year: true } } } },
        },
        take: maximoidentidadesporcurso + 1,
      });
      if (calificacionesdelcurso.length > maximoidentidadesporcurso) {
        throw new BadRequestException(
          'Acote el filtro por curso usando la gestión y el período para evitar demasiados resultados.',
        );
      }
      const identidadescalificaciones = calificacionesdelcurso
        .filter(
          (calificacion) =>
            calificacion.enrollment.academicYear.year === calificacion.period.academicYear.year,
        )
        .map(({ studentId, subjectId, periodId }) => ({ studentId, subjectId, periodId }));
      if (identidadescalificaciones.length === 0) return { items: [], total: 0 };
      condicionesfiltroelemento.push({ OR: identidadescalificaciones });
    }
    const elementofiltro: Prisma.SieSynchronizationItemWhereInput =
      condicionesfiltroelemento.length === 0
        ? {}
        : condicionesfiltroelemento.length === 1
          ? condicionesfiltroelemento[0]
          : { AND: condicionesfiltroelemento };
    const filtro: Prisma.SieSynchronizationWhereInput = {
      ...(filtros.status ? { status: estadossincronizacionprisma[filtros.status] } : {}),
      ...(condicionesfiltroelemento.length > 0 ? { items: { some: elementofiltro } } : {}),
    };
    const [elementos, cantidadtotal] = await Promise.all([
      this.prisma.sieSynchronization.findMany({
        where: filtro,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: desplazamiento,
        take: limite,
        include: sincronizacionconitemsinclude,
      }),
      this.prisma.sieSynchronization.count({ where: filtro }),
    ]);
    const confuentes = await this.anotarfuentes(elementos);
    return { items: await this.anotarcursos(confuentes), total: cantidadtotal };
  }

  private async anotarfuentes(
    sincronizaciones: sincronizacionsieconelementos[],
  ): Promise<sincronizacionsieconelementos[]> {
    if (sincronizaciones.length === 0) return [];
    const idsdesincronizacionporelemento = new Map(
      sincronizaciones.flatMap((sincronizacion) =>
        sincronizacion.items.map((elemento) => [elemento.id, sincronizacion.id] as const),
      ),
    );
    const registrosporlote = await Promise.all(
      sincronizaciones.map(async (sincronizacion) => {
        const idsdeelementosdelote = sincronizacion.items.map((elemento) => elemento.id);
        const registros = await this.prisma.auditLog.findMany({
          where: {
            OR: [
              {
                action: 'SYNC_SIE',
                entity: 'SieSynchronization',
                entityId: sincronizacion.id,
              },
              { entity: 'SieSynchronizationItem', entityId: { in: idsdeelementosdelote } },
            ],
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: limiteeventosportimeline + 1,
          select: {
            entity: true,
            entityId: true,
            newValue: true,
            correlationId: true,
            userId: true,
            createdAt: true,
          },
        });
        return {
          synchronizationId: sincronizacion.id,
          timelineHasMore: registros.length > limiteeventosportimeline,
          registros: registros.slice(0, limiteeventosportimeline),
        };
      }),
    );
    const sincronizacionesconhistorialrecortado = new Set(
      registrosporlote
        .filter((registro) => registro.timelineHasMore)
        .map((registro) => registro.synchronizationId),
    );
    const registrosauditoria = registrosporlote.flatMap((registro) => registro.registros);
    const fuentesporelemento = new Map<string, origenresultadosie>();
    const fuentesporsincronizacion = new Map<string, origenresultadosie>();
    const historialporsincronizacion = new Map<
      string,
      NonNullable<sincronizacionsieconelementos['timeline']>
    >();
    for (const registro of registrosauditoria) {
      const valor = registro.newValue;
      if (!valor || typeof valor !== 'object' || Array.isArray(valor)) continue;
      const iddesincronizacion =
        registro.entity === 'SieSynchronization'
          ? registro.entityId
          : idsdesincronizacionporelemento.get(registro.entityId);
      if (!iddesincronizacion) continue;
      const idelemento = valor.itemId;
      const origen = valor.source;
      if (
        registro.entity === 'SieSynchronization' &&
        (origen === 'LOCAL_SIE_SIMULATION' || origen === 'SIE_REAL') &&
        !fuentesporsincronizacion.has(iddesincronizacion)
      ) {
        fuentesporsincronizacion.set(iddesincronizacion, origen);
      }
      if (
        typeof idelemento === 'string' &&
        (origen === 'LOCAL_SIE_SIMULATION' || origen === 'SIE_REAL') &&
        !fuentesporelemento.has(idelemento)
      ) {
        fuentesporelemento.set(idelemento, origen);
      }
      const nombredelevento =
        typeof valor.event === 'string'
          ? valor.event
          : typeof valor.status === 'string'
            ? `STATUS_${valor.status}`
            : 'AUDIT_UPDATE';
      const eventos = historialporsincronizacion.get(iddesincronizacion) ?? [];
      eventos.push({
        event: nombredelevento,
        status: typeof valor.status === 'string' ? valor.status : null,
        itemId: typeof idelemento === 'string' ? idelemento : null,
        correlationId: registro.correlationId,
        actorId: registro.userId,
        createdAt: registro.createdAt,
      });
      historialporsincronizacion.set(iddesincronizacion, eventos);
    }
    return sincronizaciones.map((sincronizacion) => {
      const elementos = sincronizacion.items.map((elemento) => ({
        ...elemento,
        source:
          fuentesporelemento.get(elemento.id) ??
          fuentesporsincronizacion.get(sincronizacion.id) ??
          null,
      }));
      const primerorigen = elementos[0]?.source;
      const origen =
        primerorigen && elementos.every((elemento) => elemento.source === primerorigen)
          ? primerorigen
          : null;
      const historial = (historialporsincronizacion.get(sincronizacion.id) ?? []).sort(
        (eventoanterior, eventoposterior) =>
          eventoanterior.createdAt.getTime() - eventoposterior.createdAt.getTime(),
      );
      return {
        ...sincronizacion,
        items: elementos,
        source: origen,
        timeline: historial,
        timelineHasMore: sincronizacionesconhistorialrecortado.has(sincronizacion.id),
      };
    });
  }

  private async anotarcursos(
    sincronizaciones: sincronizacionsieconelementos[],
  ): Promise<sincronizacionsieconelementos[]> {
    const elementos = sincronizaciones.flatMap((sincronizacion) => sincronizacion.items);
    if (elementos.length === 0) return sincronizaciones;
    const calificaciones = await this.prisma.grade.findMany({
      where: {
        OR: elementos.map((elemento) => ({
          studentId: elemento.studentId,
          subjectId: elemento.subjectId,
          periodId: elemento.periodId,
        })),
      },
      select: {
        studentId: true,
        subjectId: true,
        periodId: true,
        enrollment: { select: { course: { select: { id: true, name: true } } } },
      },
    });
    const cursosporcalificacion = new Map(
      calificaciones.map((calificacion) => [
        this.identidadcalificacion(
          calificacion.studentId,
          calificacion.subjectId,
          calificacion.periodId,
        ),
        calificacion.enrollment.course,
      ]),
    );
    return sincronizaciones.map((sincronizacion) => ({
      ...sincronizacion,
      items: sincronizacion.items.map((elemento) => ({
        ...elemento,
        course:
          cursosporcalificacion.get(
            this.identidadcalificacion(elemento.studentId, elemento.subjectId, elemento.periodId),
          ) ?? null,
      })),
    }));
  }

  private identidadcalificacion(
    idestudiante: string,
    materiaid: string,
    periodoid: string,
  ): string {
    return `${idestudiante}\u0000${materiaid}\u0000${periodoid}`;
  }
}
