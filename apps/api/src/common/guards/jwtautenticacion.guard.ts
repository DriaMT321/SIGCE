import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { constanteclavepublica } from '../decorators/publico.decorator';

@Injectable()
export class guardiaautenticacionjwt extends AuthGuard('jwt') {
  constructor(private lectormetadatos: Reflector) {
    super();
  }

  canActivate(contexto: ExecutionContext) {
    const espublic = this.lectormetadatos.getAllAndOverride<boolean>(constanteclavepublica, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (espublic) {
      return true;
    }

    return super.canActivate(contexto);
  }
}
