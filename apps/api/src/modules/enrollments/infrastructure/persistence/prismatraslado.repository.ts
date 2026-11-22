import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import {
  repositoriotraslados,
} from '../../domain/repositories/traslado.repository.interface';
import {
  SolicitudTrasladoEstudiantil,
  dtocreartraslado,
  dtoactualizarfasetraslado,
  dtofiltrosstraslados,
  fasetraslado,
  estadotraslado,
  CalificacionSnapshotItem,
} from '@academic/shared-types';
import { politicatraslado } from '../../domain/services/trasladopolitica';

@Injectable()
export class repositoriotrasladoprisma implements repositoriotraslados {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscartodos(filtros: dtofiltrosstraslados): Promise<{ items: SolicitudTrasladoEstudiantil[]; total: number }> {
    const where: any = {};
    if (filtros.studentId) where.studentId = filtros.studentId;
    if (filtros.academicYearId) where.academicYearId = filtros.academicYearId;
    if (filtros.direction) where.direction = filtros.direction;
    if (filtros.transferType) where.transferType = filtros.transferType;
    if (filtros.status) where.status = filtros.status;
    if (filtros.phase) where.phase = filtros.phase;

    if (filtros.search) {
      const q = filtros.search.trim();
      where.OR = [
        { originSchool: { contains: q, mode: 'insensitive' } },
        { destinationSchool: { contains: q, mode: 'insensitive' } },
        { distritalResolution: { contains: q, mode: 'insensitive' } },
        { sieFolioNumber: { contains: q, mode: 'insensitive' } },
        { student: { firstName: { contains: q, mode: 'insensitive' } } },
        { student: { lastName: { contains: q, mode: 'insensitive' } } },
        { student: { rude: { contains: q, mode: 'insensitive' } } },
        { student: { ci: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      (this.prisma as any).studentTransfer.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              rude: true,
              ci: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filtros.limit ?? 50,
        skip: filtros.offset ?? 0,
      }),
      (this.prisma as any).studentTransfer.count({ where }),
    ]);

    return {
      items: items.map((item: any) => this.mapa(item)),
      total,
    };
  }

  async buscarporid(id: string): Promise<SolicitudTrasladoEstudiantil | null> {
    const item = await (this.prisma as any).studentTransfer.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            rude: true,
            ci: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return item ? this.mapa(item) : null;
  }

