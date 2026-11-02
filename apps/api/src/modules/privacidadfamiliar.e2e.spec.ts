import { INestApplication, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AddressInfo } from 'node:net';
import { rolusuario } from '@academic/shared-types';
import { guardiaautenticacionjwt } from '../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../common/guards/permisos.guard';
import { StudentsController } from './students/presentation/controllers/students.controller';
import { GradesController } from './grades/presentation/controllers/grades.controller';
import { AttendanceController } from './attendance/presentation/controllers/attendance.controller';
import { casousocrearestudiante, casousoeliminarestudiante, casousoobtenerestudiante, casousolistarestudiantes, casousoreemitiractivacionestudiante, casousoactualizarestudiante } from './students/application/use-cases/estudiante.use-cases';
import { casousocrearreferenciadocumentoestudiante, casousolistarreferenciasdocumentosestudiante } from './students/application/use-cases/referenciadocumentoestudiante.use-cases';
import { registrarcalificacion, casousocrearcalificacionesmasivas, casousolistarcalificaciones, casousoactualizarcalificacion, casousopublicarcalificaciones } from './grades/application/use-cases/calificacion.use-cases';
import { casousodecidircorreccioncalificacion, casousolistarcorreccionescalificacion, casousosolicitarcorreccioncalificacion } from './grades/application/use-cases/calificacioncorreccion.use-cases';
import { casousocrearasistencia, casousolistarasistencias, casousoactualizarasistencia } from './attendance/application/use-cases/asistencia.use-cases';

describe('Control HTTP familiar en datos académicos', () => {
  let app: INestApplication;
  let actor = { id: 'familiar', role: rolusuario.PARENT };
  const listarcalificaciones = { ejecutar: jest.fn().mockResolvedValue({ items: [], total: 0 }) };
  const listarattendance = { ejecutar: jest.fn().mockResolvedValue({ items: [], total: 0 }) };
  const obtenerestudiante = { ejecutar: jest.fn(async (id: string, actorId?: string) => {
    if (actorId === 'familiar' && id === 'vinculado') return { id };
    throw new NotFoundException();
  }) };
  const mutacion = { ejecutar: jest.fn() };
  const tokens = [casousolistarestudiantes, casousocrearestudiante, casousoeliminarestudiante, casousoreemitiractivacionestudiante, casousoactualizarestudiante, casousocrearreferenciadocumentoestudiante, casousolistarreferenciasdocumentosestudiante, registrarcalificacion, casousocrearcalificacionesmasivas, casousoactualizarcalificacion, casousopublicarcalificaciones, casousodecidircorreccioncalificacion, casousolistarcorreccionescalificacion, casousosolicitarcorreccioncalificacion, casousocrearasistencia, casousoactualizarasistencia];
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ controllers: [StudentsController, GradesController, AttendanceController], providers: [
      ...tokens.map((provide) => ({ provide, useValue: mutacion })),
      { provide: casousoobtenerestudiante, useValue: obtenerestudiante },
      { provide: casousolistarcalificaciones, useValue: listarcalificaciones },
      { provide: casousolistarasistencias, useValue: listarattendance },
    ] }).overrideGuard(guardiaautenticacionjwt).useValue({ canActivate: (context: ExecutionContext) => { context.switchToHttp().getRequest().user = actor; return true; } })
      .overrideGuard(guardiapermisos).useValue({ canActivate: () => true }).compile();
    app = mod.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.listen(0, '127.0.0.1');
  });
  afterAll(async () => app.close());
  beforeEach(() => { actor = { id: 'familiar', role: rolusuario.PARENT }; jest.clearAllMocks(); });
  async function request(path: string, method = 'GET') {
    const port = (app.getHttpServer().address() as AddressInfo).port;
    return fetch(`http://127.0.0.1:${port}/api/v1${path}`, { method, headers: { 'Content-Type': 'application/json' }, ...(method !== 'GET' ? { body: '{}' } : {}) });
  }
  it('transmite el identificador familiar para filtrar notas y asistencia', async () => {
    expect((await request('/grades?studentId=ajeno')).status).toBe(200);
    expect(listarcalificaciones.ejecutar).toHaveBeenCalledWith(expect.objectContaining({ parentUserId: 'familiar', studentId: 'ajeno' }));
    expect((await request('/attendance?studentId=ajeno')).status).toBe(200);
    expect(listarattendance.ejecutar).toHaveBeenCalledWith(expect.objectContaining({ parentUserId: 'familiar', studentId: 'ajeno' }));
  });
  it('permite obtener al vinculado y oculta al ajeno', async () => {
    expect((await request('/students/vinculado')).status).toBe(200);
    expect((await request('/students/ajeno')).status).toBe(404);
    expect(obtenerestudiante.ejecutar).toHaveBeenCalledWith('ajeno', 'familiar', undefined);
  });
  it.each([['/students/ajeno', 'PATCH'], ['/students/ajeno', 'DELETE'], ['/grades', 'POST'], ['/grades/ajena', 'PATCH'], ['/attendance', 'POST'], ['/attendance/ajena', 'PATCH']])('rechaza escritura familiar: %s %s', async (path, method) => {
    expect((await request(path, method)).status).toBe(403);
    expect(mutacion.ejecutar).not.toHaveBeenCalled();
  });
  it('también limita la lectura del estudiante a su propia identidad', async () => {
    actor = { id: 'alumno', role: rolusuario.STUDENT };
    expect((await request('/grades?studentId=ajeno')).status).toBe(200);
    expect(listarcalificaciones.ejecutar).toHaveBeenCalledWith(expect.objectContaining({ parentUserId: 'alumno', studentId: 'ajeno' }));
    expect((await request('/attendance', 'POST')).status).toBe(403);
  });
});
