import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestioninscripciones } from '../../features/enrollments/infrastructure/adaptadorgestionmatricula';
import { InscripcionesPagina } from '../../features/enrollments/pages/paginamatriculas';

export function inscripcionesruta() {
  return (
    <InscripcionesPagina
      management={instanciagestioninscripciones}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
