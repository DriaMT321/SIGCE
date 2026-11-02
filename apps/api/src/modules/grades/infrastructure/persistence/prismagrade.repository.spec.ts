import { ConflictException, ForbiddenException } from '@nestjs/common';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { prismagraderepository } from './prismagrade.repository';

describe('PrismaGradeRepository transactional writes', () => {
  const anterior = {
    id: 'grade-1',
    enrollmentId: 'enrollment-1',
    studentId: 'student-1',
    subjectId: 'subject-1',
    periodId: 'period-1',
    value: 70,
    remarks: null,
    publishedAt: null,
    publishedById: null,
    updatedAt: new Date('2026-04-01T00:00:00.000Z'),
  };
  const actualizado = {
    ...anterior,
    value: 80,
    updatedAt: new Date('2026-04-02T00:00:00.000Z'),
    student: { id: 'student-1', rude: 'RUDE-1', firstName: 'Ana', lastName: 'Pérez' },
    subject: { id: 'subject-1', code: 'MAT', name: 'Matemática' },
    period: { id: 'period-1', name: 'Primer trimestre', number: 1 },
  };

  function crearrepositorio(escerrado = false, estudianteactivo = true) {
    const tx = {
      $queryRaw: jest.fn().mockImplementation((consulta: TemplateStringsArray) => {
        const sql = consulta.join(' ');
        if (sql.includes('FROM "grades"')) {
          return Promise.resolve([{ id: 'grade-1' }]);
        }
        if (sql.includes('academic_periods')) {
          return Promise.resolve([{ isClosed: escerrado, academicYearId: 'year-1' }]);
        }
        if (sql.includes('enrollments')) {
          return Promise.resolve([
            {
              courseId: 'course-1',
              academicYearId: 'year-1',
              status: 'ACTIVE',
              studentId: 'student-1',
            },
          ]);
        }
        if (sql.includes('FROM "students"')) {
          return Promise.resolve(estudianteactivo ? [{ id: 'student-1' }] : []);
        }
        return Promise.resolve([]);
      }),
      grade: {
        findUnique: jest.fn().mockResolvedValue(anterior),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue(actualizado),
        update: jest.fn().mockResolvedValue(actualizado),
        upsert: jest.fn().mockResolvedValue(actualizado),
      },
      alertEvaluationOutbox: {
        create: jest.fn().mockResolvedValue({}),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    return { repositorio: new prismagraderepository(prisma), tx };
  }

  it('bloquea el período y escribe la nota con auditoría en la misma transacción', async () => {
    const { repositorio, tx } = crearrepositorio();

    const resultado = await repositorio.actualizar(
      'grade-1',
      { value: 80 },
      {
        userId: 'teacher-1',
        correlationId: 'corr-grade-1',
        reason: 'Acta revisada',
      },
      {},
    );

    expect(resultado.value).toBe(80);
    expect(tx.$queryRaw).toHaveBeenCalled();
    const periodobloqueocall = tx.$queryRaw.mock.calls.findIndex((call) =>
      call[0].join(' ').includes('academic_periods'),
    );
    const calificacionbloqueocall = tx.$queryRaw.mock.calls.findIndex((call) =>
      call[0].join(' ').includes('FROM "grades"'),
    );
    expect(periodobloqueocall).toBeGreaterThanOrEqual(0);
    expect(calificacionbloqueocall).toBeGreaterThan(periodobloqueocall);
    expect(tx.$queryRaw.mock.invocationCallOrder[calificacionbloqueocall]).toBeLessThan(
      tx.grade.findUnique.mock.invocationCallOrder[1],
    );
    expect(tx.alertEvaluationOutbox.create).toHaveBeenCalledWith({
      data: { studentId: 'student-1' },
    });
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entity: 'Grade',
          entityId: 'grade-1',
          correlationId: 'corr-grade-1',
          previousValue: { value: 70, remarks: null },
          newValue: { value: 80, remarks: null },
        }),
      }),
    );
  });

  it('enqueues durable alert reevaluation when creating a grade', async () => {
    const { repositorio, tx } = crearrepositorio();

    await repositorio.crear(
      {
        enrollmentId: 'enrollment-1',
        studentId: 'student-1',
        subjectId: 'subject-1',
        periodId: 'period-1',
        value: 80,
      },
      { userId: 'teacher-1' },
      {},
    );

    expect(tx.alertEvaluationOutbox.create).toHaveBeenCalledWith({
      data: { studentId: 'student-1' },
    });
  });

  it('rechaza la escritura si el período ya está cerrado', async () => {
    const { repositorio, tx } = crearrepositorio(true);

    await expect(
      repositorio.actualizar('grade-1', { value: 80 }, { userId: 'teacher-1' }, {}),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(tx.grade.update).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('rechaza crear calificaciones si el estudiante fue eliminado', async () => {
    const { repositorio, tx } = crearrepositorio(false, false);

    await expect(
      repositorio.crear(
        {
          enrollmentId: 'enrollment-1',
          studentId: 'student-1',
          subjectId: 'subject-1',
          periodId: 'period-1',
          value: 80,
        },
        { userId: 'admin-1' },
        {},
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(tx.grade.create).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('revalida la asignación docente dentro de la transacción de escritura', async () => {
    const { repositorio, tx } = crearrepositorio();
    tx.$queryRaw.mockImplementation((consulta: TemplateStringsArray) => {
      const sql = consulta.join(' ');
      if (sql.includes('academic_periods')) {
        return Promise.resolve([{ isClosed: false, academicYearId: 'year-1' }]);
      }
      if (sql.includes('enrollments')) {
        return Promise.resolve([
          {
            courseId: 'course-1',
            academicYearId: 'year-1',
            status: 'ACTIVE',
            studentId: 'student-1',
          },
        ]);
      }
      if (sql.includes('FROM "students"')) {
        return Promise.resolve([{ id: 'student-1' }]);
      }
      return Promise.resolve([]);
    });

    await expect(
      repositorio.crear(
        {
          enrollmentId: 'enrollment-1',
          studentId: 'student-1',
          subjectId: 'subject-1',
          periodId: 'period-1',
          value: 80,
        },
        { userId: 'teacher-1' },
        { teacherUserId: 'teacher-1' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(tx.grade.create).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('enqueues one durable reevaluation per distinct student in a bulk write', async () => {
    const { repositorio, tx } = crearrepositorio();
    const calificacion = {
      enrollmentId: 'enrollment-1',
      studentId: 'student-1',
      subjectId: 'subject-1',
      periodId: 'period-1',
      value: 80,
    };
    await repositorio.insertaroactualizarporlote(
      [calificacion],
      {
        userId: 'teacher-1',
        courseId: 'course-1',
        subjectId: 'subject-1',
        periodId: 'period-1',
        studentIds: ['student-1'],
      },
      {},
    );

    expect(tx.alertEvaluationOutbox.createMany).toHaveBeenCalledWith({
      data: [{ studentId: 'student-1' }],
    });
  });
});
