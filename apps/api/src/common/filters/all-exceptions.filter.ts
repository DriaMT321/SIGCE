import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Error interno del servidor';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' ? res : { message: res };
      errorName = exception.name;
    } else if (exception instanceof Error) {
      message = { message: exception.message };
      errorName = exception.name;
      this.logger.error(`Unhandled Error: ${exception.message}`, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      error: errorName,
      details: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
