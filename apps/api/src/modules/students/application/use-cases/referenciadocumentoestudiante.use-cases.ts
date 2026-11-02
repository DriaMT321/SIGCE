import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenrepositorioreferenciasdocumentosestudiante,
  repositorioreferenciasdocumentosestudiante,
} from '../../domain/repositories/referenciadocumentoestudiante.repository.interface';
import { dtocrearreferenciadocumentoestudiante } from '../dto/referenciadocumentoestudiante.dto';

@servicioaplicacion()
export class casousolistarreferenciasdocumentosestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioreferenciasdocumentosestudiante)
    private readonly repositorio: repositorioreferenciasdocumentosestudiante,
  ) {}

  ejecutar(idestudiante: string) {
    return this.repositorio.buscarporestudiante(idestudiante);
  }
}

@servicioaplicacion()
export class casousocrearreferenciadocumentoestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioreferenciasdocumentosestudiante)
    private readonly repositorio: repositorioreferenciasdocumentosestudiante,
  ) {}

  ejecutar(
    idestudiante: string,
    dto: dtocrearreferenciadocumentoestudiante,
    idusuario: string,
    direccionip?: string,
    correlacionid?: string,
  ) {
    return this.repositorio.crear({
      studentId: idestudiante,
      documentType: dto.documentType,
      reference: dto.reference.trim(),
      notes: dto.notes?.trim(),
      userId: idusuario,
      ipAddress: direccionip,
      correlationId: correlacionid,
    });
  }
}
