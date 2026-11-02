import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  casousoevaluaralertastodosestudiantes,
  casousoevaluaralertasestudiante,
  casousolistarreglasalerta,
  casousolistaralertas,
  casousomarcaralertaleida,
  casousoactualizarreglaalerta,
  casousoactualizarestadoalerta,
} from '../../application/use-cases/alerta.use-cases';
import { AlertsController } from './alerts.controller';

describe('AlertsController HTTP validation', () => {
  let app: INestApplication;
  const actualizarestado = { ejecutar: jest.fn().mockResolvedValue({ id: 'alert-1' }) };
  const actualizarregla = { ejecutar: jest.fn().mockResolvedValue({ key: 'LOW_GRADE' }) };
  const authenticatedusuario = {
    id: 'admin-1',
    role: rolusuario.ADMINISTRATIVE,
  } as usuarioautenticado;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        { provide: casousolistaralertas, useValue: { ejecutar: jest.fn() } },
        { provide: casousomarcaralertaleida, useValue: { ejecutar: jest.fn() } },
        { provide: casousoactualizarestadoalerta, useValue: actualizarestado },
        { provide: casousolistarreglasalerta, useValue: { ejecutar: jest.fn() } },
        { provide: casousoactualizarreglaalerta, useValue: actualizarregla },
        { provide: casousoevaluaralertasestudiante, useValue: { ejecutar: jest.fn() } },
        { provide: casousoevaluaralertastodosestudiantes, useValue: { ejecutar: jest.fn() } },
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

  beforeEach(() => {
    actualizarestado.ejecutar.mockClear();
    actualizarregla.ejecutar.mockClear();
  });

  async function patchestado(estado: string): Promise<number> {
    const direccion = app.getHttpServer().address() as AddressInfo;
    return new Promise((resolver, reject) => {
      const outgoing = httpRequest(
        {
          hostname: '127.0.0.1',
          port: direccion.port,
          path: '/api/v1/alerts/alert-1/status',
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
        (incoming) => {
          incoming.resume();
          incoming.on('end', () => resolver(incoming.statusCode ?? 0));
        },
      );
      outgoing.on('error', reject);
      outgoing.end(JSON.stringify({ status: estado }));
    });
  }

  async function putbajocalificacionregla(
    umbralcalificacion: number | null,
    enabled: unknown = true,
  ): Promise<number> {
    const direccion = app.getHttpServer().address() as AddressInfo;
    return new Promise((resolver, reject) => {
      const outgoing = httpRequest(
        {
          hostname: '127.0.0.1',
          port: direccion.port,
          path: '/api/v1/alerts/rules/LOW_GRADE',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
        (incoming) => {
          incoming.resume();
          incoming.on('end', () => resolver(incoming.statusCode ?? 0));
        },
      );
      outgoing.on('error', reject);
      outgoing.end(
        JSON.stringify({ enabled, severity: 'WARNING', gradeThreshold: umbralcalificacion }),
      );
    });
  }

  it('rejects an unknown alert status over HTTP before calling the use case', async () => {
    await expect(patchestado('CLOSED')).resolves.toBe(400);

    expect(actualizarestado.ejecutar).not.toHaveBeenCalled();
  });

  it('accepts a supported alert status over HTTP', async () => {
    await expect(patchestado('RESOLVED')).resolves.toBe(200);

    expect(actualizarestado.ejecutar).toHaveBeenCalledWith(
      'alert-1',
      'admin-1',
      'RESOLVED',
      expect.any(String),
    );
  });

  it('rejects a null low-grade threshold over HTTP', async () => {
    await expect(putbajocalificacionregla(null)).resolves.toBe(400);

    expect(actualizarregla.ejecutar).not.toHaveBeenCalled();
  });

  it('rejects a string false value instead of converting it to true', async () => {
    await expect(putbajocalificacionregla(45, 'false')).resolves.toBe(400);

    expect(actualizarregla.ejecutar).not.toHaveBeenCalled();
  });
});
