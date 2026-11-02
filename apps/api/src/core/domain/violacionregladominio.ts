export type codigoregladominio = 'VALIDATION' | 'CONFLICT' | 'NOT_FOUND';

export class incumplimientoregladominio extends Error {
  constructor(
    readonly code: codigoregladominio,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'DomainRuleViolation';
  }
}
