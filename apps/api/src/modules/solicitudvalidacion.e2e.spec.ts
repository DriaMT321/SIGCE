import { ValidationPipe } from '@nestjs/common';
import type { INestApplication, ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { guardiaautenticacionjwt } from '../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../common/guards/roles.guard';
import { controladoranuncios } from './announcements/presentation/controllers/anuncios.controller';
import {
  casousocrearanuncio,
  casousoeliminaranuncio,
  casousolistaranuncios,
} from './announcements/application/anuncio.use-cases';
import { controladorcurriculo } from './curriculum/presentation/controllers/curriculo.controller';
import { serviciocurriculo } from './curriculum/application/curriculo.service';
import { controladorhorarios } from './schedules/presentation/controllers/horarios.controller';
import { serviciohorarios } from './schedules/application/horarios.service';
import { controladorfamiliares } from './parents/presentation/controllers/padres.controller';
import {
  casousoactualizarfamiliar,
  casousocrearfamiliar,
  casousoeliminarfamiliar,
  casousolistarfamiliares,
  casousoactualizarvinculofamiliar,
  casousoeliminarvinculofamiliar,
} from './parents/application/use-cases/padre.use-cases';
import { controladordocentes } from './teachers/presentation/controllers/docentes.controller';
import {
  casousoactualizardocente,
  casousocreardocente,
  casousoeliminardocente,
  casousolistardocentes,
} from './teachers/application/use-cases/docente.use-cases';
import { guardiapermisos } from '../common/guards/permisos.guard';

describe('request DTO HTTP validation', () => {
  let app: INestApplication;
  const createAnnouncement = { ejecutar: jest.fn().mockResolvedValue({ id: 'announcement-1' }) };
  const curriculum = {
    listar: jest.fn(),
    obtenerestadisticas: jest.fn(),
    actualizarprogreso: jest.fn().mockResolvedValue({ id: 'topic-1' }),
    crear: jest.fn().mockResolvedValue({ id: 'topic-1' }),
  };
  const schedules = {
    listar: jest.fn(),
    obtenermihorario: jest.fn(),
    obtenerhorariocurso: jest.fn(),
    obtenerhorariodocente: jest.fn(),
    insertaroactualizar: jest.fn().mockResolvedValue({ id: 'schedule-1' }),
    generarautomaticamente: jest.fn(),
    crear: jest.fn(),
    eliminar: jest.fn(),
  };
  const actualizarFamiliar = { ejecutar: jest.fn() };
  const actualizarDocente = { ejecutar: jest.fn() };
  const authenticatedUser = {
    id: 'admin-1',
    role: rolusuario.ADMINISTRATIVE,
  } as usuarioautenticado;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [
        controladoranuncios,
        controladorcurriculo,
        controladorhorarios,
        controladorfamiliares,
        controladordocentes,
      ],
      providers: [
        { provide: casousolistaranuncios, useValue: { ejecutar: jest.fn() } },
        { provide: casousocrearanuncio, useValue: createAnnouncement },
        { provide: casousoeliminaranuncio, useValue: { ejecutar: jest.fn() } },
        { provide: serviciocurriculo, useValue: curriculum },
        { provide: serviciohorarios, useValue: schedules },
        { provide: casousoactualizarfamiliar, useValue: actualizarFamiliar },
        { provide: casousocrearfamiliar, useValue: { ejecutar: jest.fn() } },
        { provide: casousoeliminarfamiliar, useValue: { ejecutar: jest.fn() } },
        { provide: casousolistarfamiliares, useValue: { ejecutar: jest.fn() } },
        { provide: casousoactualizarvinculofamiliar, useValue: { ejecutar: jest.fn() } },
        { provide: casousoeliminarvinculofamiliar, useValue: { ejecutar: jest.fn() } },
        { provide: casousoactualizardocente, useValue: actualizarDocente },
        { provide: casousocreardocente, useValue: { ejecutar: jest.fn() } },
        { provide: casousoeliminardocente, useValue: { ejecutar: jest.fn() } },
        { provide: casousolistardocentes, useValue: { ejecutar: jest.fn() } },
      ],
    })
      .overrideGuard(guardiaautenticacionjwt)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = authenticatedUser;
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
    createAnnouncement.ejecutar.mockClear();
    curriculum.actualizarprogreso.mockClear();
    curriculum.crear.mockClear();
    schedules.insertaroactualizar.mockClear();
    actualizarFamiliar.ejecutar.mockClear();
    actualizarDocente.ejecutar.mockClear();
  });

  async function send(method: string, path: string, body: unknown): Promise<number> {
    const address = app.getHttpServer().address() as AddressInfo;
    return new Promise((resolve, reject) => {
      const outgoing = httpRequest(
        {
          hostname: '127.0.0.1',
          port: address.port,
          path: `/api/v1${path}`,
          method,
          headers: { 'Content-Type': 'application/json' },
        },
        (incoming) => {
          incoming.resume();
          incoming.on('end', () => resolve(incoming.statusCode ?? 0));
        },
      );
      outgoing.on('error', reject);
      outgoing.end(JSON.stringify(body));
    });
  }

  it('rejects a recipient field that conflicts with an announcement scope', async () => {
    await expect(
      send('POST', '/announcements', {
        title: 'Reunión',
        content: 'Reunión informativa',
        urgency: 'MEDIA',
        scope: 'COURSE',
        targetCourseId: '11111111-1111-4111-8111-111111111111',
        targetParentId: '22222222-2222-4222-8222-222222222222',
      }),
    ).resolves.toBe(400);

    expect(createAnnouncement.ejecutar).not.toHaveBeenCalled();
  });

  it('rejects object values in announcement text fields', async () => {
    await expect(
      send('POST', '/announcements', {
        title: { text: 'Reunión' },
        content: 'Reunión informativa',
        urgency: 'MEDIA',
        scope: 'ALL_COURSES',
      }),
    ).resolves.toBe(400);

    expect(createAnnouncement.ejecutar).not.toHaveBeenCalled();
  });

  it('accepts a course announcement with only its matching recipient', async () => {
    await expect(
      send('POST', '/announcements', {
        title: 'Reunión',
        content: 'Reunión informativa',
        urgency: 'MEDIA',
        scope: 'COURSE',
        targetCourseId: '11111111-1111-4111-8111-111111111111',
      }),
    ).resolves.toBe(201);

    expect(createAnnouncement.ejecutar).toHaveBeenCalledWith(
      authenticatedUser,
      expect.objectContaining({ scope: 'COURSE' }),
    );
  });

  it('rejects empty and null curriculum progress patches', async () => {
    await expect(send('PATCH', '/curriculum/topic-1/progress', {})).resolves.toBe(400);
    await expect(
      send('PATCH', '/curriculum/topic-1/progress', { progressPercent: null }),
    ).resolves.toBe(400);
    await expect(send('PATCH', '/curriculum/topic-1/progress', { status: null })).resolves.toBe(
      400,
    );

    expect(curriculum.actualizarprogreso).not.toHaveBeenCalled();
  });

  it('rejects whitespace-only curriculum topic titles', async () => {
    await expect(
      send('POST', '/curriculum', {
        subjectId: '11111111-1111-4111-8111-111111111111',
        periodNumber: 1,
        unitTitle: '   ',
        title: 'Contenido',
      }),
    ).resolves.toBe(400);

    expect(curriculum.crear).not.toHaveBeenCalled();
  });

  it('rejects schedules whose end time is not after the start time', async () => {
    await expect(
      send('POST', '/schedules/upsert', {
        courseId: '11111111-1111-4111-8111-111111111111',
        subjectId: '22222222-2222-4222-8222-222222222222',
        teacherId: '33333333-3333-4333-8333-333333333333',
        dayOfWeek: 'LUNES',
        startTime: '10:00',
        endTime: '09:45',
        periodIndex: 1,
      }),
    ).resolves.toBe(400);

    expect(schedules.insertaroactualizar).not.toHaveBeenCalled();
  });

  it.each([
    ['/parents/parent-1', actualizarFamiliar],
    ['/teachers/teacher-1', actualizarDocente],
  ])('rejects password changes through profile update at %s', async (path, casoUso) => {
    await expect(
      send('PATCH', path, { password: 'new-password-should-use-reset-flow' }),
    ).resolves.toBe(400);

    expect(casoUso.ejecutar).not.toHaveBeenCalled();
  });
});
