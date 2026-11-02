import { Body, Controller, Get, Post, Patch, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  dtocrearinscripcion,
  dtoactualizarinscripcion,
  dtoactualizarestadomasivo,
} from '../dto/inscripcion.dto';
import { dtofiltrosinscripciones } from '../dto/filtrosinscripciones.dto';
import {
  casousocrearinscripcion,
  casousolistarinscripciones,
  casousoactualizarinscripcion,
  casousoactualizarestadomasivo,
} from '../../application/use-cases/inscripcion.use-cases';

@Controller('enrollments')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladorinscripciones {
  constructor(
    private readonly listarenrollments: casousolistarinscripciones,
    private readonly crearinscripcion: casousocrearinscripcion,
    private readonly actualizarinscripcion: casousoactualizarinscripcion,
    private readonly actualizarestadomasivo: casousoactualizarestadomasivo,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('enrollments:read')
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query() filtros: dtofiltrosinscripciones,
  ) {
    const resultado = await this.listarenrollments.ejecutar({
      academicYearId: filtros.academicYearId,
      courseId: filtros.courseId,
      studentId: filtros.studentId,
      parentUserId: [rolusuario.PARENT, rolusuario.STUDENT].includes(usuario.role)
        ? usuario.id
        : undefined,
      teacherUserId: usuario.role === rolusuario.TEACHER ? usuario.id : undefined,
      limit: Math.min(filtros.limit ?? 50, 1000),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Matrículas obtenidas exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('enrollments:create')
  async crear(
    @Body() dto: dtocrearinscripcion,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 201,
      message: 'Matrícula creada exitosamente',
      data: await this.crearinscripcion.ejecutar(dto, usuario.id, req.ip),
    };
  }

  @Post('bulk-status')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('enrollments:update')
  async actualizarmasivo(
    @Body() dto: dtoactualizarestadomasivo,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    const resultado = await this.actualizarestadomasivo.ejecutar(dto, usuario.id, req.ip);
    return {
      statusCode: 200,
      message: 'Estados de matrícula actualizados de forma conjunta',
      data: resultado,
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('enrollments:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarinscripcion,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Matrícula actualizada exitosamente',
      data: await this.actualizarinscripcion.ejecutar(id, dto, usuario.id, req.ip),
    };
  }
}
