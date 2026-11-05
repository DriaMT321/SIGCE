import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Optional,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  dtocrearasistencia,
  dtoactualizarasistencia,
  dtoregistroasistenciaclase,
  dtosolicitarjustificacion,
  dtoresolverjustificacion,
} from '../dto/asistencia.dto';
import { dtofiltrosasistencia } from '../dto/filtrosasistencia.dto';
import {
  casousocrearasistencia,
  casousolistarasistencias,
  casousoactualizarasistencia,
} from '../../application/use-cases/asistencia.use-cases';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { AlertSeverity, AttendanceStatus, Prisma } from '@prisma/client';

@Controller('attendance')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class AttendanceController {
  constructor(
    private readonly listarattendance: casousolistarasistencias,
    private readonly crearattendance: casousocrearasistencia,
    private readonly actualizarattendance: casousoactualizarasistencia,
    @Optional() private readonly prisma?: servicioprisma,
  ) {}

  private get prismaClient(): servicioprisma {
    if (!this.prisma) {
      throw new NotFoundException('Servicio de base de datos no disponible');
    }
    return this.prisma;
  }

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('attendance:read')
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query() filtros: dtofiltrosasistencia,
  ) {
    const resultado = await this.listarattendance.ejecutar({
      studentId: filtros.studentId,
      courseId: filtros.courseId,
      from: filtros.from ? new Date(filtros.from) : undefined,
      to: filtros.to ? new Date(filtros.to) : undefined,
      parentUserId: [rolusuario.PARENT, rolusuario.STUDENT].includes(usuario.role)
        ? usuario.id
        : undefined,
      teacherUserId: usuario.role === rolusuario.TEACHER ? usuario.id : undefined,
      limit: Math.min(filtros.limit ?? 100, 200),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Asistencia obtenida exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Get('justifications')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  async listarJustificaciones(@usuarioactual() usuario: usuarioautenticado) {
    const where: Prisma.AttendanceWhereInput = {
      OR: [
        { status: AttendanceStatus.ABSENT },
        { status: AttendanceStatus.JUSTIFIED },
        { justification: { not: null } },
      ],
    };

    if (usuario.role === rolusuario.PARENT) {
      where.student = {
        studentParents: {
          some: { parent: { userId: usuario.id } },
        },
      };
    } else if (usuario.role === rolusuario.STUDENT) {
      where.student = { userId: usuario.id };
    }

    const registros = await this.prismaClient.attendance.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 200,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, rude: true, ci: true },
        },
        course: {
          select: { id: true, name: true },
        },
      },
    });

    const resultado = registros.map((reg) => {
      let subjectName = 'Clase regular';
      let parentReason: string | null = null;
      let attachmentName = null;
      let attachmentUrl = null;
      let justificationStatus =
        reg.status === AttendanceStatus.JUSTIFIED ? 'APPROVED' : 'PENDING_SUBMISSION';
      let reviewNotes = null;
      let reviewedBy = null;
      let reviewedAt = null;

      if (reg.justification) {
        try {
          const parsed = JSON.parse(reg.justification);
          if (parsed && typeof parsed === 'object') {
            subjectName = parsed.subjectName || subjectName;
            parentReason = parsed.parentReason || parsed.reason || null;
            attachmentName = parsed.attachmentName || null;
            attachmentUrl = parsed.attachmentUrl || null;
            justificationStatus =
              parsed.justificationStatus ||
              (reg.status === AttendanceStatus.JUSTIFIED ? 'APPROVED' : 'PENDING_SUBMISSION');
            reviewNotes = parsed.reviewNotes || null;
            reviewedBy = parsed.reviewedBy || null;
            reviewedAt = parsed.reviewedAt || null;
          }
        } catch {
          parentReason = reg.justification;
        }
      }

      return {
        id: reg.id,
        studentId: reg.studentId,
        studentName: `${reg.student.firstName} ${reg.student.lastName}`,
        studentRude: reg.student.rude,
        studentCi: reg.student.ci,
        courseId: reg.courseId,
        courseName: reg.course.name,
        date: reg.date.toISOString().split('T')[0],
        status: reg.status,
        subjectName,
        parentReason,
        attachmentName,
        attachmentUrl,
        justificationStatus,
        reviewNotes,
        reviewedBy,
        reviewedAt,
      };
    });

    return {
      statusCode: 200,
      message: 'Justificaciones obtenidas exitosamente',
      data: resultado,
      total: resultado.length,
    };
  }

  @Post('class')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async registrarAsistenciaClase(
    @Body() dto: dtoregistroasistenciaclase,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const fecha = new Date(dto.date + 'T00:00:00.000Z');
    const curso = await this.prismaClient.course.findUnique({
      where: { id: dto.courseId },
      select: { id: true, name: true },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const ausenciasIds: string[] = [];

    for (const item of dto.attendances) {
      let justifTexto: string | null = item.justification || null;
      if (item.status === AttendanceStatus.ABSENT || item.status === AttendanceStatus.JUSTIFIED) {
        justifTexto = JSON.stringify({
          subjectName: dto.subjectName || 'Clase regular',
          subjectId: dto.subjectId || null,
          parentReason: item.justification || null,
          justificationStatus:
            item.status === AttendanceStatus.JUSTIFIED ? 'APPROVED' : 'PENDING_SUBMISSION',
          registeredAt: new Date().toISOString(),
        });
      }

      await this.prismaClient.attendance.upsert({
        where: {
          studentId_courseId_date: {
            studentId: item.studentId,
            courseId: dto.courseId,
            date: fecha,
          },
        },
        create: {
          studentId: item.studentId,
          courseId: dto.courseId,
          date: fecha,
          status: item.status as unknown as AttendanceStatus,
          justification: justifTexto,
          registeredById: usuario.id,
        },
        update: {
          status: item.status as unknown as AttendanceStatus,
          justification: justifTexto,
          registeredById: usuario.id,
        },
      });

      if (item.status === AttendanceStatus.ABSENT) {
        ausenciasIds.push(item.studentId);
      }
    }

    // Notificar a los padres de familia sobre las ausencias
    if (ausenciasIds.length > 0) {
      const estudiantes = await this.prismaClient.student.findMany({
        where: { id: { in: ausenciasIds } },
        include: {
          studentParents: {
            include: { parent: true },
          },
        },
      });

      for (const est of estudiantes) {
        for (const sp of est.studentParents) {
          if (sp.parent?.userId) {
            await this.prismaClient.alert.create({
              data: {
                userId: sp.parent.userId,
                studentId: est.id,
                title: `Inasistencia Registrada: ${est.firstName} ${est.lastName}`,
                message: `Se registró la falta de su hijo(a) en la materia ${dto.subjectName || 'de clase'} el día ${dto.date}. Ingrese a la plataforma para enviar la justificación o anexo correspondiente (captura o PDF).`,
                severity: AlertSeverity.WARNING,
                metadata: {
                  type: 'ATTENDANCE_ABSENCE',
                  studentId: est.id,
                  studentName: `${est.firstName} ${est.lastName}`,
                  courseId: dto.courseId,
                  courseName: curso.name,
                  subjectName: dto.subjectName || 'Clase regular',
                  date: dto.date,
                  justificationStatus: 'PENDING_SUBMISSION',
                },
              },
            });
          }
        }
      }
    }

    return {
      statusCode: 201,
      message: 'Asistencia de clase registrada exitosamente',
      data: {
        totalRegistrados: dto.attendances.length,
        totalAusencias: ausenciasIds.length,
      },
    };
  }

  @Post(':id/justify')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  async enviarJustificacion(
    @Param('id') id: string,
    @Body() dto: dtosolicitarjustificacion,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const asistencia = await this.prismaClient.attendance.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        course: { select: { id: true, name: true } },
      },
    });
    if (!asistencia) throw new NotFoundException('Registro de asistencia no encontrado');

    let datosPrevios: Record<string, unknown> = {};
    if (asistencia.justification) {
      try {
        datosPrevios = JSON.parse(asistencia.justification);
      } catch {
        datosPrevios = { previousText: asistencia.justification };
      }
    }

    const fechaFormateada = asistencia.date.toISOString().split('T')[0];
    const materiaNombre =
      dto.subjectName || (datosPrevios.subjectName as string) || 'Clase regular';

    const nuevaJustificacion = JSON.stringify({
      ...datosPrevios,
      subjectName: materiaNombre,
      parentReason: dto.reason,
      attachmentName: dto.attachmentName || null,
      attachmentUrl: dto.attachmentUrl || null,
      justificationStatus: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      submittedById: usuario.id,
    });

    await this.prismaClient.attendance.update({
      where: { id },
      data: { justification: nuevaJustificacion },
    });

    // Notificar a la Dirección / Secretaría
    const personalAdministrativo = await this.prismaClient.user.findMany({
      where: {
        role: { in: ['ADMINISTRATIVE', 'SECRETARY'] },
        isActive: true,
      },
      select: { id: true },
    });

    for (const admin of personalAdministrativo) {
      await this.prismaClient.alert.create({
        data: {
          userId: admin.id,
          studentId: asistencia.studentId,
          title: `Nueva Justificación Recibida: ${asistencia.student.firstName} ${asistencia.student.lastName}`,
          message: `El tutor de ${asistencia.student.firstName} ${asistencia.student.lastName} envió justificación para la falta del ${fechaFormateada} en ${materiaNombre}. Motivo: "${dto.reason}". Documento anexo: ${dto.attachmentName || 'Sin adjunto'}. Pendiente de revisión por Dirección.`,
          severity: AlertSeverity.INFO,
          metadata: {
            type: 'JUSTIFICATION_PENDING_REVIEW',
            attendanceId: asistencia.id,
            studentId: asistencia.studentId,
            studentName: `${asistencia.student.firstName} ${asistencia.student.lastName}`,
            courseName: asistencia.course.name,
            subjectName: materiaNombre,
            date: fechaFormateada,
            parentReason: dto.reason,
            attachmentName: dto.attachmentName,
            attachmentUrl: dto.attachmentUrl,
          },
        },
      });
    }

    return {
      statusCode: 200,
      message: 'Justificación enviada a Dirección exitosamente',
    };
  }

  @Post(':id/resolve-justification')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async resolverJustificacion(
    @Param('id') id: string,
    @Body() dto: dtoresolverjustificacion,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const asistencia = await this.prismaClient.attendance.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            studentParents: {
              include: { parent: true },
            },
          },
        },
        course: { select: { id: true, name: true } },
      },
    });
    if (!asistencia) throw new NotFoundException('Registro de asistencia no encontrado');

    let datosPrevios: Record<string, unknown> = {};
    if (asistencia.justification) {
      try {
        datosPrevios = JSON.parse(asistencia.justification);
      } catch {
        datosPrevios = { previousText: asistencia.justification };
      }
    }

    const fechaFormateada = asistencia.date.toISOString().split('T')[0];
    const materiaNombre = (datosPrevios.subjectName as string) || 'Clase regular';
    const esAprobado = dto.decision === 'APPROVE';

    const nuevoEstado = esAprobado ? AttendanceStatus.JUSTIFIED : AttendanceStatus.ABSENT;

    const actualizacionJustificacion = JSON.stringify({
      ...datosPrevios,
      justificationStatus: esAprobado ? 'APPROVED' : 'REJECTED',
      reviewNotes: dto.reviewNotes || (esAprobado ? 'Aprobado por Dirección' : 'Rechazado'),
      reviewedAt: new Date().toISOString(),
      reviewedById: usuario.id,
      reviewedBy: `${usuario.firstName} ${usuario.lastName}`,
    });

    await this.prismaClient.attendance.update({
      where: { id },
      data: {
        status: nuevoEstado,
        justification: actualizacionJustificacion,
      },
    });

    const nombreAlumno = `${asistencia.student.firstName} ${asistencia.student.lastName}`;

    // 1. Notificar a los Padres de Familia
    for (const sp of asistencia.student.studentParents) {
      if (sp.parent?.userId) {
        await this.prismaClient.alert.create({
          data: {
            userId: sp.parent.userId,
            studentId: asistencia.studentId,
            title: esAprobado
              ? `Justificación APROBADA: ${nombreAlumno}`
              : `Justificación RECHAZADA: ${nombreAlumno}`,
            message: esAprobado
              ? `Dirección ha APROBADO la justificación de ausencia del día ${fechaFormateada} en la materia de ${materiaNombre}. El registro de asistencia ha sido actualizado a JUSTIFICADO.`
              : `Dirección ha RECHAZADO la justificación de ausencia del día ${fechaFormateada} en la materia de ${materiaNombre}. Motivo: "${dto.reviewNotes || 'Documentación insuficiente'}". La falta permanece registrada.`,
            severity: esAprobado ? AlertSeverity.SUCCESS : AlertSeverity.WARNING,
            metadata: {
              type: 'JUSTIFICATION_RESOLVED',
              attendanceId: asistencia.id,
              decision: dto.decision,
              reviewNotes: dto.reviewNotes,
              date: fechaFormateada,
              subjectName: materiaNombre,
            },
          },
        });
      }
    }

    // 2. Notificar al Estudiante (si tiene cuenta activa)
    if (asistencia.student.userId) {
      await this.prismaClient.alert.create({
        data: {
          userId: asistencia.student.userId,
          studentId: asistencia.studentId,
          title: esAprobado ? 'Inasistencia Justificada' : 'Justificación de Falta Rechazada',
          message: esAprobado
            ? `Tu falta del día ${fechaFormateada} en ${materiaNombre} ha sido APROBADA y registrada como JUSTIFICADA por Dirección.`
            : `La justificación de tu falta del día ${fechaFormateada} en ${materiaNombre} fue RECHAZADA por Dirección. Motivo: "${dto.reviewNotes || 'Documentación insuficiente'}".`,
          severity: esAprobado ? AlertSeverity.SUCCESS : AlertSeverity.WARNING,
          metadata: {
            type: 'JUSTIFICATION_RESOLVED',
            attendanceId: asistencia.id,
            decision: dto.decision,
            reviewNotes: dto.reviewNotes,
            date: fechaFormateada,
            subjectName: materiaNombre,
          },
        },
      });
    }

    return {
      statusCode: 200,
      message: esAprobado
        ? 'Justificación aprobada y estado actualizado a JUSTIFICADO'
        : 'Justificación rechazada y registrada en el sistema',
      data: {
        id: asistencia.id,
        status: nuevoEstado,
        decision: dto.decision,
      },
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('attendance:create')
  async crear(
    @Body() dto: dtocrearasistencia,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 201,
      message: 'Asistencia registrada exitosamente',
      data: await this.crearattendance.ejecutar(dto, usuario.id, req.ip, usuario.role),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('attendance:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarasistencia,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Asistencia actualizada exitosamente',
      data: await this.actualizarattendance.ejecutar(id, dto, usuario.id, req.ip, usuario.role),
    };
  }
}
