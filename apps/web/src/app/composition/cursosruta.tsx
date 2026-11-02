import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { catalogocursos } from '../../features/courses/infrastructure/adaptadorcatalogodecursos';
import { CursosPagina } from '../../features/courses/pages/paginacursos';

export function cursosruta() {
  return (
    <CursosPagina
      catalog={catalogocursos}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
