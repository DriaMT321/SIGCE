import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestioncomunidad } from '../../features/community/infrastructure/adaptadorgestioncomunidad';
import { ComunidadPagina } from '../../features/community/pages/paginacomunidad';

export function ComunidadRuta({ mode: modo }: { mode: 'teachers' | 'parents' }) {
  return (
    <ComunidadPagina
      mode={modo}
      management={instanciagestioncomunidad}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
