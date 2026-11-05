import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { usuarioautenticado } from '@academic/shared-types';
import {
  dtocrearestudiante,
  dtoactualizarestudiante,
  dtobuscarcoincidenciasestudiante,
  dtofiltrosestudiante,
} from '../dto/estudiante.dto';
import { dtocrearreferenciadocumentoestudiante } from '../dto/referenciadocumentoestudiante.dto';
import {
  casousocrearestudiante,
  casousoeliminarestudiante,
  casousoobtenerestudiante,
  casousolistarestudiantes,
  casousoreemitiractivacionestudiante,
  casousoactualizarestudiante,
} from '../../application/use-cases/estudiante.use-cases';
import {
  casousocrearreferenciadocumentoestudiante,
  casousolistarreferenciasdocumentosestudiante,
} from '../../application/use-cases/referenciadocumentoestudiante.use-cases';

type correlatedsolicitud = Request & { correlationId?: string };

@Controller('students')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class StudentsController {
  constructor(
    private readonly listarestudiantes: casousolistarestudiantes,
    private readonly obtenerestudiante: casousoobtenerestudiante,
    private readonly crearestudiante: casousocrearestudiante,
    private readonly reemitiractivacion: casousoreemitiractivacionestudiante,
    private readonly actualizarestudiante: casousoactualizarestudiante,
    private readonly eliminarestudiante: casousoeliminarestudiante,
    private readonly listarestudiantedocuments: casousolistarreferenciasdocumentosestudiante,
    private readonly crearestudiantedocumento: casousocrearreferenciadocumentoestudiante,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('students:read')
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query() filtros: dtofiltrosestudiante,
  ) {
    const resultado = await this.listarestudiantes.ejecutar({
      search: filtros.search,
      courseId: filtros.courseId,
      parentUserId: [rolusuario.PARENT, rolusuario.STUDENT].includes(usuario.role)
        ? usuario.id
        : undefined,
      teacherUserId: usuario.role === rolusuario.TEACHER ? usuario.id : undefined,
      limit: filtros.limit ?? 50,
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Estudiantes obtenidos exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Get(':id')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('students:read')
  async obtener(@Param('id') id: string, @usuarioactual() usuario: usuarioautenticado) {
    return {
      statusCode: 200,
      message: 'Estudiante obtenido exitosamente',
      data: await this.obtenerestudiante.ejecutar(
        id,
        [rolusuario.PARENT, rolusuario.STUDENT].includes(usuario.role) ? usuario.id : undefined,
        usuario.role === rolusuario.TEACHER ? usuario.id : undefined,
      ),
    };
  }

  @Get(':id/documents')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('students:read')
  async listardocumentos(@Param('id') id: string) {
    return {
      statusCode: 200,
      message: 'Referencias documentales obtenidas',
      data: await this.listarestudiantedocuments.ejecutar(id),
    };
  }

  @Post(':id/documents')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('students:update')
  async agregardocumento(
    @Param('id') id: string,
    @Body() dto: dtocrearreferenciadocumentoestudiante,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 201,
      message: 'Referencia documental registrada',
      data: await this.crearestudiantedocumento.ejecutar(
        id,
        dto,
        usuario.id,
        req.ip,
        req.correlationId,
      ),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('students:create')
  async crear(
    @Body() dto: dtocrearestudiante,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 201,
      message: 'Estudiante creado. El código de activación se muestra una sola vez.',
      data: await this.crearestudiante.ejecutar(dto, usuario.id, req.ip, req.correlationId),
    };
  }

  @Post('duplicates')
  @HttpCode(200)
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('students:create')
  async buscarcoincidencias(@Body() dto: dtobuscarcoincidenciasestudiante) {
    return {
      statusCode: 200,
      message: 'Coincidencias obtenidas',
      data: await this.listarestudiantes.buscarcoincidencias(dto),
    };
  }

  @Post(':id/activation')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('students:update')
  async reemitiractivacionestudiante(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 200,
      message: 'Código de activación emitido. Se muestra una sola vez.',
      data: await this.reemitiractivacion.ejecutar(id, usuario.id, req.ip, req.correlationId),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('students:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarestudiante,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 200,
      message: 'Estudiante actualizado exitosamente',
      data: await this.actualizarestudiante.ejecutar(
        id,
        dto,
        usuario.id,
        req.ip,
        req.correlationId,
      ),
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('students:delete')
  async eliminar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    await this.eliminarestudiante.ejecutar(id, usuario.id, req.ip, req.correlationId);
    return { statusCode: 200, message: 'Estudiante eliminado exitosamente' };
  }
}
