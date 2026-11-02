import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { asistenciaregistrada } from '../../../../core/application/eventos/asistenciaregistrada.event';
import {
  tokenbuseventosaplicacion,
  buseventosaplicacion,
} from '../../../../core/application/buseventosaplicacion.port';
import { casousoevaluaralertasestudiante } from '../../application/use-cases/alerta.use-cases';

@Injectable()
export class suscriptorasistenciaregistradaalerta implements OnModuleInit {
  constructor(
    @Inject(tokenbuseventosaplicacion) private readonly eventobus: buseventosaplicacion,
    private readonly casoevaluaralertasestudiante: casousoevaluaralertasestudiante,
  ) {}

  onModuleInit(): void {
    this.eventobus.suscribir<asistenciaregistrada>('attendance.registered', async (evento) =>
      this.casoevaluaralertasestudiante.ejecutarsiesposible(evento.studentId),
    );
  }
}
