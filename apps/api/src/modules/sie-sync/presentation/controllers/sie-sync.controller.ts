import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  Query,
  ForbiddenException,
  BadRequestException,
  Patch,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { casousoiniciarsincronizacionsie } from '../../application/use-cases/iniciarsincronizacion.use-case';
import { dtoiniciarsincronizacionsie } from '../dto/iniciarsincronizacionsie.dto';
import { dtovistapreviasincronizacionsie } from '../dto/siesincronizacionprevisualizacion.dto';
import { casousoprevisualizarsincronizacionsie } from '../../application/use-cases/previsualizacionsiesincronizacion.use-case';
import { casousoreintentarelementosincronizacionsie } from '../../application/use-cases/reintentarelementosincronizacionsie.use-case';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { rolusuario, usuarioautenticado } from '@academic/shared-types';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { casousoobtenerestadosincronizacionsie } from '../../application/use-cases/obtenerestadosincronizacionsie.use-case';

import { casousoverificaraccesosie } from '../../application/use-cases/verificaraccesosie.use-case';
import { casousoverificarreplicalocalsie } from '../../application/use-cases/verificarreplicalocalsie.use-case';

import { casousoauditarcalificacionessie } from '../../application/use-cases/auditoriacalificacionesie.use-case';
import type { datosrespuestaauditoriasie } from '@academic/shared-types';
import { dtoejecucionauditoria } from '../dto/ejecucionauditoria.dto';
import { dtoverificaraccesosie } from '../dto/verificaraccesosie.dto';
import { dtoresolverdiscrepanciasie } from '../dto/resolversiediscrepancia.dto';
import { casousoresolverdiscrepanciasie } from '../../application/use-cases/resolversiediscrepancia.use-case';
import { dtoreintentarelementosincronizacionsie } from '../dto/reintentarelementosincronizacionsie.dto';
import { casousoreanudarsincronizacionsie } from '../../application/use-cases/reanudarsiesincronizacion.use-case';
import { dtoreanudarsincronizacionsie } from '../dto/reanudarsiesincronizacion.dto';
import { casousoresolvergrupodiscrepanciassie } from '../../application/use-cases/resolvergrupodiscrepanciasie.use-case';
import type { filtroslistadosincronizacionsie } from '../../application/ports/repositoriosincronizacionsie';
import { dtofiltrossincronizacionsie } from '../dto/filtrossincronizacionsie.dto';
import { dtoverificarreplicalocalsie } from '../dto/verificarreplicalocalsie.dto';

type correlatedsolicitud = Request & { correlationId?: string };

