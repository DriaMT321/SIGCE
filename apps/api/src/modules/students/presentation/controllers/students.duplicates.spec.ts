import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import request = require('supertest');
import { servicioprisma } from '../../../../common/database/prisma.service';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import {
  casousoactualizarestudiante,
  casousocrearestudiante,
  casousoeliminarestudiante,
  casousolistarestudiantes,
  casousoobtenerestudiante,
  casousoreemitiractivacionestudiante,
} from '../../application/use-cases/estudiante.use-cases';
import {
  casousocrearreferenciadocumentoestudiante,
  casousolistarreferenciasdocumentosestudiante,
} from '../../application/use-cases/referenciadocumentoestudiante.use-cases';
import { StudentsController } from './students.controller';

describe('búsqueda previa de estudiantes duplicados', () => {
  let app: INestApplication;
  const buscarcoincidencias = jest.fn().mockResolvedValue([]);
  const count = jest.fn().mockResolvedValue(1);

  beforeAll(async () => {
    const dependencias = [
      casousoobtenerestudiante, casousocrearestudiante, casousoreemitiractivacionestudiante,
      casousoactualizarestudiante, casousoeliminarestudiante,
      casousolistarreferenciasdocumentosestudiante, casousocrearreferenciadocumentoestudiante,
    ];
    const modulo = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        { provide: casousolistarestudiantes, useValue: { buscarcoincidencias } },
        { provide: servicioprisma, useValue: { rolePermission: { count } } },
        ...dependencias.map((provide) => ({ provide, useValue: {} })),
      ],
    })
      .overrideGuard(guardiaautenticacionjwt)
      .useValue({ canActivate: (contexto) => {
        const req = contexto.switchToHttp().getRequest();
        req.user = { id: 'user-1', role: req.headers['x-test-role'] };
        return true;
      } })
      .compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => app.close());
  beforeEach(() => { buscarcoincidencias.mockClear(); count.mockReset().mockResolvedValue(1); });

  it('permite consultar a administración con permiso de registro', async () => {
    await request(app.getHttpServer()).post('/students/duplicates')
      .set('x-test-role', 'ADMINISTRATIVE').send({ rude: 'R1', ci: '1234567' }).expect(200);
    expect(buscarcoincidencias).toHaveBeenCalledWith({ rude: 'R1', ci: '1234567' });
    expect(count).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ permission: { name: { in: ['students:create'] } } }),
    }));
  });

  it('niega la búsqueda a docentes y a administración sin permiso', async () => {
    await request(app.getHttpServer()).post('/students/duplicates')
      .set('x-test-role', 'TEACHER').send({ rude: 'R1' }).expect(403);
    count.mockResolvedValueOnce(0);
    await request(app.getHttpServer()).post('/students/duplicates')
      .set('x-test-role', 'ADMINISTRATIVE').send({ rude: 'R1' }).expect(403);
    expect(buscarcoincidencias).not.toHaveBeenCalled();
  });

  it('rechaza identificadores que exceden los límites', async () => {
    await request(app.getHttpServer()).post('/students/duplicates')
      .set('x-test-role', 'ADMINISTRATIVE').send({ rude: 'R'.repeat(41) }).expect(400);
    expect(buscarcoincidencias).not.toHaveBeenCalled();
  });
});
