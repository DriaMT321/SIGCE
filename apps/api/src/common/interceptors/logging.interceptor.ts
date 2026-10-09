import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';
import { Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request & { correlationId?: string }>();
    const res = httpContext.getResponse<Response>();

    const correlationId =
      (req.headers['x-correlation-id'] as string) ||
      (req.headers['x-request-id'] as string) ||
      randomUUID();

    req.correlationId = correlationId;
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('x-correlation-id', correlationId);
    }

    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`[CID: ${correlationId}] ${method} ${url} ${delay}ms`);
      }),
    );
  }
}
