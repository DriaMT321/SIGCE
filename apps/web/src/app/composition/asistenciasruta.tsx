import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionasistencia } from '../../features/attendance/infrastructure/adaptadorgestionasistencia';
import { AsistenciaPagina } from '../../features/attendance/pages/paginaasistencia';

export function asistenciaruta() {
  return (
    <AsistenciaPagina
      management={instanciagestionasistencia}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
