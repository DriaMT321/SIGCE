import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';

export class valorcalificacion {
  private constructor(readonly valor: number) {}

  static desde(valor: number): valorcalificacion {
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'La calificación debe estar entre 0 y 100',
      );
    }
    return new valorcalificacion(valor);
  }
}
