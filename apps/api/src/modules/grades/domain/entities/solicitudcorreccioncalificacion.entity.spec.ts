import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { solicitudcorreccioncalificacion } from './solicitudcorreccioncalificacion.entity';

function crearsolicitud() {
  return solicitudcorreccioncalificacion.enviar({
    previousValue: 60,
    proposedValue: 82,
    reason: 'La nota fue digitada incorrectamente.',
    evidenceReference: 'acta-2026-04',
  });
}

describe('grade correction request', () => {
  it('transitions a pending request to its decision state', () => {
    const solicitud = crearsolicitud();

    expect(solicitud.estado).toBe('PENDING');
    expect(solicitud.decidir('EXECUTED', 'Acta revisada por Dirección')).toBe('EXECUTED');
    expect(solicitud.estado).toBe('EXECUTED');
  });

  it('does not allow deciding an already resolved request', () => {
    const solicitud = crearsolicitud();
    solicitud.decidir('REJECTED', 'Respaldo no válido');

    expect(() => solicitud.decidir('EXECUTED', 'Acta revisada por Dirección')).toThrow(
      incumplimientoregladominio,
    );
  });

  it('requires a reason before applying the transition', () => {
    const solicitud = crearsolicitud();

    expect(() => solicitud.decidir('REJECTED', 'no')).toThrow(incumplimientoregladominio);
    expect(solicitud.estado).toBe('PENDING');
  });
});
