import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestioneventosacademicos } from '../../features/academic-events/infrastructure/adaptadorgestioneventosacademicos';
import { PaginaEventosAcademicos } from '../../features/academic-events/pages/paginaeventosacademicos';

export function eventosacademicosruta() {
  const usuario = autenticacionservicio.obtenerusuarioactual();
  return (
    <PaginaEventosAcademicos
      gestion={instanciagestioneventosacademicos}
      currentRole={usuario?.role}
      currentUserId={usuario?.id}
    />
  );
}

