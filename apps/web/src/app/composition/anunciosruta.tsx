import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionanuncios } from '../../features/announcements/infrastructure/adaptadorgestionanuncio';
import { AnunciosPagina } from '../../features/announcements/pages/paginaanuncios';

export function anunciosruta() {
  return (
    <AnunciosPagina
      management={instanciagestionanuncios}
      currentRole={autenticacionservicio.obtenerusuarioactual()?.role}
    />
  );
}
