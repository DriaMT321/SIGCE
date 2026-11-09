import { Navigate } from 'react-router-dom';
import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { adaptadorasistentesie } from '../../features/sie-sync/infrastructure/adaptadorasistentesie';
import { Paneldesincronizacionsie } from '../../features/sie-sync/pages/paneldesincronizacionsie';

export function siesincronizacionruta() {
  const rol = autenticacionservicio.obtenerusuarioactual()?.role;
  if (rol !== 'ADMINISTRATIVE' && rol !== 'SECRETARY') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Paneldesincronizacionsie gestion={adaptadorasistentesie} />;
}
