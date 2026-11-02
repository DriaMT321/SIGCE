import { ConflictException } from '@nestjs/common';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositorioperiodoacademicoprisma } from './prismaperiodoacademico.repository';

describe('PrismaAcademicPeriodRepository', () => {
  const anterior = {
    id: 'period-1',
    name: 'Primer trimestre',
    number: 1,
    academicYearId: 'year-1',
    startDate: new Date('2026-02-01T00:00:00.000Z'),
    endDate: new Date('2026-04-30T00:00:00.000Z'),
    isClosed: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
  const actualizado = {
    ...anterior,
    isClosed: true,
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    academicYear: { id: 'year-1', year: 2026, name: 'Gestión 2026' },
  };

  function crearrepositorio(actualcalificacioncantidad = 4) {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'period-1' }]),
      academicPeriod: {
        findUnique: jest.fn().mockResolvedValue(anterior),
        update: jest.fn().mockResolvedValue(actualizado),
      },
      grade: { count: jest.fn().mockResolvedValue(actualcalificacioncantidad) },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    return { repository: new repositorioperiodoacademicoprisma(prisma), tx };
  }

  it('confirma el resumen, cierra y audita dentro de una transacción', async () => {
    const { repository: repositorio, tx } = crearrepositorio();

    await repositorio.actualizar(
      'period-1',
      { isClosed: true },
      {
        userId: 'admin-1',
        ipAddress: '127.0.0.1',
        correlationId: 'corr-period-1',
        expectedGradeCount: 4,
      },
    );

    expect(tx.$queryRaw).toHaveBeenCalled();
    expect(tx.academicPeriod.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'period-1' },
        data: { isClosed: true },
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entity: 'AcademicPeriod',
          entityId: 'period-1',
          correlationId: 'corr-period-1',
          previousValue: expect.objectContaining({ isClosed: false }),
          newValue: expect.objectContaining({ isClosed: true }),
        }),
      }),
    );
  });

  it('rechaza el cierre cuando el recuento cambió después del resumen', async () => {
    const { repository: repositorio, tx } = crearrepositorio(5);

    await expect(
      repositorio.actualizar(
        'period-1',
        { isClosed: true },
        {
          userId: 'admin-1',
          expectedGradeCount: 4,
        },
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(tx.academicPeriod.update).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});
