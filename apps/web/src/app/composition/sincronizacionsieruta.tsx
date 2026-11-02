import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import {
  esrealsieauditoriahabilitado,
  instanciagestionsiesincronizacion,
} from '../../features/sie-sync/infrastructure/adaptadorgestionsincronizacionsie';
import { Paneldesincronizacionsie } from '../../features/sie-sync/pages/paneldesincronizacionsie';

export function siesincronizacionruta() {
  return (
    <Paneldesincronizacionsie
      management={instanciagestionsiesincronizacion}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
      realSieAuditEnabled={esrealsieauditoriahabilitado}
    />
  );
}
