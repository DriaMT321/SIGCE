import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { casousoobtenerregistrosauditoria } from '../../application/use-cases/obtenerauditoriaregistros.use-case';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { rolusuario } from '@academic/shared-types';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { dtofiltrosauditoria } from '../dto/filtrosauditoria.dto';

@Controller('audit')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladorauditoria {
  constructor(private readonly casoobtenerregistrosauditoria: casousoobtenerregistrosauditoria) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('audit:read')
  async obtenerregistrosauditoria(@Query() filtros: dtofiltrosauditoria) {
    const resultado = await this.casoobtenerregistrosauditoria.ejecutar({
      entity: filtros.entity,
      userId: filtros.userId,
      correlationId: filtros.correlationId,
      studentId: filtros.studentId,
      limit: Math.min(filtros.limit ?? 50, 100),
      offset: filtros.offset ?? 0,
    });

    return {
      statusCode: 200,
      message: 'Bitácora de auditoría recuperada exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }
}
