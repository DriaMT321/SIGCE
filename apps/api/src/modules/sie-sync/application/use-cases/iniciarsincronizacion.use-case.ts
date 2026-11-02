import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import type {
  entradacrearsincronizacion,
  puertocrearlotesie,
} from '../ports/repositoriosincronizacionsie';
import type { puertocolasincronizacionsie } from '../ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from '../ports/publicadorprogresosincronizacionsie.port';
import { constantetamanomaximolotesincronizacionsie } from '../../domain/policies/politicasincronizacionsie';

export interface entradainiciarsincronizacionsie {
  idgestionacademica: string;
  numeroperiodo: number;
  idcurso?: string;
  idmateria?: string;
  claveidempotencia: string;
  solicitadoporid: string;
  confirmarenvio: boolean;
  huellaprevia: string;
  cantidadcalificacionesesperada: number;
  direccionip?: string;
  identificadorcorrelacion?: string;
}

export class casousoiniciarsincronizacionsie {
  constructor(
    private readonly repositorio: puertocrearlotesie,
    private readonly cola: puertocolasincronizacionsie,
    private readonly publicadorprogreso: puertopublicadorprogresosincronizacionsie,
  ) {}

  async ejecutar(entrada: entradainiciarsincronizacionsie) {
    if (!entrada.confirmarenvio) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'Debe confirmar el resumen antes de encolar la sincronización.',
      );
    }
    if (entrada.cantidadcalificacionesesperada > constantetamanomaximolotesincronizacionsie) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        `El lote supera el máximo de ${constantetamanomaximolotesincronizacionsie} calificaciones. Ajuste los filtros y genere otro resumen.`,
      );
    }

    const creado = await this.repositorio.creardesdecalificaciones({
      academicYearId: entrada.idgestionacademica,
      periodNumber: entrada.numeroperiodo,
      ...(entrada.idcurso ? { courseId: entrada.idcurso } : {}),
      ...(entrada.idmateria ? { subjectId: entrada.idmateria } : {}),
      idempotencyKey: entrada.claveidempotencia,
      requestedById: entrada.solicitadoporid,
      syncType: 'GRADES',
      confirmSend: true,
      expectedFingerprint: entrada.huellaprevia,
      expectedGradeCount: entrada.cantidadcalificacionesesperada,
      ...(entrada.direccionip ? { ipAddress: entrada.direccionip } : {}),
      ...(entrada.identificadorcorrelacion
        ? { correlationId: entrada.identificadorcorrelacion }
        : {}),
    } satisfies entradacrearsincronizacion);
    if (!creado || (!creado.reutilizado && creado.jobs.length === 0)) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'No existen calificaciones aptas para los filtros seleccionados.',
      );
    }

    const tareaids = creado.jobs.length > 0 ? await this.cola.encolar(creado.jobs) : [];
    if (tareaids.length > 0) {
      this.publicadorprogreso.publicarencolados({
        synchronizationId: creado.synchronization.id,
        total: tareaids.length,
      });
    }

    return {
      synchronizationId: creado.synchronization.id,
      jobId: tareaids[0] ?? null,
      jobIds: tareaids,
      status: creado.synchronization.status,
      totalItems: creado.synchronization.totalItems,
      message: creado.reutilizado
        ? 'Se recuperó el lote existente asociado a esta solicitud.'
        : 'Lote confirmado y encolado para verificación local.',
    };
  }
}
