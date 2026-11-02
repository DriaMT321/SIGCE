import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionasignaciones } from '../../features/assignments/infrastructure/adaptadorgestionasignacion';
import { AsignacionesPagina } from '../../features/assignments/pages/paginaasignaciones';

export function asignacionesruta() {
  return (
    <AsignacionesPagina
      management={instanciagestionasignaciones}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
