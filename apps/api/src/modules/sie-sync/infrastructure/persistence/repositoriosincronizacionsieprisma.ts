import { Injectable } from '@nestjs/common';
import { servicioprisma } from '../../../../common/database/prisma.service';
import type {
  entradacrearsincronizacion,
  filtroslistadosincronizacionsie,
  filtrossincronizacionsie,
  repositoriosincronizacionsie,
  vistapreviasincronizacionsie,
} from '../../application/ports/repositoriosincronizacionsie';
import { consultarsincronizacionsieprisma } from './consultarsincronizacionsieprisma';
import { repositoriocrearsincronizacionsieprisma } from './repositoriocrearsincronizacionsieprisma';
import { repositoriooperacionessincronizacionsieprisma } from './repositoriooperacionessincronizacionsieprisma';
import { repositoriorevisiondiscrepanciassieprisma } from './repositoriorevisiondiscrepanciassieprisma';

@Injectable()
export class repositoriosincronizacionsieprisma implements repositoriosincronizacionsie {
  private readonly consultor: consultarsincronizacionsieprisma;
  private readonly operaciones: repositoriooperacionessincronizacionsieprisma;
  private readonly revisiones: repositoriorevisiondiscrepanciassieprisma;
  private readonly creaciones: repositoriocrearsincronizacionsieprisma;

  constructor(private readonly prisma: servicioprisma) {
    this.consultor = new consultarsincronizacionsieprisma(prisma);
    this.operaciones = new repositoriooperacionessincronizacionsieprisma(prisma);
    this.revisiones = new repositoriorevisiondiscrepanciassieprisma(prisma);
    this.creaciones = new repositoriocrearsincronizacionsieprisma(prisma);
  }

  buscarporidentificador(id: string) {
    return this.consultor.buscarporidentificador(id);
  }

  buscartodos(
    limite: number,
    desplazamiento: number,
    filtros: filtroslistadosincronizacionsie = {},
  ) {
    return this.consultor.buscartodos(limite, desplazamiento, filtros);
  }

  buscartrabajosencola(limite: number) {
    return this.operaciones.buscartrabajosencola(limite);
  }

  reintentarelementofallido(entrada: {
    itemId: string;
    userId: string;
    reason: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.operaciones.reintentarelementofallido(entrada);
  }

  reanudarsincronizacionpausada(entrada: {
    synchronizationId: string;
    userId: string;
    reason: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.operaciones.reanudarsincronizacionpausada(entrada);
  }

  resolverdiscrepancia(entrada: {
    itemId: string;
    decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.revisiones.resolverdiscrepancia(entrada);
  }

  resolvergrupodiscrepancias(entrada: {
    groupId: string;
    decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.revisiones.resolvergrupodiscrepancias(entrada);
  }

  previsualizardesdecalificaciones(
    entrada: filtrossincronizacionsie,
  ): Promise<vistapreviasincronizacionsie> {
    return this.creaciones.previsualizardesdecalificaciones(entrada);
  }

  creardesdecalificaciones(entrada: entradacrearsincronizacion) {
    return this.creaciones.creardesdecalificaciones(entrada);
  }
}
