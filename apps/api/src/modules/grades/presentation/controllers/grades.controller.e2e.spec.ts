import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Test } from '@nestjs/testing';
import type { ExecutionContext } from '@nestjs/common';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  registrarcalificacion,
  casousocrearcalificacionesmasivas,
  casousolistarcalificaciones,
  casousoactualizarcalificacion,
  casousopublicarcalificaciones,
} from '../../application/use-cases/calificacion.use-cases';
import {
  casousodecidircorreccioncalificacion,
  casousolistarcorreccionescalificacion,
  casousosolicitarcorreccioncalificacion,
} from '../../application/use-cases/calificacioncorreccion.use-cases';
import { GradesController } from './grades.controller';

describe('GradesController HTTP validation', () => {
  let app: INestApplication;
  const crearcalificacion = { ejecutar: jest.fn().mockResolvedValue({ id: 'grade-1', value: 0 }) };
  const authenticatedusuario = {
    id: 'admin-1',
    role: rolusuario.ADMINISTRATIVE,
  } as usuarioautenticado;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [GradesController],
      providers: [
        { provide: casousolistarcalificaciones, useValue: { ejecutar: jest.fn() } },
        { provide: registrarcalificacion, useValue: crearcalificacion },
        { provide: casousoactualizarcalificacion, useValue: { ejecutar: jest.fn() } },
        { provide: casousocrearcalificacionesmasivas, useValue: { ejecutar: jest.fn() } },
        { provide: casousopublicarcalificaciones, useValue: { ejecutar: jest.fn() } },
        { provide: casousosolicitarcorreccioncalificacion, useValue: { ejecutar: jest.fn() } },
        { provide: casousolistarcorreccionescalificacion, useValue: { ejecutar: jest.fn() } },
        { provide: casousodecidircorreccioncalificacion, useValue: { ejecutar: jest.fn() } },
      ],
    })
      .overrideGuard(guardiaautenticacionjwt)
      .useValue({
        canActivate: (contexto: ExecutionContext) => {
          contexto.switchToHttp().getRequest().user = authenticatedusuario;
          return true;
        },
      })
      .overrideGuard(guardiaroles)
      .useValue({ canActivate: () => true })
      .overrideGuard(guardiapermisos)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(0, '127.0.0.1');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => crearcalificacion.ejecutar.mockClear());

  async function postcalificacion(valor: number): Promise<number> {
    const direccion = app.getHttpServer().address() as AddressInfo;
    const body = {
      enrollmentId: '11111111-1111-4111-8111-111111111111',
      studentId: '22222222-2222-4222-8222-222222222222',
      subjectId: '33333333-3333-4333-8333-333333333333',
      periodId: '44444444-4444-4444-8444-444444444444',
      value: valor,
    };

    return new Promise((resolver, reject) => {
      const outgoing = httpRequest(
        {
          hostname: '127.0.0.1',
          port: direccion.port,
          path: '/api/v1/grades',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        (incoming) => {
          incoming.resume();
          incoming.on('end', () => resolver(incoming.statusCode ?? 0));
        },
      );
      outgoing.on('error', reject);
      outgoing.end(JSON.stringify(body));
    });
  }

  it('rejects -1 over HTTP before calling the grade use case', async () => {
    await expect(postcalificacion(-1)).resolves.toBe(400);

    expect(crearcalificacion.ejecutar).not.toHaveBeenCalled();
  });

  it('accepts the lower boundary 0 over HTTP', async () => {
    await expect(postcalificacion(0)).resolves.toBe(201);

    expect(crearcalificacion.ejecutar).toHaveBeenCalledWith(
      expect.objectContaining({ value: 0 }),
      'admin-1',
      expect.any(String),
      rolusuario.ADMINISTRATIVE,
      undefined,
    );
  });
});
