import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { dtocrearasistencia, dtoactualizarasistencia } from '../dto/asistencia.dto';
import { dtofiltrosasistencia } from '../dto/filtrosasistencia.dto';
import {
  casousocrearasistencia,
  casousolistarasistencias,
  casousoactualizarasistencia,
} from '../../application/use-cases/asistencia.use-cases';

@Controller('attendance')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class AttendanceController {
  constructor(
    private readonly listarattendance: casousolistarasistencias,
    private readonly crearattendance: casousocrearasistencia,
    private readonly actualizarattendance: casousoactualizarasistencia,
  ) {}

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