@Controller('sie-sync')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class SieSyncController {
  constructor(
    private readonly casoiniciarsincronizacionsie: casousoiniciarsincronizacionsie,
    private readonly casoprevisualizarsincronizacionsie: casousoprevisualizarsincronizacionsie,
    private readonly casoobtenerestadosincronizacionsie: casousoobtenerestadosincronizacionsie,
    private readonly casoverificaraccesosie: casousoverificaraccesosie,
    private readonly casoverificarreplicalocalsie: casousoverificarreplicalocalsie,
    private readonly casoauditarcalificacionessie: casousoauditarcalificacionessie,
    private readonly servicioconfiguracion: ConfigService,
    private readonly resolverdiscrepancia: casousoresolverdiscrepanciasie,
    private readonly casoreintentarelementosincronizacionsie: casousoreintentarelementosincronizacionsie,
    private readonly casoreanudarsincronizacionsie: casousoreanudarsincronizacionsie,
    private readonly casoresolvergrupodiscrepanciassie: casousoresolvergrupodiscrepanciassie,
  ) {}

  @Get('audit/latest')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:read')
  async obtenerultimaauditoria() {
    const resultado: datosrespuestaauditoriasie =
      await this.casoauditarcalificacionessie.obtenerultimaauditoria();
    return {
      statusCode: 200,
      data: resultado,
    };
  }

  @Patch('items/:itemId/resolve-discrepancy')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('sie:execute')
  async resolverdiscrepanciaelemento(
    @Param('itemId') elementoid: string,
    @Body() dto: dtoresolverdiscrepanciasie,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const elemento = await this.resolverdiscrepancia.ejecutar({
      itemId: elementoid,
      decision: dto.decision,
      reason: dto.reason,
      userId: usuario.id,
      ipAddress: req.ip,
      correlationId: req.correlationId,
    });
    return {
      statusCode: 200,
      message: 'Revisión de discrepancia registrada. La nota SIGCE no fue modificada.',
      data: elemento,
    };
  }

  @Patch('groups/:groupId/resolve-discrepancy')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('sie:execute')
  async resolvergrupodiscrepancias(
    @Param('groupId') groupid: string,
    @Body() dto: dtoresolverdiscrepanciasie,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const resultado = await this.casoresolvergrupodiscrepanciassie.ejecutar({
      groupId: groupid,
      decision: dto.decision,
      reason: dto.reason,
      userId: usuario.id,
      ipAddress: req.ip,
      correlationId: req.correlationId,
    });
    return {
      statusCode: 200,
      message:
        'La revisión del grupo quedó auditada. Las calificaciones SIGCE no fueron modificadas.',
      data: resultado,
    };
  }

  @Post('items/:itemId/retry')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async reintentarelementofallido(
    @Param('itemId') elementoid: string,
    @Body() dto: dtoreintentarelementosincronizacionsie,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const resultado = await this.casoreintentarelementosincronizacionsie.ejecutar({
      itemId: elementoid,
      userId: usuario.id,
      reason: dto.reason,
      ipAddress: req.ip,
      correlationId: req.correlationId,
    });
    return {
      statusCode: 202,
      message: 'Reintento manual auditado y encolado para verificación local.',
      data: resultado,
    };
  }

  @Post('synchronizations/:id/resume')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async reanudarsincronizacionpausada(
    @Param('id') id: string,
    @Body() dto: dtoreanudarsincronizacionsie,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const resultado = await this.casoreanudarsincronizacionsie.ejecutar({
      synchronizationId: id,
      userId: usuario.id,
      reason: dto.reason,
      ipAddress: req.ip,
      correlationId: req.correlationId,
    });
    return {
      statusCode: 202,
      message: 'Lote reanudado después de registrar la revisión.',
      data: resultado,
    };
  }

  @Post('audit/execute')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async ejecutarauditoria(
    @Body() body: dtoejecucionauditoria,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    this.exigiraccesorealsiehabilitado();
    const resultado = await this.casoauditarcalificacionessie.ejecutarauditoria(body, {
      userId: usuario.id,
      ipAddress: req.ip,
      correlationId: req.correlationId,
    });
    return {
      statusCode: 200,
      message: resultado.message,
      data: resultado,
    };
  }

  @Post('check-login')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async verificaracceso(@Body() body: dtoverificaraccesosie) {
    this.exigiraccesorealsiehabilitado();
    const resultado = await this.casoverificaraccesosie.ejecutar({
      username: body?.username,
      password: body?.password,
    });
    return {
      statusCode: 200,
      message: resultado.message,
      data: resultado,
    };
  }

  @Post('check-local')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async verificarreplicalocal(@Body() body?: dtoverificarreplicalocalsie) {
    const resultado = await this.casoverificarreplicalocalsie.ejecutar(body?.html);
    return { statusCode: 200, message: resultado.message, data: resultado };
  }

  private exigiraccesorealsiehabilitado(): void {
    if (!this.servicioconfiguracion.get<boolean>('sie.realAuditEnabled', false)) {
      throw new ForbiddenException('El acceso directo al SIE está deshabilitado.');
    }
  }

  @Post('trigger')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async iniciarsincronizacion(
    @Body() dto: dtoiniciarsincronizacionsie,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const idempotencykey = req.headers['idempotency-key'];
    if (
      typeof idempotencykey !== 'string' ||
      idempotencykey.trim().length < 8 ||
      idempotencykey.trim().length > 128
    ) {
      throw new BadRequestException('Envíe una clave Idempotency-Key válida.');
    }
    const resultado = await this.casoiniciarsincronizacionsie.ejecutar({
      idgestionacademica: dto.academicYearId,
      numeroperiodo: dto.periodNumber,
      ...(dto.courseId ? { idcurso: dto.courseId } : {}),
      ...(dto.subjectId ? { idmateria: dto.subjectId } : {}),
      claveidempotencia: idempotencykey.trim(),
      solicitadoporid: usuario.id,
      confirmarenvio: dto.confirmSend,
      huellaprevia: dto.expectedFingerprint,
      cantidadcalificacionesesperada: dto.expectedGradeCount,
      ...(req.ip ? { direccionip: req.ip } : {}),
      ...(req.correlationId ? { identificadorcorrelacion: req.correlationId } : {}),
    });
    return {
      statusCode: 202,
      message: 'Lote confirmado y encolado para verificación local simulada',
      data: resultado,
    };
  }

  @Post('preview')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async previsualizarsincronizacion(@Body() dto: dtovistapreviasincronizacionsie) {
    return {
      statusCode: 200,
      message: 'Resumen de calificaciones aptas para sincronización local',
      data: await this.casoprevisualizarsincronizacionsie.ejecutar(dto),
    };
  }

  @Get('status/:id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:read')
  async obtenerestadosincronizacion(@Param('id') id: string) {
    const sincronizacion = await this.casoobtenerestadosincronizacionsie.ejecutar(id);

    return {
      statusCode: 200,
      data: sincronizacion,
    };
  }

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:read')
  async listar(@Query() filtrosconsulta: dtofiltrossincronizacionsie) {
    const filtros: filtroslistadosincronizacionsie = {
      ...(filtrosconsulta.academicYear ? { academicYear: filtrosconsulta.academicYear } : {}),
      ...(filtrosconsulta.periodNumber ? { periodNumber: filtrosconsulta.periodNumber } : {}),
      ...(filtrosconsulta.courseName?.trim()
        ? { courseName: filtrosconsulta.courseName.trim() }
        : {}),
      ...(filtrosconsulta.studentRude?.trim()
        ? { studentRude: filtrosconsulta.studentRude.trim() }
        : {}),
      ...(filtrosconsulta.status ? { status: filtrosconsulta.status } : {}),
    };
    const resultado = await this.casoobtenerestadosincronizacionsie.listar(
      Math.min(filtrosconsulta.limit ?? 20, 100),
      filtrosconsulta.offset ?? 0,
      filtros,
    );
    return {
      statusCode: 200,
      message: 'Sincronizaciones obtenidas exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }
}
