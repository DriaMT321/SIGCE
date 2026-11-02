import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import type { actualizacionreglaalerta } from '../entities/alertaregla.entity';

export function validarconfiguracionreglaalerta(entrada: actualizacionreglaalerta): void {
  if (entrada.key === 'LOW_GRADE') {
    if (
      entrada.gradeThreshold === undefined ||
      !Number.isFinite(entrada.gradeThreshold) ||
      entrada.gradeThreshold < 0 ||
      entrada.gradeThreshold > 100
    ) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'El umbral de calificación debe estar entre 0 y 100',
      );
    }
    return;
  }

  if (
    entrada.absenceThreshold === undefined ||
    !Number.isInteger(entrada.absenceThreshold) ||
    entrada.absenceThreshold < 1 ||
    entrada.absenceThreshold > 30 ||
    entrada.absenceWindowDays === undefined ||
    !Number.isInteger(entrada.absenceWindowDays) ||
    entrada.absenceWindowDays < 1 ||
    entrada.absenceWindowDays > 365
  ) {
    throw new incumplimientoregladominio(
      'VALIDATION',
      'La regla de inasistencia requiere entre 1 y 30 faltas y una ventana de 1 a 365 días',
    );
  }
}
