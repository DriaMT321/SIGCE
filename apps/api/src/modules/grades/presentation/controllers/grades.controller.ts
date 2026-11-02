import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
type correlatedsolicitud = Request & { correlationId?: string };
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  dtocrearcalificacion,
  dtoactualizarcalificacion,
  dtocrearcalificacionesmasivas,
  dtopublicarcalificaciones,
} from '../dto/calificacion.dto';
import {
  dtodecidircorreccioncalificacion,
  dtosolicitarcorreccioncalificacion,
} from '../dto/calificacioncorreccion.dto';
import { dtofiltroscalificaciones } from '../dto/filtroscalificaciones.dto';
import { dtofiltroscorreccionescalificacion } from '../dto/filtroscorreccionescalificacion.dto';
import {
  registrarcalificacion,
  casousolistarcalificaciones,
  casousoactualizarcalificacion,
  casousocrearcalificacionesmasivas,
  casousopublicarcalificaciones,
} from '../../application/use-cases/calificacion.use-cases';
import {
  casousodecidircorreccioncalificacion,
  casousolistarcorreccionescalificacion,
  casousosolicitarcorreccioncalificacion,
} from '../../application/use-cases/calificacioncorreccion.use-cases';

@Controller('grades')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class GradesController {
  constructor(
    private readonly casolistarcalificaciones: casousolistarcalificaciones,
    private readonly casocrearcalificacion: registrarcalificacion,
    private readonly casoactualizarcalificacion: casousoactualizarcalificacion,
    private readonly casocrearcalificacionesmasivas: casousocrearcalificacionesmasivas,
    private readonly casopublicarcalificaciones: casousopublicarcalificaciones,
    private readonly casosolicitarcorreccioncalificacion: casousosolicitarcorreccioncalificacion,
    private readonly casolistarcorreccionescalificacion: casousolistarcorreccionescalificacion,
    private readonly casodecidircorreccioncalificacion: casousodecidircorreccioncalificacion,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('grades:read')
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query() filtros: dtofiltroscalificaciones,
  ) {
    const resultado = await this.casolistarcalificaciones.ejecutar({
      studentId: filtros.studentId,
      enrollmentId: filtros.enrollmentId,
      courseId: filtros.courseId,
      subjectId: filtros.subjectId,
      search: filtros.search,
      periodId: filtros.periodId,
      parentUserId: [rolusuario.PARENT, rolusuario.STUDENT].includes(usuario.role)
        ? usuario.id
        : undefined,
      teacherUserId: usuario.role === rolusuario.TEACHER ? usuario.id : undefined,
      limit: Math.min(filtros.limit ?? 100, 200),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Calificaciones obtenidas exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Post('corrections')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  @definirpermisos('grades:update')
  async solicitarcorreccion(
    @Body() dto: dtosolicitarcorreccioncalificacion,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 201,
      message: 'Solicitud de corrección registrada para revisión',
      data: await this.casosolicitarcorreccioncalificacion.ejecutar(
        dto,
        usuario.id,
        usuario.role,
        req.ip,
      ),
    };
  }

  @Get('corrections')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  @definirpermisos('grades:update')
  async listarcorrecciones(
    @usuarioactual() usuario: usuarioautenticado,
    @Query() filtros: dtofiltroscorreccionescalificacion,
  ) {
    const resultado = await this.casolistarcorreccionescalificacion.ejecutar({
      status: filtros.status,
      ...(usuario.role === rolusuario.TEACHER ? { requestedById: usuario.id } : {}),
      limit: Math.min(filtros.limit ?? 50, 100),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Solicitudes de corrección obtenidas',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Patch('corrections/:id/decision')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('grades:update')
  async decidircorreccion(
    @Param('id') id: string,
    @Body() dto: dtodecidircorreccioncalificacion,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: dto.approve
        ? 'Corrección autorizada y ejecutada'
        : 'Solicitud de corrección rechazada',
      data: await this.casodecidircorreccioncalificacion.ejecutar(id, dto, usuario.id, req.ip),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('grades:create')
  async crear(
    @Body() dto: dtocrearcalificacion,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 201,
      message: 'Calificación registrada exitosamente',
      data: await this.casocrearcalificacion.ejecutar(
        dto,
        usuario.id,
        req.ip,
        usuario.role,
        req.correlationId,
      ),
    };
  }

  @Post('bulk')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('grades:create')
  async crearmasivamente(
    @Body() dto: dtocrearcalificacionesmasivas,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const resultado = await this.casocrearcalificacionesmasivas.ejecutar(
      dto,
      usuario.id,
      req.ip,
      usuario.role,
      req.correlationId,
    );
    return {
      statusCode: 201,
      message: 'Calificaciones registradas exitosamente en bloque',
      data: resultado,
    };
  }

  @Post('publish')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('grades:publish')
  async publicar(
    @Body() dto: dtopublicarcalificaciones,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 200,
      message: 'Calificaciones publicadas para familias y estudiantes',
      data: await this.casopublicarcalificaciones.ejecutar(
        dto,
        usuario.id,
        req.ip,
        usuario.role,
        req.correlationId,
      ),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('grades:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarcalificacion,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 200,
      message: 'Calificación actualizada exitosamente',
      data: await this.casoactualizarcalificacion.ejecutar(
        id,
        dto,
        usuario.id,
        req.ip,
        usuario.role,
        req.correlationId,
      ),
    };
  }
}
