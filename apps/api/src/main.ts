import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { moduloaplicacion } from './aplicacion.module';
import { interceptorregistrosolicitudes } from './common/interceptors/registro.interceptor';
import { filtrotodaslasexcepciones } from './common/filters/todaslasexcepciones.filter';

async function iniciarAplicacion() {
  const registrador = new Logger('Bootstrap');
  const app = await NestFactory.create(moduloaplicacion);

  const servicioConfiguracion = app.get(ConfigService);
  const puerto = servicioConfiguracion.get<number>('port', 3000);
  const entornoNodo = servicioConfiguracion.get<string>('nodeEnv', 'development');
  const allowedOrigins = servicioConfiguracion.get<string[]>('corsOrigins', []);
  const extensionOrigin = servicioConfiguracion.get<string | null>('extensionOrigin', null);
  const proxiesconfiables = servicioConfiguracion.get<string[]>('trustedProxyIps', []);

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // Habilitar CORS para frontend web y móvil
  app.enableCors({
    origin: (origen, continuacion) => {
      if (!origen || allowedOrigins.includes(origen) || origen === extensionOrigin)
        return continuacion(null, true);
      return continuacion(new Error('Origin is not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-SIGCE-Web',
      'X-SIGCE-Tab',
      'X-SIGCE-Extension',
      'idempotency-key',
      'Idempotency-Key',
      'x-correlation-id',
      'X-Correlation-Id',
    ],
  });

  app.getHttpAdapter().getInstance().set('trust proxy', proxiesconfiables);
  app.use((_request, respuesta, manejadorSiguiente) => {
    respuesta.setHeader('X-Content-Type-Options', 'nosniff');
    respuesta.setHeader('X-Frame-Options', 'DENY');
    respuesta.setHeader('Referrer-Policy', 'no-referrer');
    respuesta.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    respuesta.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    );
    if (entornoNodo === 'production')
      respuesta.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    manejadorSiguiente();
  });

  // Validaciones globales de DTO con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros e interceptores globales
  app.useGlobalInterceptors(app.get(interceptorregistrosolicitudes));
  app.useGlobalFilters(new filtrotodaslasexcepciones());

  await app.listen(puerto, '0.0.0.0');
  registrador.log(`=======================================================`);
  registrador.log(`SERVIDOR ACADEMICO NESTJS INICIADO EN PUERTO: ${puerto}`);
  registrador.log(`Base URL: http://localhost:${puerto}/api/v1`);
  registrador.log(`WebSocket Server activo en puerto: ${puerto}`);
  registrador.log(`=======================================================`);
}

iniciarAplicacion();
