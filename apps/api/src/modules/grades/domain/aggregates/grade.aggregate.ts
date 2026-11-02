import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { grade } from '../entities/grade.entity';
import {
  datosactualizacioncalificacion,
  datoscreacioncalificacion,
} from '../entities/datosregistrocalificacion';
import { valorcalificacion } from '../value-objects/calificacionvalor';

export class gradeaggregate {
  private constructor(
    readonly id: string | null,
    readonly idInscripcion: string,
    readonly idEstudiante: string,
    readonly idMateria: string,
    readonly idPeriodo: string,
    private valorcalificacion: valorcalificacion,
    private observaciones: string | null,
  ) {}

  static registrar(entrada: datoscreacioncalificacion): gradeaggregate {
    for (const [nombre, valor] of Object.entries({
      enrollmentId: entrada.enrollmentId,
      studentId: entrada.studentId,
      subjectId: entrada.subjectId,
      periodId: entrada.periodId,
    })) {
      if (!valor.trim()) {
        throw new incumplimientoregladominio('VALIDATION', `La calificación requiere ${nombre}.`);
      }
    }

    return new gradeaggregate(
      null,
      entrada.enrollmentId,
      entrada.studentId,
      entrada.subjectId,
      entrada.periodId,
      valorcalificacion.desde(entrada.value),
      normalizarobservaciones(entrada.remarks),
    );
  }

  static rehidratar(entidad: grade): gradeaggregate {
    return new gradeaggregate(
      entidad.id,
      entidad.enrollmentId,
      entidad.studentId,
      entidad.subjectId,
      entidad.periodId,
      valorcalificacion.desde(entidad.value),
      entidad.remarks,
    );
  }

  get value(): number {
    return this.valorcalificacion.valor;
  }

  get idPersistido(): string {
    if (!this.id) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'La calificación debe estar persistida para poder actualizarse.',
      );
    }
    return this.id;
  }

  revisar(entrada: { value: number; remarks?: string }): this {
    this.valorcalificacion = valorcalificacion.desde(entrada.value);
    if (entrada.remarks !== undefined)
      this.observaciones = normalizarobservaciones(entrada.remarks);
    return this;
  }

  convertiradatoscreacion(): datoscreacioncalificacion {
    return {
      enrollmentId: this.idInscripcion,
      studentId: this.idEstudiante,
      subjectId: this.idMateria,
      periodId: this.idPeriodo,
      value: this.value,
      ...(this.observaciones === null ? {} : { remarks: this.observaciones }),
    };
  }

  convertiradatosactualizacion(): datosactualizacioncalificacion {
    return { value: this.value, remarks: this.observaciones };
  }
}

function normalizarobservaciones(observaciones: string | undefined): string | null {
  const normalizado = observaciones?.trim();
  return normalizado ? normalizado : null;
}
