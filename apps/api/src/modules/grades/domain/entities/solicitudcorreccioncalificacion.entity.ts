import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';

export type estadocorreccioncalificacion = 'PENDING' | 'EXECUTED' | 'REJECTED';

export class solicitudcorreccioncalificacion {
  private constructor(
    readonly previousValue: number,
    readonly proposedValue: number,
    readonly motivo: string,
    readonly evidenceReference: string,
    private estadoactual: estadocorreccioncalificacion,
  ) {}

  get estado(): estadocorreccioncalificacion {
    return this.estadoactual;
  }

  static enviar(entrada: {
    previousValue: number;
    proposedValue: number;
    reason: string;
    evidenceReference: string;
  }): solicitudcorreccioncalificacion {
    if (entrada.previousValue === entrada.proposedValue) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'La calificación propuesta debe ser distinta a la registrada.',
      );
    }
    const motivo = entrada.reason.trim();
    if (motivo.length < 10) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'El motivo de la corrección debe tener al menos 10 caracteres.',
      );
    }
    const referenciaevidencia = entrada.evidenceReference.trim();
    if (!referenciaevidencia) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'Debe indicar el documento o referencia de respaldo.',
      );
    }
    return new solicitudcorreccioncalificacion(
      entrada.previousValue,
      entrada.proposedValue,
      motivo,
      referenciaevidencia,
      'PENDING',
    );
  }

  static rehidratar(entrada: {
    previousValue: number;
    proposedValue: number;
    reason: string;
    evidenceReference: string;
    status: estadocorreccioncalificacion;
  }): solicitudcorreccioncalificacion {
    return new solicitudcorreccioncalificacion(
      entrada.previousValue,
      entrada.proposedValue,
      entrada.reason,
      entrada.evidenceReference,
      entrada.status,
    );
  }

  decidir(decision: 'EXECUTED' | 'REJECTED', motivodecision: string): estadocorreccioncalificacion {
    if (this.estadoactual !== 'PENDING') {
      throw new incumplimientoregladominio('CONFLICT', 'La solicitud ya fue resuelta.');
    }
    if (motivodecision.trim().length < 5) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'La decisión debe incluir un motivo de al menos 5 caracteres.',
      );
    }
    this.estadoactual = decision;
    return this.estadoactual;
  }
}
