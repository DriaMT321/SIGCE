import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { usuarioautenticado } from '@academic/shared-types';

export const usuarioactual = createParamDecorator(
  (datos: keyof usuarioautenticado | undefined, contextohttp: ExecutionContext) => {
    const solicitud = contextohttp.switchToHttp().getRequest();
    const usuario = solicitud.user as usuarioautenticado;

    return datos ? usuario?.[datos] : usuario;
  },
);
