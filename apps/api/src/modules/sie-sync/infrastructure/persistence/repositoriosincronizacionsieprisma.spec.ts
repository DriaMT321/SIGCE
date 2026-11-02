import { servicioprisma } from '../../../../common/database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { repositoriosincronizacionsieprisma } from './repositoriosincronizacionsieprisma';

describe('Repositoriosincronizacionsieprisma', () => {
  it('resume calificaciones elegibles y registra confirmación antes de encolarlas', async () => {
    const calificaciones = [
      {
        id: 'grade-1',
        studentId: 'student-1',
        subjectId: 'subject-1',
        periodId: 'period-1',
        value: 91,
        student: { rude: 'RUDE-1', ci: 'CI-1' },
        subject: { code: 'MAT' },
        period: { number: 1, academicYear: { year: 2026 } },
        enrollment: { course: { id: 'course-1', name: 'Quinto A' } },
      },
      {
        id: 'grade-2',
        studentId: 'student-2',
        subjectId: 'subject-2',
        periodId: 'period-1',
        value: 73,
        student: { rude: 'RUDE-2', ci: 'CI-2' },
        subject: { code: 'LEN' },
        period: { number: 1, academicYear: { year: 2026 } },
        enrollment: { course: { id: 'course-1', name: 'Quinto A' } },
      },
    ];
    const elementos = [
      { id: 'item-2', studentId: 'student-2', subjectId: 'subject-2', periodId: 'period-1' },
      { id: 'item-1', studentId: 'student-1', subjectId: 'subject-1', periodId: 'period-1' },
    ];
    const tx = {
      grade: { findMany: jest.fn().mockResolvedValue(calificaciones) },
      sieSynchronization: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'sync-1', items: elementos }),
      },
      sieSynchronizationItem: { findMany: jest.fn().mockResolvedValue([]) },
      auditLog: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(undefined),
      },
    };
    const prisma = {
      grade: { findMany: jest.fn().mockResolvedValue(calificaciones) },
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);
    const filtros = { academicYearId: 'year-1', periodNumber: 1 };
    const vistaprevia = await repositorio.previsualizardesdecalificaciones(filtros);

    const resultado = await repositorio.creardesdecalificaciones({
      ...filtros,
      requestedById: 'user-1',
      syncType: 'GRADES',
      confirmSend: true,
      expectedFingerprint: vistaprevia.fingerprint,
      expectedGradeCount: vistaprevia.totalGrades,
      idempotencyKey: 'request-key-1',
      correlationId: 'corr-1',
      ipAddress: '127.0.0.1',
    });

    expect(vistaprevia).toEqual(
      expect.objectContaining({
        academicYearId: 'year-1',
        periodNumber: 1,
        totalGrades: 2,
        studentCount: 2,
        courseCount: 1,
        subjectCount: 2,
      }),
    );
    expect(prisma.grade.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          student: { isActive: true, deletedAt: null },
          enrollment: expect.objectContaining({ status: 'ACTIVE' }),
          period: expect.objectContaining({
            number: 1,
            isClosed: true,
            academicYear: { id: 'year-1', isActive: true },
          }),
        }),
      }),
    );
    expect(resultado?.jobs).toEqual([
      expect.objectContaining({
        itemId: 'item-2',
        studentRude: 'RUDE-2',
        subjectCode: 'LEN',
        localGrade: 73,
      }),
      expect.objectContaining({
        itemId: 'item-1',
        studentRude: 'RUDE-1',
        subjectCode: 'MAT',
        localGrade: 91,
      }),
    ]);
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'SYNC_SIE',
          entityId: 'sync-1',
          correlationId: 'corr-1',
          newValue: expect.objectContaining({
            event: 'CONFIRMED_BEFORE_ENQUEUE',
            source: 'LOCAL_SIE_SIMULATION',
            totalGrades: 2,
            fingerprint: vistaprevia.fingerprint,
          }),
        }),
      }),
    );
    expect(tx.sieSynchronization.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ idempotencyKey: 'request-key-1' }),
      }),
    );
    expect(resultado?.reutilizado).toBe(false);
    expect(prisma.$transaction).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ isolationLevel: 'Serializable' }),
    );
  });

  it('rechaza el lote cuando cambian las notas después de la vista previa', async () => {
    const basecalificacion = {
      id: 'grade-1',
      studentId: 'student-1',
      subjectId: 'subject-1',
      periodId: 'period-1',
      value: 91,
      student: { rude: 'RUDE-1', ci: 'CI-1' },
      subject: { code: 'MAT' },
      period: { number: 1, academicYear: { year: 2026 } },
      enrollment: { course: { id: 'course-1', name: 'Quinto A' } },
    };
    const changedcalificacion = { ...basecalificacion, value: 92 };
    const tx = {
      grade: { findMany: jest.fn().mockResolvedValue([changedcalificacion]) },
      sieSynchronization: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn() },
      sieSynchronizationItem: { findMany: jest.fn().mockResolvedValue([]) },
      auditLog: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
    };
    const prisma = {
      grade: { findMany: jest.fn().mockResolvedValue([basecalificacion]) },
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);
    const filtros = { academicYearId: 'year-1', periodNumber: 1 };
    const vistaprevia = await repositorio.previsualizardesdecalificaciones(filtros);

    await expect(
      repositorio.creardesdecalificaciones({
        ...filtros,
        requestedById: 'user-1',
        syncType: 'GRADES',
        confirmSend: true,
        expectedFingerprint: vistaprevia.fingerprint,
        expectedGradeCount: vistaprevia.totalGrades,
        idempotencyKey: 'request-key-2',
      }),
    ).rejects.toThrow('Las calificaciones cambiaron');
    expect(tx.sieSynchronization.create).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('recupera el lote y los trabajos pendientes al repetir la misma clave', async () => {
    const sincronizacion = {
      id: 'sync-1',
      requestedById: 'user-1',
      status: 'QUEUED',
      totalItems: 1,
    };
    const tx = {
      sieSynchronization: { findUnique: jest.fn().mockResolvedValue(sincronizacion) },
      auditLog: {
        findFirst: jest.fn().mockResolvedValue({
          userId: 'user-1',
          correlationId: 'corr-original',
          newValue: {
            event: 'CONFIRMED_BEFORE_ENQUEUE',
            fingerprint: 'f'.repeat(64),
            totalGrades: 1,
          },
        }),
      },
      sieSynchronizationItem: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'item-1',
            synchronizationId: 'sync-1',
            localValue: 85,
            student: { rude: 'RUDE-1' },
            subject: { code: 'MAT' },
            period: { number: 1, academicYear: { year: 2026 } },
          },
        ]),
      },
      grade: { findMany: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.creardesdecalificaciones({
      academicYearId: 'year-1',
      periodNumber: 1,
      requestedById: 'user-1',
      idempotencyKey: 'request-key-1',
      syncType: 'GRADES',
      confirmSend: true,
      expectedFingerprint: 'f'.repeat(64),
      expectedGradeCount: 1,
    });

    expect(resultado).toMatchObject({
      synchronization: { id: 'sync-1', status: 'QUEUED', totalItems: 1 },
      reutilizado: true,
      jobs: [
        {
          itemId: 'item-1',
          studentRude: 'RUDE-1',
          subjectCode: 'MAT',
          localGrade: 85,
          correlationId: 'corr-original',
        },
      ],
    });
    expect(tx.grade.findMany).not.toHaveBeenCalled();
  });

  it('reintenta solo un fallo final elegible y registra motivo, actor y correlación', async () => {
    const elemento = {
      id: 'item-1',
      synchronizationId: 'sync-1',
      studentId: 'student-1',
      subjectId: 'subject-1',
      periodId: 'period-1',
      localValue: 80,
      sieValue: null,
      status: 'FAILED',
      errorMessage: 'Timeout',
      student: { rude: 'RUDE-1', ci: 'CI-1' },
      subject: { code: 'MAT' },
      period: { number: 1, academicYear: { year: 2026, isActive: true } },
      synchronization: {
        requestedById: 'requester-1',
        status: 'FAILED',
        processedItems: 1,
        errorCount: 1,
      },
    };
    const calificacion = {
      value: 85,
      student: { rude: 'RUDE-1', ci: 'CI-1' },
      subject: { code: 'MAT' },
      period: { number: 1, isClosed: true, academicYear: { year: 2026, isActive: true } },
      enrollment: { status: 'ACTIVE', course: { id: 'course-1', name: 'Quinto A' } },
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'item-1' }]),
      sieSynchronizationItem: {
        findUnique: jest.fn().mockResolvedValue(elemento),
        update: jest.fn().mockResolvedValue(undefined),
      },
      grade: { findFirst: jest.fn().mockResolvedValue(calificacion) },
      sieSynchronization: { update: jest.fn().mockResolvedValue(undefined) },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.reintentarelementofallido({
      itemId: 'item-1',
      userId: 'admin-1',
      reason: 'Se corrigió el acceso del simulador.',
      ipAddress: '127.0.0.1',
      correlationId: 'corr-retry-1',
    });

    expect(resultado).toEqual(
      expect.objectContaining({
        synchronizationId: 'sync-1',
        itemId: 'item-1',
        studentRude: 'RUDE-1',
        localGrade: 85,
        correlationId: 'corr-retry-1',
      }),
    );
    expect(tx.sieSynchronizationItem.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'item-1' },
        data: expect.objectContaining({ status: 'QUEUED', localValue: 85, retryCount: 0 }),
      }),
    );
    expect(tx.sieSynchronization.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sync-1' },
        data: expect.objectContaining({
          status: 'QUEUED',
          processedItems: 0,
          errorCount: 0,
          completedAt: null,
        }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'admin-1',
          correlationId: 'corr-retry-1',
          reason: 'Se corrigió el acceso del simulador.',
        }),
      }),
    );
    expect(tx.auditLog.create.mock.calls[0][0].data.newValue).not.toHaveProperty('source');
    expect(tx.grade.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          student: { isActive: true, deletedAt: null },
        }),
      }),
    );
  });

  it('filtra el historial por gestión, período, curso, RUDE y estado', async () => {
    const prisma = {
      sieSynchronization: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      auditLog: { findMany: jest.fn().mockResolvedValue([]) },
      grade: {
        findMany: jest.fn().mockResolvedValue([
          {
            studentId: 'student-1',
            subjectId: 'subject-1',
            periodId: 'period-1',
            enrollment: { academicYear: { year: 2026 } },
            period: { academicYear: { year: 2026 } },
          },
        ]),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    await repositorio.buscartodos(20, 0, {
      academicYear: 2026,
      periodNumber: 2,
      courseName: 'Quinto A',
      studentRude: 'RUDE-1',
      status: 'FAILED',
    });

    expect(prisma.sieSynchronization.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'FAILED',
          items: {
            some: {
              AND: expect.arrayContaining([
                { period: { number: 2, academicYear: { year: 2026 } } },
                { student: { rude: { contains: 'RUDE-1', mode: 'insensitive' } } },
                { OR: [{ studentId: 'student-1', subjectId: 'subject-1', periodId: 'period-1' }] },
              ]),
            },
          },
        }),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: {
          items: {
            include: expect.objectContaining({
              student: { select: { rude: true, firstName: true, lastName: true } },
            }),
          },
        },
      }),
    );
    expect(prisma.grade.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          period: { number: 2, academicYear: { year: 2026 } },
          enrollment: {
            course: { name: { contains: 'Quinto A', mode: 'insensitive' } },
            academicYear: { year: 2026 },
          },
        }),
        select: expect.objectContaining({
          enrollment: expect.any(Object),
          period: expect.any(Object),
        }),
        take: 1001,
      }),
    );

    await repositorio.buscartodos(20, 0, { status: 'PAUSED' });
    expect(prisma.sieSynchronization.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { status: 'PAUSED' },
      }),
    );
  });

  it('no asocia sincronizaciones históricas con el curso actual del estudiante', async () => {
    const prisma = {
      sieSynchronization: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      auditLog: { findMany: jest.fn().mockResolvedValue([]) },
      grade: {
        findMany: jest.fn().mockResolvedValue([
          {
            studentId: 'student-1',
            subjectId: 'subject-1',
            periodId: 'period-2025',
            enrollment: { academicYear: { year: 2026 } },
            period: { academicYear: { year: 2025 } },
          },
        ]),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.buscartodos(20, 0, { courseName: 'Quinto A' });

    expect(resultado).toEqual({ items: [], total: 0 });
    expect(prisma.sieSynchronization.findMany).not.toHaveBeenCalled();
    expect(prisma.sieSynchronization.count).not.toHaveBeenCalled();
  });

  it('rechaza filtros de curso que exceden el límite de identidades consultadas', async () => {
    const prisma = {
      sieSynchronization: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      auditLog: { findMany: jest.fn() },
      grade: {
        findMany: jest.fn().mockResolvedValue(
          Array.from({ length: 1001 }, () => ({
            studentId: 'student-1',
            subjectId: 'subject-1',
            periodId: 'period-1',
            enrollment: { academicYear: { year: 2026 } },
            period: { academicYear: { year: 2026 } },
          })),
        ),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    await expect(repositorio.buscartodos(20, 0, { courseName: 'Quinto A' })).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.grade.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 1001 }));
    expect(prisma.sieSynchronization.findMany).not.toHaveBeenCalled();
  });

  it('arma el detalle desde auditoría y limita los datos personales consultados', async () => {
    const fecharegistro = new Date('2026-05-18T12:00:00.000Z');
    const sincronizacion = {
      id: 'sync-lectura-1',
      requestedById: 'admin-1',
      status: 'VERIFIED',
      syncType: 'GRADES',
      totalItems: 1,
      processedItems: 1,
      discrepancyCount: 0,
      errorCount: 0,
      pausedAt: null,
      pausedReason: null,
      startedAt: fecharegistro,
      completedAt: fecharegistro,
      createdAt: fecharegistro,
      updatedAt: fecharegistro,
      items: [
        {
          id: 'item-lectura-1',
          synchronizationId: 'sync-lectura-1',
          studentId: 'student-1',
          subjectId: 'subject-1',
          periodId: 'period-1',
          localValue: 88,
          sieValue: 88,
          status: 'VERIFIED',
          errorMessage: null,
          retryCount: 0,
          verifiedAt: fecharegistro,
          discrepancyResolvedById: null,
          discrepancyResolvedAt: null,
          discrepancyResolutionReason: null,
          discrepancyDecision: null,
          createdAt: fecharegistro,
          updatedAt: fecharegistro,
          student: { rude: 'RUDE-1', firstName: 'Ana', lastName: 'Pérez' },
          subject: { code: 'MAT', name: 'Matemática' },
          period: { name: 'Primer trimestre', number: 1 },
          discrepancyResolvedBy: null,
          discrepancyGroup: null,
        },
      ],
    };
    const prisma = {
      sieSynchronization: { findUnique: jest.fn().mockResolvedValue(sincronizacion) },
      auditLog: {
        findMany: jest.fn().mockResolvedValue([
          {
            entity: 'SieSynchronization',
            entityId: 'sync-lectura-1',
            newValue: { event: 'RESUMED', status: 'QUEUED' },
            correlationId: 'corr-lectura-2',
            userId: 'admin-1',
            createdAt: fecharegistro,
          },
          {
            entity: 'SieSynchronization',
            entityId: 'sync-lectura-1',
            newValue: {
              event: 'CONFIRMED_BEFORE_ENQUEUE',
              source: 'SIE_REAL',
              status: 'QUEUED',
            },
            correlationId: 'corr-lectura-1',
            userId: 'admin-1',
            createdAt: fecharegistro,
          },
        ]),
      },
      grade: {
        findMany: jest.fn().mockResolvedValue([
          {
            studentId: 'student-1',
            subjectId: 'subject-1',
            periodId: 'period-1',
            enrollment: { course: { id: 'course-1', name: 'Quinto A' } },
          },
        ]),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.buscarporidentificador('sync-lectura-1');

    expect(resultado?.source).toBe('SIE_REAL');
    expect(resultado?.timeline).toEqual([
      expect.objectContaining({ event: 'RESUMED' }),
      expect.objectContaining({
        event: 'CONFIRMED_BEFORE_ENQUEUE',
        actorId: 'admin-1',
        correlationId: 'corr-lectura-1',
      }),
    ]);
    expect(resultado?.timelineHasMore).toBe(false);
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 101 }));
    expect(resultado?.items[0].course).toEqual({ id: 'course-1', name: 'Quinto A' });
    expect(prisma.sieSynchronization.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          items: {
            include: expect.objectContaining({
              student: { select: { rude: true, firstName: true, lastName: true } },
            }),
          },
        },
      }),
    );
  });

  it('reanuda únicamente después de cerrar grupos y vuelve a encolar notas pendientes', async () => {
    const queuedelemento = {
      id: 'item-2',
      synchronizationId: 'sync-1',
      localValue: 84,
      student: { rude: 'RUDE-2', ci: 'CI-2' },
      subject: { code: 'MAT' },
      period: { number: 1, academicYear: { year: 2026 } },
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'sync-1' }]),
      sieSynchronization: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'sync-1',
          status: 'PAUSED',
          totalItems: 3,
          processedItems: 0,
          discrepancyCount: 0,
          errorCount: 0,
          pausedReason: null,
        }),
        update: jest.fn().mockResolvedValue(undefined),
      },
      sieDiscrepancyGroup: { count: jest.fn().mockResolvedValue(0) },
      sieSynchronizationItem: {
        count: jest.fn().mockResolvedValue(0),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findMany: jest.fn().mockResolvedValue([queuedelemento]),
      },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.reanudarsincronizacionpausada({
      synchronizationId: 'sync-1',
      userId: 'admin-1',
      reason: 'Se revisó el grupo de matemática.',
      correlationId: 'corr-resume-1',
    });

    expect(resultado).toEqual(
      expect.objectContaining({
        synchronizationId: 'sync-1',
        totalItems: 3,
        status: 'QUEUED',
        jobs: [
          expect.objectContaining({
            itemId: 'item-2',
            studentRude: 'RUDE-2',
            correlationId: 'corr-resume-1',
          }),
        ],
      }),
    );
    expect(tx.sieSynchronization.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sync-1' },
        data: expect.objectContaining({ status: 'QUEUED', pausedAt: null, pausedReason: null }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'admin-1',
          correlationId: 'corr-resume-1',
          newValue: expect.objectContaining({ event: 'BATCH_RESUMED_AFTER_REVIEW' }),
        }),
      }),
    );
    expect(tx.sieSynchronizationItem.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { synchronizationId: 'sync-1', status: 'AUTH_REQUIRED' },
        data: expect.objectContaining({ status: 'QUEUED', errorMessage: null }),
      }),
    );
  });

  it('convierte AUTH_REQUIRED a cola y registra que se reanudó después de autenticación', async () => {
    const autenticacionrequeridoelemento = {
      id: 'item-auth',
      synchronizationId: 'sync-auth',
      localValue: 84,
      student: { rude: 'RUDE-AUTH', ci: 'CI-AUTH' },
      subject: { code: 'MAT' },
      period: { number: 1, academicYear: { year: 2026 } },
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'sync-auth' }]),
      sieSynchronization: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'sync-auth',
          status: 'PAUSED',
          totalItems: 1,
          pausedReason: 'El adaptador requiere revisar la autenticación antes de continuar.',
        }),
        update: jest.fn().mockResolvedValue(undefined),
      },
      sieDiscrepancyGroup: { count: jest.fn().mockResolvedValue(0) },
      sieSynchronizationItem: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([autenticacionrequeridoelemento]),
      },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.reanudarsincronizacionpausada({
      synchronizationId: 'sync-auth',
      userId: 'admin-1',
      reason: 'Se renovó y verificó el acceso SIE autorizado.',
    });

    expect(resultado.jobs).toEqual([
      expect.objectContaining({ synchronizationId: 'sync-auth', itemId: 'item-auth' }),
    ]);
    expect(tx.sieSynchronizationItem.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { synchronizationId: 'sync-auth', status: 'AUTH_REQUIRED' },
        data: expect.objectContaining({ status: 'QUEUED', errorMessage: null }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newValue: expect.objectContaining({
            resumedItemCount: 1,
          }),
        }),
      }),
    );
    expect(tx.auditLog.create.mock.calls[0][0].data.newValue).not.toHaveProperty('source');
  });

  it('reanuda el lote en proceso cuando ya no hay cola y queda una nota activa', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'sync-activa' }]),
      sieSynchronization: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'sync-activa',
          status: 'PAUSED',
          totalItems: 2,
          processedItems: 1,
          discrepancyCount: 1,
          errorCount: 0,
        }),
        update: jest.fn().mockResolvedValue(undefined),
      },
      sieDiscrepancyGroup: { count: jest.fn().mockResolvedValue(0) },
      sieSynchronizationItem: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(1),
      },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.reanudarsincronizacionpausada({
      synchronizationId: 'sync-activa',
      userId: 'admin-1',
      reason: 'Se resolvieron los grupos pendientes.',
    });

    expect(resultado).toEqual({
      synchronizationId: 'sync-activa',
      totalItems: 2,
      status: 'PROCESSING',
      jobs: [],
    });
    expect(tx.sieSynchronization.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'PROCESSING', pausedAt: null, completedAt: null }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newValue: expect.objectContaining({ event: 'BATCH_RESUMED_WITH_ACTIVE_ITEMS' }),
        }),
      }),
    );
  });

  it('finaliza el lote pausado cuando todos los elementos ya tienen resultado', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'sync-final' }]),
      sieSynchronization: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'sync-final',
          status: 'PAUSED',
          totalItems: 2,
          processedItems: 2,
          discrepancyCount: 1,
          errorCount: 0,
        }),
        update: jest.fn().mockResolvedValue(undefined),
      },
      sieDiscrepancyGroup: { count: jest.fn().mockResolvedValue(0) },
      sieSynchronizationItem: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.reanudarsincronizacionpausada({
      synchronizationId: 'sync-final',
      userId: 'admin-1',
      reason: 'Se completó la revisión de discrepancias.',
    });

    expect(resultado).toEqual({
      synchronizationId: 'sync-final',
      totalItems: 2,
      status: 'DISCREPANCY',
      jobs: [],
    });
    expect(tx.sieSynchronization.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'DISCREPANCY',
          completedAt: expect.any(Date),
          pausedAt: null,
          pausedReason: null,
        }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newValue: expect.objectContaining({ event: 'BATCH_FINALIZED_AFTER_REVIEW' }),
        }),
      }),
    );
  });

  it('registra una resolución manual con actor, fecha y justificación sin cambiar la nota', async () => {
    const resolveden = new Date('2026-10-22T12:00:00.000Z');
    const anterior = {
      id: 'item-1',
      synchronizationId: 'sync-1',
      discrepancyGroupId: 'group-1',
      studentId: 'student-1',
      subjectId: 'subject-1',
      periodId: 'period-1',
      localValue: 70,
      sieValue: 75,
      status: 'DISCREPANCY',
      errorMessage: null,
      retryCount: 0,
      verifiedAt: resolveden,
      discrepancyResolvedById: null,
      discrepancyResolvedAt: null,
      discrepancyResolutionReason: null,
      discrepancyDecision: null,
      createdAt: resolveden,
      updatedAt: resolveden,
    };
    const actualizado = {
      ...anterior,
      discrepancyResolvedById: 'admin-1',
      discrepancyResolvedAt: resolveden,
      discrepancyResolutionReason: 'Se revisó el acta oficial 17.',
      discrepancyDecision: 'KEEP_SIGCE',
      student: { rude: 'RUDE-1', firstName: 'Ana', lastName: 'Pérez' },
      subject: { code: 'MAT', name: 'Matemática' },
      period: { name: 'Primer trimestre', number: 1 },
      discrepancyResolvedBy: { id: 'admin-1', firstName: 'Ana', lastName: 'Pérez' },
    };
    const tx = {
      $queryRaw: jest
        .fn()
        .mockResolvedValueOnce([{ id: 'group-1' }])
        .mockResolvedValueOnce([{ id: 'item-1' }]),
      sieSynchronizationItem: {
        findUnique: jest.fn().mockResolvedValue(anterior),
        update: jest.fn().mockResolvedValue(actualizado),
        count: jest.fn().mockResolvedValue(0),
      },
      sieDiscrepancyGroup: { update: jest.fn().mockResolvedValue(undefined) },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.resolverdiscrepancia({
      itemId: 'item-1',
      decision: 'KEEP_SIGCE',
      reason: 'Se revisó el acta oficial 17.',
      userId: 'admin-1',
      correlationId: 'corr-sie-1',
    });

    expect(resultado.localValue).toBe(70);
    expect(resultado.status).toBe('DISCREPANCY');
    expect(tx.sieSynchronizationItem.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'item-1' },
        data: expect.objectContaining({
          discrepancyResolvedById: 'admin-1',
          discrepancyDecision: 'KEEP_SIGCE',
        }),
      }),
    );
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
    expect(tx.$queryRaw.mock.calls[0][0].join('')).toContain('sie_discrepancy_groups');
    expect(tx.$queryRaw.mock.calls[1][0].join('')).toContain('sie_synchronization_items');
    expect(tx.sieDiscrepancyGroup.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'group-1' },
        data: expect.objectContaining({ status: 'RESOLVED' }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          correlationId: 'corr-sie-1',
          studentIds: ['student-1'],
          reason: 'Se revisó el acta oficial 17.',
        }),
      }),
    );
  });

  it('resuelve de forma atómica todas las discrepancias pendientes del grupo y audita valores', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'group-1' }]),
      sieDiscrepancyGroup: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'group-1',
          synchronizationId: 'sync-1',
          status: 'IN_PROGRESS',
          items: [
            { id: 'item-1', studentId: 'student-1', localValue: 70, sieValue: 75 },
            { id: 'item-2', studentId: 'student-2', localValue: 80, sieValue: 78 },
          ],
        }),
        update: jest.fn().mockResolvedValue(undefined),
      },
      sieSynchronizationItem: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    const resultado = await repositorio.resolvergrupodiscrepancias({
      groupId: 'group-1',
      decision: 'KEEP_SIGCE',
      reason: 'Las actas oficiales confirman las notas locales.',
      userId: 'admin-1',
      correlationId: 'corr-group-1',
    });

    expect(resultado).toEqual({ groupId: 'group-1', resolvedItemCount: 2 });
    expect(tx.sieSynchronizationItem.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          discrepancyGroupId: 'group-1',
          status: 'DISCREPANCY',
          discrepancyResolvedAt: null,
        },
        data: expect.objectContaining({
          discrepancyResolvedById: 'admin-1',
          discrepancyDecision: 'KEEP_SIGCE',
          discrepancyResolutionReason: 'Las actas oficiales confirman las notas locales.',
        }),
      }),
    );
    expect(tx.sieDiscrepancyGroup.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'group-1' },
        data: expect.objectContaining({ status: 'RESOLVED', resolvedById: 'admin-1' }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entity: 'SieDiscrepancyGroup',
          entityId: 'group-1',
          studentIds: ['student-1', 'student-2'],
          correlationId: 'corr-group-1',
          previousValue: expect.objectContaining({
            items: [
              { itemId: 'item-1', localValue: 70, sieValue: 75 },
              { itemId: 'item-2', localValue: 80, sieValue: 78 },
            ],
          }),
        }),
      }),
    );
  });

  it('rechaza la resolución grupal si cambió el conjunto de discrepancias', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'group-1' }]),
      sieDiscrepancyGroup: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'group-1',
          synchronizationId: 'sync-1',
          status: 'OPEN',
          items: [{ id: 'item-1', studentId: 'student-1', localValue: 70, sieValue: 75 }],
        }),
        update: jest.fn(),
      },
      sieSynchronizationItem: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriosincronizacionsieprisma(prisma);

    await expect(
      repositorio.resolvergrupodiscrepancias({
        groupId: 'group-1',
        decision: 'KEEP_SIGCE',
        reason: 'Se revisó el informe institucional.',
        userId: 'admin-1',
      }),
    ).rejects.toThrow('El grupo cambió durante la revisión');
    expect(tx.sieDiscrepancyGroup.update).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});
