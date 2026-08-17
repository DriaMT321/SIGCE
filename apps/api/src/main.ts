import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // Habilitar CORS para frontend web y móvil
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validaciones globales de DTO con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtros e interceptores globales
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`SERVIDOR ACADEMICO NESTJS INICIADO EN PUERTO: ${port}`);
  logger.log(`Base URL: http://localhost:${port}/api/v1`);
  logger.log(`WebSocket Server activo en puerto: ${port}`);
  logger.log(`=======================================================`);
}

bootstrap();
