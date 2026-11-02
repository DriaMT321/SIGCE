import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciaresumentablero } from '../../features/dashboard/infrastructure/adaptadorresumendepanel';
import { TableroResumenPagina } from '../../features/dashboard/pages/paginaresumendepanel';

export function tableroruta() {
  return (
    <TableroResumenPagina
      overview={instanciaresumentablero}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
