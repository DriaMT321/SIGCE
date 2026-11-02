import { estadoasistencia } from '@academic/domain-kernel';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';

export function exigirasistenciavalida(estado: string, justificacion?: string | null): void {
  if (estado === estadoasistencia.JUSTIFIED && !justificacion?.trim()) {
    throw new incumplimientoregladominio(
      'VALIDATION',
      'Una asistencia justificada requiere indicar el motivo',
    );
  }
}

export function obtenerdiaasistencia(valor: string): Date {
  const dia = valor.slice(0, 10);
  const fecha = new Date(`${dia}T00:00:00.000Z`);
  if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== dia) {
    throw new incumplimientoregladominio('VALIDATION', 'La fecha de asistencia no es válida');
  }
  return fecha;
}
