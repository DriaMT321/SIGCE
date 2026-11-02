import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { incumplimientoregladominio } from '../../core/domain/violacionregladominio';
import { erroraplicacion } from '../../core/application/aplicacionerror';

@Catch()
export class filtrotodaslasexcepciones implements ExceptionFilter {
  private readonly registrador = new Logger(filtrotodaslasexcepciones.name);

  catch(excepcion: unknown, servidor: ArgumentsHost) {
    const contextohttp = servidor.switchToHttp();
    const respuesta = contextohttp.getResponse<Response>();
    const solicitud = contextohttp.getRequest<Request>();

    let estadohttp = HttpStatus.INTERNAL_SERVER_ERROR;
    let mensaje: string | object = 'Error interno del servidor';
    let nombreerror = 'InternalServerError';

    if (excepcion instanceof HttpException) {
      estadohttp = excepcion.getStatus();
      const respuesta = excepcion.getResponse();
      mensaje = typeof respuesta === 'object' ? respuesta : { message: respuesta };
      nombreerror = excepcion.name;
    } else if (excepcion instanceof erroraplicacion) {
      estadohttp = this.obtenerestadohttpparaerroraplicacion(excepcion);
      mensaje = excepcion.details ?? { message: excepcion.message };
      nombreerror = excepcion.name;
    } else if (excepcion instanceof incumplimientoregladominio) {
      estadohttp =
        excepcion.code === 'CONFLICT'
          ? HttpStatus.CONFLICT
          : excepcion.code === 'NOT_FOUND'
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST;
      mensaje = { message: excepcion.message };
      nombreerror = excepcion.name;
    } else if (excepcion instanceof Error) {
      this.registrador.error(`Unhandled Error: ${excepcion.message}`, excepcion.stack);
    }

    respuesta.status(estadohttp).json({
      statusCode: estadohttp,
      error: nombreerror,
      details: mensaje,
      timestamp: new Date().toISOString(),
      path: solicitud.url,
    });
  }

  private obtenerestadohttpparaerroraplicacion(excepcion: erroraplicacion): number {
    switch (excepcion.code) {
      case 'BAD_REQUEST':
        return HttpStatus.BAD_REQUEST;
      case 'UNAUTHORIZED':
        return HttpStatus.UNAUTHORIZED;
      case 'FORBIDDEN':
        return HttpStatus.FORBIDDEN;
      case 'NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      case 'CONFLICT':
        return HttpStatus.CONFLICT;
      case 'TOO_MANY_REQUESTS':
        return HttpStatus.TOO_MANY_REQUESTS;
      case 'SERVICE_UNAVAILABLE':
        return HttpStatus.SERVICE_UNAVAILABLE;
    }
  }
}
