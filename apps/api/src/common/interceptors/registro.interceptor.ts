import {
  Inject,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';
import { Request, Response } from 'express';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../core/application/ports/contextocorrelacion.port';

@Injectable()
export class interceptorregistrosolicitudes implements NestInterceptor {
  private readonly registrador = new Logger('HTTP');

  constructor(
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  intercept(contexto: ExecutionContext, manejadorsiguiente: CallHandler): Observable<unknown> {
    const contextohttp = contexto.switchToHttp();
    const solicitud = contextohttp.getRequest<Request & { correlationId?: string }>();
    const respuestahttp = contextohttp.getResponse<Response>();

    const idcorrelacion = randomUUID();

    solicitud.correlationId = idcorrelacion;
    if (respuestahttp && typeof respuestahttp.setHeader === 'function') {
      respuestahttp.setHeader('x-correlation-id', idcorrelacion);
    }

    const { method } = solicitud;
    const rutarecurso =
      solicitud.route?.path || solicitud.path || solicitud.originalUrl.split('?')[0];
    const instanteinicio = Date.now();

    const flujorespuesta = manejadorsiguiente.handle().pipe(
      tap(() => {
        const demorams = Date.now() - instanteinicio;
        this.registrador.log(`[CID: ${idcorrelacion}] ${method} ${rutarecurso} ${demorams}ms`);
      }),
    );
    return new Observable((suscriptor) =>
      this.contextocorrelacion.ejecutar(idcorrelacion, () => flujorespuesta.subscribe(suscriptor)),
    );
  }
}
