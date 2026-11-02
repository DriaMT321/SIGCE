import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionestudiantes } from '../../features/students/infrastructure/adaptadorgestionestudiantes';
import { EstudiantesPagina } from '../../features/students/pages/paginaestudiantes';

export function estudiantesruta() {
  return (
    <EstudiantesPagina
      management={instanciagestionestudiantes}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
