import { autenticacionservicio } from '../../features/auth/services/serviciodeautenticacion';
import { instanciagestionusuarios } from '../../features/users/infrastructure/adaptadorgestionusuarios';
import { UsuariosPagina } from '../../features/users/pages/paginausuarios';

export function usuariosruta() {
  return (
    <UsuariosPagina
      management={instanciagestionusuarios}
      currentUser={autenticacionservicio.obtenerusuarioactual()}
    />
  );
}
