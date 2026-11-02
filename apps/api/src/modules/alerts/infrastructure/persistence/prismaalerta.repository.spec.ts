import { AlertRuleType } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { repositorioalertaprisma } from './prismaalerta.repository';

describe('PrismaAlertRepository early warning reconciliation', () => {
  it('consulta y agrupa faltas y atrasos con ventanas independientes', async () => {
    const curso = { name: '6to A', teacherSubjects: [{ teacher: { userId: 'teacher-1' } }] };
    const attendance = { findMany: jest.fn().mockResolvedValue([
      { courseId: 'course-1', status: 'ABSENT', course: curso },
      { courseId: 'course-1', status: 'LATE', course: curso },
      { courseId: 'course-1', status: 'LATE', course: curso },
    ]) };
    const prisma = {
      student: { findFirst: jest.fn().mockResolvedValue({ id: 's1', firstName: 'Ana', lastName: 'Pérez', userId: null, enrollments: [{ courseId: 'course-1' }], studentParents: [] }) },
      grade: { findMany: jest.fn().mockResolvedValue([]) }, attendance,
      user: { findMany: jest.fn().mockResolvedValue([{ id: 'director-1' }]) },
    } as unknown as servicioprisma;
    const repositorio = new repositorioalertaprisma(prisma, new contextoidentificadorcorrelacionlocal());
    const desde = new Date('2026-10-01T00:00:00Z');
    const desdeatrasos = new Date('2026-10-10T00:00:00Z');
    const mediante = new Date('2026-10-20T23:59:59Z');
    const resultado = await repositorio.obtenerinstantaneaadvertenciaestudiante('s1', desde, mediante, desdeatrasos);
    expect(attendance.findMany.mock.calls[0][0].where.OR).toEqual([
      { status: 'ABSENT', date: { gte: desde, lte: mediante } },
      { status: 'LATE', date: { gte: desdeatrasos, lte: mediante } },
    ]);
    expect(resultado?.absences[0].count).toBe(1);
    expect(resultado?.lateness?.[0].count).toBe(2);
    expect(resultado?.administrativeUserIds).toEqual(['director-1']);
  });

  it('claims pending evaluations with a recoverable lock and persists completion or retry', async () => {
    const claimed = [{ id: 'job-1', studentId: 'student-1', attempts: 1 }];
    const tx = { $queryRaw: jest.fn().mockResolvedValue(claimed) };
    const outbox = {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
      alertEvaluationOutbox: outbox,
    } as unknown as servicioprisma;
    const repositorio = new repositorioalertaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );
    const ahora = new Date('2026-10-23T12:00:00.000Z');

    await expect(
      repositorio.reclamarevaluacionespendientes(20, ahora, new Date('2026-10-23T11:55:00.000Z')),
    ).resolves.toEqual(claimed);
    await repositorio.completarevaluacionpendiente('job-1');
    await repositorio.reintentarevaluacionpendiente('job-1', 2, 'fallo temporal', ahora);

    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(outbox.deleteMany).toHaveBeenCalledWith({ where: { id: 'job-1' } });
    expect(outbox.updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: 'job-1' },
      data: {
        attempts: 2,
        lastError: 'fallo temporal',
        availableAt: ahora,
        lockedAt: null,
      },
    });
  });

  it('does not automatically resolve existing alerts when a warning is no longer active', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      alert: {
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioalertaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.conciliaralertastempranas('student-1', AlertRuleType.LOW_GRADE, []);

    expect(tx.alert.updateMany).not.toHaveBeenCalled();
  });

  it('does not reopen an alert after a person has resolved it', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ status: 'RESOLVED' }]),
      alert: {
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioalertaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.conciliaralertastempranas('student-1', AlertRuleType.LOW_GRADE, [
      {
        userId: 'parent-1',
        studentId: 'student-1',
        ruleKey: 'LOW_GRADE',
        deduplicationKey: 'LOW_GRADE:grade-1',
        title: 'Alerta académica',
        message: 'Revisar la calificación.',
        severity: 'WARNING',
        metadata: {},
      },
    ]);

    expect(tx.alert.upsert).not.toHaveBeenCalled();
  });

  it('preserves read and in-progress state while refreshing an active warning', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ status: 'IN_PROGRESS' }]),
      alert: {
        upsert: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioalertaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.conciliaralertastempranas('student-1', AlertRuleType.LOW_GRADE, [
      {
        userId: 'parent-1',
        studentId: 'student-1',
        ruleKey: 'LOW_GRADE',
        deduplicationKey: 'LOW_GRADE:grade-1',
        title: 'Alerta académica',
        message: 'Revisar la calificación.',
        severity: 'WARNING',
        metadata: {},
      },
    ]);

    const upsertcall = tx.alert.upsert.mock.calls[0][0];
    expect(upsertcall.update).not.toHaveProperty('status');
    expect(upsertcall.update).not.toHaveProperty('isRead');
  });
});

describe('PrismaAlertRepository audited mutations', () => {
  function configuracion() {
    const alerta = {
      id: 'alert-1',
      userId: 'parent-1',
      studentId: 'student-1',
      title: 'Aviso',
      message: 'Revisar',
      severity: 'WARNING',
      status: 'OPEN',
      isRead: false,
      link: null,
      metadata: {},
      createdAt: new Date('2026-10-22T00:00:00Z'),
    };
    const regla = {
      key: 'LOW_GRADE',
      enabled: true,
      severity: 'WARNING',
      gradeThreshold: 51,
      absenceThreshold: null,
      absenceWindowDays: null,
      updatedAt: new Date('2026-10-22T00:00:00Z'),
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'alert-1' }]),
      alert: {
        findFirst: jest.fn().mockResolvedValue(alerta),
        update: jest.fn().mockResolvedValue({ ...alerta, isRead: true, status: 'RESOLVED' }),
      },
      alertRule: {
        findUnique: jest.fn().mockResolvedValue(regla),
        upsert: jest.fn().mockResolvedValue(regla),
      },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    return {
      repository: new repositorioalertaprisma(prisma, new contextoidentificadorcorrelacionlocal()),
      tx,
    };
  }

  it('updates alert state and records the acting user in the same transaction', async () => {
    const { repository: repositorio, tx } = configuracion();
    await repositorio.actualizarestado('alert-1', 'parent-1', 'RESOLVED', {
      userId: 'parent-1',
      ipAddress: '127.0.0.1',
    });
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'parent-1',
          entity: 'Alert',
          entityId: 'alert-1',
          studentIds: ['student-1'],
          previousValue: { status: 'OPEN' },
          newValue: { status: 'RESOLVED' },
        }),
      }),
    );
  });

  it('records read-state changes in the same transaction', async () => {
    const { repository: repositorio, tx } = configuracion();
    await repositorio.marcarleida('alert-1', 'parent-1', { userId: 'parent-1' });
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entity: 'Alert',
          previousValue: { isRead: false },
          newValue: { isRead: true },
        }),
      }),
    );
  });

  it('records rule changes with actor and before/after values in the same transaction', async () => {
    const { repository: repositorio, tx } = configuracion();
    await repositorio.actualizarregla(
      { key: 'LOW_GRADE', enabled: true, severity: 'WARNING', gradeThreshold: 45 },
      { userId: 'admin-1' },
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'admin-1',
          action: 'UPDATE',
          entity: 'AlertRule',
          entityId: 'LOW_GRADE',
          previousValue: expect.objectContaining({ gradeThreshold: 51 }),
        }),
      }),
    );
  });
});
