import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionalertas } from '../../features/alerts/infrastructure/adaptadorgestionalertas';
import { AlertasPagina } from '../../features/alerts/pages/paginaalertas';

export function alertasruta() {
  return (
    <AlertasPagina
      management={instanciagestionalertas}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