  async buscarporstudent(studentId: string, academicYearId?: string): Promise<SolicitudTrasladoEstudiantil[]> {
    const where: any = { studentId };
    if (academicYearId) where.academicYearId = academicYearId;
    const items = await (this.prisma as any).studentTransfer.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            rude: true,
            ci: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item: any) => this.mapa(item));
  }

  async crear(datos: dtocreartraslado, auditoria: auditoriacontexto): Promise<SolicitudTrasladoEstudiantil> {
    const estudiante = await this.prisma.student.findUnique({
      where: { id: datos.studentId, deletedAt: null },
    });

    const gestion = await this.prisma.academicYear.findUnique({
      where: { id: datos.academicYearId },
    });

    politicatraslado.afirmarpuedecreartraslado({
      studentActive: Boolean(estudiante?.isActive),
      academicYearOpen: Boolean(gestion && !gestion.isClosed),
      transferType: datos.transferType,
      causal: datos.causal,
      causalDetails: datos.causalDetails,
      originSchool: datos.originSchool,
      destinationSchool: datos.destinationSchool,
      antiCoercionCertified: datos.antiCoercionCertified,
      currentTrimester: datos.currentTrimester ?? 1,
    });

    // Si es un traslado saliente y tiene matrícula, extraer las calificaciones del estudiante para el boletín oficial
    let gradesSnapshot: CalificacionSnapshotItem[] | null = null;
    if (datos.enrollmentId) {
      const grades = await this.prisma.grade.findMany({
        where: { enrollmentId: datos.enrollmentId },
        include: {
          subject: { select: { id: true, name: true } },
          period: { select: { id: true, name: true, order: true } },
        },
      });

      if (grades.length > 0) {
        const porMateria = new Map<string, CalificacionSnapshotItem>();
        for (const g of grades) {
          const subId = g.subjectId;
          const subName = g.subject.name;
          const actual = porMateria.get(subId) || {
            subjectId: subId,
            subjectName: subName,
            firstTrimester: null,
            secondTrimester: null,
            thirdTrimester: null,
            average: null,
          };
          if (g.period?.order === 1) actual.firstTrimester = g.value;
          if (g.period?.order === 2) actual.secondTrimester = g.value;
          if (g.period?.order === 3) actual.thirdTrimester = g.value;
          porMateria.set(subId, actual);
        }
        gradesSnapshot = Array.from(porMateria.values());
      }
    }

    const sieSyncDeadline = politicatraslado.calcularPlazoCincoDiasHabiles(new Date());

    const checklistPredeterminado = {
      formularioTrasladoFirmado: false,
      certificadoNacimiento: false,
      cedulaIdentidadEstudiante: false,
      cedulaIdentidadTutor: false,
      libretaEscolarBoletin: Boolean(gradesSnapshot && gradesSnapshot.length > 0),
      formularioRudeTransferencia: false,
      carnetVacunas: false,
      respaldoJustificativo: Boolean(datos.causalDetails && datos.causalDetails.length > 0),
      ...datos.documentsChecklist,
    };

    const creado = await (this.prisma as any).studentTransfer.create({
      data: {
        studentId: datos.studentId,
        enrollmentId: datos.enrollmentId || null,
        academicYearId: datos.academicYearId,
        direction: datos.direction,
        transferType: datos.transferType,
        causal: datos.causal,
        causalDetails: datos.causalDetails || null,
        originSchool: datos.originSchool,
        originSieCode: datos.originSieCode || null,
        destinationSchool: datos.destinationSchool,
        destinationSieCode: datos.destinationSieCode || null,
        destinationDistrict: datos.destinationDistrict || null,
        destinationDepartment: datos.destinationDepartment || null,
        targetGradeCourse: datos.targetGradeCourse || null,
        currentTrimester: datos.currentTrimester ?? 1,
        gradesSnapshot: gradesSnapshot ? (gradesSnapshot as any) : undefined,
        phase: fasetraslado.SOLICITAR_RETIRO,
        status: estadotraslado.EN_TRAMITE,
        sieSyncDeadline,
        documentsChecklist: checklistPredeterminado as any,
        antiCoercionCertified: datos.antiCoercionCertified,
        solicitanteNombre: datos.solicitanteNombre || null,
        solicitanteCi: datos.solicitanteCi || null,
        solicitanteParentesco: datos.solicitanteParentesco || null,
        solicitanteTelefono: datos.solicitanteTelefono || null,
        observations: datos.observations || null,
        createdByUserId: auditoria.userId || null,
      },
      include: {
        student: {
          select: {
            id: true,
            rude: true,
            ci: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Auditoría
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: AuditAction.CREATE,
          entity: 'StudentTransfer',
          entityId: creado.id,
          studentIds: [creado.studentId],
          newValue: {
            id: creado.id,
            direction: creado.direction,
            transferType: creado.transferType,
            causal: creado.causal,
            originSchool: creado.originSchool,
            destinationSchool: creado.destinationSchool,
          },
          ipAddress: auditoria.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });
    } catch {
      // no-op audit fail-safe
    }

    return this.mapa(creado);
  }

  async actualizarfase(id: string, datos: dtoactualizarfasetraslado, auditoria: auditoriacontexto): Promise<SolicitudTrasladoEstudiantil> {
    const actual = await (this.prisma as any).studentTransfer.findUnique({
      where: { id },
    });
    if (!actual) {
      throw new NotFoundException(`Trámite de traslado no encontrado: ${id}`);
    }

    politicatraslado.afirmarpuedeavanzarfase(actual.phase, datos.phase, {
      distritalResolution: datos.distritalResolution || actual.distritalResolution,
    });

    const updateData: any = {
      phase: datos.phase,
      updatedAt: new Date(),
    };

    if (datos.status) updateData.status = datos.status;
    if (datos.distritalResolution !== undefined) updateData.distritalResolution = datos.distritalResolution;
    if (datos.distritalApprovalDate !== undefined) {
      const fechaDistrito = new Date(datos.distritalApprovalDate);
      updateData.distritalApprovalDate = fechaDistrito;
      // Recalcular el plazo de 5 días hábiles a partir de la fecha de aprobación distrital
      updateData.sieSyncDeadline = politicatraslado.calcularPlazoCincoDiasHabiles(fechaDistrito);
    }
    if (datos.sieFolioNumber !== undefined) updateData.sieFolioNumber = datos.sieFolioNumber;
    if (datos.observations !== undefined) updateData.observations = datos.observations;

    if (datos.documentsChecklist) {
      const checklistActual = actual.documentsChecklist || {};
      updateData.documentsChecklist = { ...checklistActual, ...datos.documentsChecklist };
    }

    if (datos.phase === fasetraslado.COMPLETADO || datos.sieSyncCompleted) {
      updateData.phase = fasetraslado.COMPLETADO;
      updateData.status = estadotraslado.REGISTRADO_SIE;
      updateData.sieSyncCompletedAt = new Date();

      // Si existe una matrícula vinculada y es un traslado saliente, cambiar el estado de la matrícula a TRANSFERRED
      if (actual.enrollmentId && actual.direction === 'SALIENTE') {
        try {
          await this.prisma.enrollment.update({
            where: { id: actual.enrollmentId },
            data: {
              status: 'TRANSFERRED',
              remarks: `Trasladado a ${actual.destinationSchool}. Res. Distrital: ${actual.distritalResolution || 'N/A'}. SIE Folio: ${datos.sieFolioNumber || actual.sieFolioNumber || 'N/A'}.`,
            },
          });
        } catch {
          // ignore if enrollment status already changed
        }
      }
    }

    const actualizado = await (this.prisma as any).studentTransfer.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            rude: true,
            ci: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    try {
      await this.prisma.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: AuditAction.UPDATE,
          entity: 'StudentTransfer',
          entityId: actualizado.id,
          studentIds: [actualizado.studentId],
          oldValue: { phase: actual.phase, status: actual.status },
          newValue: { phase: actualizado.phase, status: actualizado.status },
          ipAddress: auditoria.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });
    } catch {
      // no-op audit
    }

    return this.mapa(actualizado);
  }

  private mapa(raw: any): SolicitudTrasladoEstudiantil {
    return {
      id: raw.id,
      enrollmentId: raw.enrollmentId,
      studentId: raw.studentId,
      academicYearId: raw.academicYearId,
      direction: raw.direction,
      transferType: raw.transferType,
      causal: raw.causal,
      causalDetails: raw.causalDetails,
      originSchool: raw.originSchool,
      originSieCode: raw.originSieCode,
      destinationSchool: raw.destinationSchool,
      destinationSieCode: raw.destinationSieCode,
      destinationDistrict: raw.destinationDistrict,
      destinationDepartment: raw.destinationDepartment,
      targetGradeCourse: raw.targetGradeCourse,
      currentTrimester: raw.currentTrimester,
      gradesSnapshot: raw.gradesSnapshot,
      phase: raw.phase,
      status: raw.status,
      distritalResolution: raw.distritalResolution,
      distritalApprovalDate: raw.distritalApprovalDate,
      sieSyncDeadline: raw.sieSyncDeadline,
      sieSyncCompletedAt: raw.sieSyncCompletedAt,
      sieFolioNumber: raw.sieFolioNumber,
      documentsChecklist: raw.documentsChecklist,
      antiCoercionCertified: raw.antiCoercionCertified,
      solicitanteNombre: raw.solicitanteNombre,
      solicitanteCi: raw.solicitanteCi,
      solicitanteParentesco: raw.solicitanteParentesco,
      solicitanteTelefono: raw.solicitanteTelefono,
      observations: raw.observations,
      createdByUserId: raw.createdByUserId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      student: raw.student,
    };
  }
}
