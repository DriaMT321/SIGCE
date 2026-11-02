import { GradeCorrectionStatus } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositoriocorreccioncalificacionprisma } from './prismacorreccioncalificacion.repository';

describe('PrismaGradeCorrectionRepository alert outbox', () => {
  function configuracion() {
    const solicitud = {
      id: 'correction-1',
      gradeId: 'grade-1',
      requestedById: 'teacher-requester',
      decidedById: null,
      previousValue: 70,
      proposedValue: 80,
      reason: 'Revisión de acta',
      evidenceReference: 'acta-1',
      decisionReason: null,
      status: GradeCorrectionStatus.PENDING,
      grade: {
        id: 'grade-1',
        value: 70,
        studentId: 'student-1',
        periodId: 'period-1',
        period: { isClosed: true },
      },
    };
    const tx = {
      $queryRaw: jest.fn().mockImplementation((consulta: TemplateStringsArray) => {
        const sql = consulta.join(' ');
        if (sql.includes('academic_periods')) return Promise.resolve([{ isClosed: true }]);
        if (sql.includes('FROM "grades"')) return Promise.resolve([{ id: 'grade-1' }]);
        return Promise.resolve([]);
      }),
      gradeCorrectionRequest: {
        findUnique: jest.fn().mockResolvedValue(solicitud),
        findUniqueOrThrow: jest.fn().mockResolvedValue(solicitud),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      grade: { update: jest.fn().mockResolvedValue({}) },
      alertEvaluationOutbox: { create: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    return { repositorio: new repositoriocorreccioncalificacionprisma(prisma), tx };
  }

  it('enqueues reevaluation atomically when a correction is approved', async () => {
    const { repositorio, tx } = configuracion();

    await repositorio.decidir({
      requestId: 'correction-1',
      decidedById: 'administrator-1',
      decision: 'EXECUTED',
      decisionReason: 'Aprobada',
    });

    expect(tx.grade.update).toHaveBeenCalledWith({
      where: { id: 'grade-1' },
      data: { value: 80 },
    });
    expect(tx.alertEvaluationOutbox.create).toHaveBeenCalledWith({
      data: { studentId: 'student-1' },
    });
  });

  it('does not enqueue reevaluation when a correction is rejected', async () => {
    const { repositorio, tx } = configuracion();

    await repositorio.decidir({
      requestId: 'correction-1',
      decidedById: 'administrator-1',
      decision: 'REJECTED',
      decisionReason: 'Evidencia insuficiente',
    });

    expect(tx.grade.update).not.toHaveBeenCalled();
    expect(tx.alertEvaluationOutbox.create).not.toHaveBeenCalled();
  });

  it('rechecks the grade after locking it before approving a stale correction', async () => {
    const { repositorio, tx } = configuracion();
    tx.gradeCorrectionRequest.findUnique
      .mockResolvedValueOnce({
        ...{
          id: 'correction-1',
          gradeId: 'grade-1',
          requestedById: 'teacher-requester',
          decidedById: null,
          previousValue: 70,
          proposedValue: 80,
          reason: 'Revisión de acta',
          evidenceReference: 'acta-1',
          decisionReason: null,
          status: GradeCorrectionStatus.PENDING,
          grade: {
            id: 'grade-1',
            value: 70,
            studentId: 'student-1',
            periodId: 'period-1',
            period: { isClosed: true },
          },
        },
      })
      .mockResolvedValueOnce({
        id: 'correction-1',
        gradeId: 'grade-1',
        requestedById: 'teacher-requester',
        decidedById: null,
        previousValue: 70,
        proposedValue: 80,
        reason: 'Revisión de acta',
        evidenceReference: 'acta-1',
        decisionReason: null,
        status: GradeCorrectionStatus.PENDING,
        grade: {
          id: 'grade-1',
          value: 75,
          studentId: 'student-1',
          periodId: 'period-1',
          period: { isClosed: true },
        },
      });

    await expect(
      repositorio.decidir({
        requestId: 'correction-1',
        decidedById: 'administrator-1',
        decision: 'EXECUTED',
        decisionReason: 'Aprobada',
      }),
    ).rejects.toThrow('La calificación cambió después de crear la solicitud');

    expect(tx.grade.update).not.toHaveBeenCalled();
    expect(tx.gradeCorrectionRequest.updateMany).not.toHaveBeenCalled();
    expect(tx.alertEvaluationOutbox.create).not.toHaveBeenCalled();
  });
});
