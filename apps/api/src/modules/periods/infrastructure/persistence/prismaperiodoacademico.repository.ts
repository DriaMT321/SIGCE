import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  registroperiodoacademico,
  repositorioperiodosacademicos,
  actualizacionperiodoacademico,
  creacionperiodoacademico,
  periodoacademicoconanio,
  contextoauditoriaperiodoacademico,
  vistapreviacierreperiodo,
} from '../../domain/repositories/periodoacademico.repository.interface';

async function bloqueoperiodo(tx: Prisma.TransactionClient, id: string): Promise<void> {
  const periodos = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "academic_periods" WHERE "id" = ${id} FOR UPDATE
  `;
  if (!periodos[0]) throw new NotFoundException('Periodo académico no encontrado');
}

@Injectable()
export class repositorioperiodoacademicoprisma implements repositorioperiodosacademicos {
  constructor(private readonly prisma: servicioprisma) {}

  buscartodos(idanioacademico?: string): Promise<periodoacademicoconanio[]> {
    return this.prisma.academicPeriod.findMany({
      where: idanioacademico ? { academicYearId: idanioacademico } : undefined,
      orderBy: { number: 'asc' },
      include: { academicYear: true },
    });
  }

  buscarporidentificador(id: string): Promise<registroperiodoacademico | null> {
    return this.prisma.academicPeriod.findUnique({ where: { id } });
  }

  async obtenervistapreviacierre(id: string): Promise<vistapreviacierreperiodo | null> {
    const periodo = await this.prisma.academicPeriod.findUnique({
      where: { id },
      select: { id: true, name: true, isClosed: true },
    });
    if (!periodo) return null;
    const [calificacioncantidad, estudiantes] = await Promise.all([
      this.prisma.grade.count({ where: { periodId: id } }),
      this.prisma.grade.groupBy({ by: ['studentId'], where: { periodId: id } }),
    ]);
    return { ...periodo, gradeCount: calificacioncantidad, studentCount: estudiantes.length };
  }

  async crear(
    datos: creacionperiodoacademico,
    auditoria: contextoauditoriaperiodoacademico,
  ): Promise<periodoacademicoconanio> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const gestiones = await tx.$queryRaw<
          Array<{ isClosed: boolean; startDate: Date; endDate: Date }>
        >`
          SELECT "is_closed" AS "isClosed", "start_date" AS "startDate", "end_date" AS "endDate"
          FROM "academic_years"
          WHERE "id" = ${datos.academicYearId}
          FOR UPDATE
        `;
        const gestion = gestiones[0];
        if (!gestion) throw new NotFoundException('Gestión académica no encontrada');
        if (gestion.isClosed) {
          throw new ConflictException('No se pueden crear períodos en una gestión cerrada');
        }
        if (datos.startDate < gestion.startDate || datos.endDate > gestion.endDate) {
          throw new BadRequestException(
            'El período debe estar comprendido dentro de las fechas de la gestión académica',
          );
        }
        if (datos.startDate >= datos.endDate) {
          throw new BadRequestException(
            'La fecha de inicio del período debe ser anterior a la fecha de fin',
          );
        }
        const creado = await tx.academicPeriod.create({
          data: {
            academicYearId: datos.academicYearId,
            name: datos.name,
            number: datos.number,
            startDate: datos.startDate,
            endDate: datos.endDate,
          },
          include: { academicYear: true },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'AcademicPeriod',
            entityId: creado.id,
            newValue: {
              name: creado.name,
              number: creado.number,
              isClosed: creado.isClosed,
              startDate: creado.startDate.toISOString(),
              endDate: creado.endDate.toISOString(),
              academicYearId: creado.academicYearId,
            },
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return creado;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe un período con ese número en la gestión');
      }
      throw error;
    }
  }

  async actualizar(
    id: string,
    cambios: actualizacionperiodoacademico,
    auditoria: contextoauditoriaperiodoacademico,
  ): Promise<periodoacademicoconanio | null> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await bloqueoperiodo(tx, id);
        const anterior = await tx.academicPeriod.findUnique({ where: { id } });
        if (!anterior) return null;

        if (cambios.isClosed === true) {
          const actualcalificacioncantidad = await tx.grade.count({ where: { periodId: id } });
          if (auditoria.expectedGradeCount !== actualcalificacioncantidad) {
            throw new ConflictException(
              'Las calificaciones cambiaron después de mostrar el resumen. Actualice el resumen antes de cerrar el período.',
            );
          }
        }

        const actualizado = await tx.academicPeriod.update({
          where: { id },
          data: cambios,
          include: { academicYear: true },
        });
        const instantanea = (periodo: typeof anterior) => ({
          name: periodo.name,
          number: periodo.number,
          isClosed: periodo.isClosed,
          startDate: periodo.startDate.toISOString(),
          endDate: periodo.endDate.toISOString(),
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'AcademicPeriod',
            entityId: id,
            previousValue: instantanea(anterior),
            newValue: instantanea(actualizado),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return actualizado;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
        return null;
      throw error;
    }
  }
}
