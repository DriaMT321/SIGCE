import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionhorarios } from '../../features/schedules/infrastructure/adaptadorgestionhorarios';
import { HorariosPagina } from '../../features/schedules/pages/paginahorarios';

export function horariosruta() {
  return (
    <HorariosPagina
      management={instanciagestionhorarios}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
