import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestioncalificaciones } from '../../features/grades/infrastructure/adaptadorgestioncalificaciones';
import { CalificacionesPagina } from '../../features/grades/pages/paginacalificaciones';

export function calificacionesruta() {
  return (
    <CalificacionesPagina
      management={instanciagestioncalificaciones}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
