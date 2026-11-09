import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionhorarios } from '../../features/schedules/infrastructure/adaptadorgestionhorarios';
import { HorariosPagina } from '../../features/schedules/pages/paginahorarios';

export function horariosruta() {
  const usuario = autenticacionservicio.obtenerusuarioactual();
  return (
    <HorariosPagina
      management={instanciagestionhorarios}
      currentRole={usuario?.role}
      currentUserId={usuario?.id}
    />
  );
}
