import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configuracionauditoriacalificacionessie } from '../../application/ports/ejecucionauditoriacalificacionsie.ports';

@Injectable()
export class adaptadorconfiguracionnestauditoriacalificacionessie implements configuracionauditoriacalificacionessie {
  constructor(private readonly configuracionservicio: ConfigService) {}

  urlbase(): string {
    return (
      this.configuracionservicio.get<string>('sie.baseUrl') ||
      process.env.SIE_BASE_URL ||
      'https://academico.sie.gob.bo'
    );
  }
}
