import { servicioprisma } from '../../../../common/database/prisma.service';
import { datoscreacionestudiante } from '../../domain/repositories/estudiante.repository.interface';
import { repositorioestudianteprisma } from './prismaestudiante.repository';

describe('búsqueda previa de duplicados', () => {
  it('busca ambos identificadores exactos, incluso registros dados de baja', async () => {
    const coincidencias = [
      { id: '1', rude: 'R1', ci: '1234567', firstName: 'Ana', lastName: 'Pérez', isActive: true, deletedAt: null },
      { id: '2', rude: 'R2', ci: '7654321', firstName: 'Luis', lastName: 'Vega', isActive: false, deletedAt: new Date() },
    ];
    const findMany = jest.fn().mockResolvedValue(coincidencias);
    const repositorio = new repositorioestudianteprisma({ student: { findMany } } as unknown as servicioprisma);
    await expect(repositorio.buscarcoincidencias({ rude: 'R1', ci: '7654321' })).resolves.toEqual(coincidencias);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { OR: [{ rude: 'R1' }, { ci: '7654321' }] } }));
  });

  it('no consulta todos los estudiantes si no hay identificadores', async () => {
    const findMany = jest.fn();
    const repositorio = new repositorioestudianteprisma({ student: { findMany } } as unknown as servicioprisma);
    await expect(repositorio.buscarcoincidencias({})).resolves.toEqual([]);
    expect(findMany).not.toHaveBeenCalled();
  });
});

describe('acceso docente al listado por curso', () => {
  it('rechaza un curso que no tiene asignado antes de leer estudiantes', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const findMany = jest.fn();
    const repositorio = new repositorioestudianteprisma({
      teacherSubject: { findFirst }, student: { findMany, count: jest.fn() },
    } as unknown as servicioprisma);
    await expect(repositorio.buscartodos({ teacherUserId: 't1', courseId: 'c2', limit: 50, offset: 0 }))
      .rejects.toMatchObject({ status: 403 });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('permite buscar estudiantes del curso asignado vigente', async () => {
    const findFirst = jest.fn().mockResolvedValue({ id: 'assignment' });
    const findMany = jest.fn().mockResolvedValue([]);
    const repositorio = new repositorioestudianteprisma({
      teacherSubject: { findFirst }, student: { findMany, count: jest.fn().mockResolvedValue(0) },
    } as unknown as servicioprisma);
    await expect(repositorio.buscartodos({ teacherUserId: 't1', courseId: 'c1', limit: 50, offset: 0 }))
      .resolves.toEqual({ items: [], total: 0 });
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ courseId: 'c1', teacher: { userId: 't1', deletedAt: null }, academicYear: { isActive: true } }),
    }));
  });
});

describe('PrismaStudentRepository account provisioning', () => {
  it('creates a student account that requires one-time activation', async () => {
    const estudianteregistro = {
      id: 'student-1',
      rude: 'SYNTH-1',
      ci: 'SYNTH-CI-1',
      firstName: 'Ana',
      lastName: 'Pérez',
      birthDate: new Date('2015-01-01T00:00:00.000Z'),
      gender: 'FEMALE',
      address: null,
      phone: null,
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      enrollments: [],
      studentParents: [],
    };
    const tx = {
      student: {
        create: jest.fn().mockResolvedValue(estudianteregistro),
        update: jest.fn().mockResolvedValue(estudianteregistro),
        findUniqueOrThrow: jest.fn().mockResolvedValue(estudianteregistro),
      },
      user: { create: jest.fn().mockResolvedValue({ id: 'user-1' }) },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioestudianteprisma(prisma);
    const entrada: datoscreacionestudiante = {
      rude: 'SYNTH-1',
      ci: 'SYNTH-CI-1',
      firstName: 'Ana',
      lastName: 'Pérez',
      birthDate: new Date('2015-01-01T00:00:00.000Z'),
      gender: 'FEMALE',
    };

    const activacionvenceen = new Date('2026-01-08T00:00:00.000Z');
    const resultado = await repositorio.crear(
      entrada,
      {
        placeholderPasswordHash: 'placeholder-hash',
        activationTokenHash: 'hashed-one-time-token',
        activationExpiresAt: activacionvenceen,
      },
      { userId: 'admin-1', correlationId: 'request-1', newValue: { firstName: 'Ana' } },
    );

    expect(resultado.id).toBe('student-1');
    expect(tx.student.create).toHaveBeenCalledWith({
      data: { ...entrada, gender: 'FEMALE' },
    });
    expect(tx.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        role: 'STUDENT',
        passwordHash: 'placeholder-hash',
        passwordSetupTokenHash: 'hashed-one-time-token',
        passwordSetupExpiresAt: activacionvenceen,
      }),
    });
    expect(tx.student.update).toHaveBeenCalledWith({
      where: { id: 'student-1' },
      data: { userId: 'user-1' },
    });
    expect(tx.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'admin-1',
        action: 'CREATE',
        entity: 'Student',
        entityId: 'student-1',
        correlationId: 'request-1',
        newValue: { firstName: 'Ana' },
      }),
    });
  });
});

describe('PrismaStudentRepository account activation reissue', () => {
  it('locks the active profile before creating and associating an account', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'student-1' }]),
      student: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'student-1',
          userId: null,
          firstName: 'Ana',
          lastName: 'Pérez',
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      user: { create: jest.fn().mockResolvedValue({ id: 'user-1' }) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioestudianteprisma(prisma);

    await expect(
      repositorio.reemitiractivacion(
        'student-1',
        {
          placeholderPasswordHash: 'placeholder-hash',
          activationTokenHash: 'hashed-token',
          activationExpiresAt: new Date('2026-01-08T00:00:00.000Z'),
        },
        { userId: 'admin-1' },
      ),
    ).resolves.toBe('user-1');

    expect(tx.student.updateMany).toHaveBeenCalledWith({
      where: { id: 'student-1', userId: null, isActive: true, deletedAt: null },
      data: { userId: 'user-1' },
    });
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.student.findFirst.mock.invocationCallOrder[0],
    );
    expect(tx.auditLog.create).toHaveBeenCalled();
  });

  it('rolls back account creation if the student can no longer be associated', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'student-1' }]),
      student: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'student-1',
          userId: null,
          firstName: 'Ana',
          lastName: 'Pérez',
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      user: { create: jest.fn().mockResolvedValue({ id: 'user-1' }) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioestudianteprisma(prisma);

    await expect(
      repositorio.reemitiractivacion(
        'student-1',
        {
          placeholderPasswordHash: 'placeholder-hash',
          activationTokenHash: 'hashed-token',
          activationExpiresAt: new Date('2026-01-08T00:00:00.000Z'),
        },
        { userId: 'admin-1' },
      ),
    ).rejects.toThrow('Estudiante no encontrado');

    expect(tx.user.create).toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('does not create an account when the active profile cannot be locked', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      student: { findFirst: jest.fn() },
      user: { create: jest.fn() },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioestudianteprisma(prisma);

    await expect(
      repositorio.reemitiractivacion(
        'student-1',
        {
          placeholderPasswordHash: 'placeholder-hash',
          activationTokenHash: 'hashed-token',
          activationExpiresAt: new Date('2026-01-08T00:00:00.000Z'),
        },
        { userId: 'admin-1' },
      ),
    ).resolves.toBeNull();

    expect(tx.student.findFirst).not.toHaveBeenCalled();
    expect(tx.user.create).not.toHaveBeenCalled();
  });
});

describe('PrismaStudentRepository teacher scope', () => {
  it('limits list and direct student lookups to current assigned courses', async () => {
    const prismasimulado = {
      student: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        findFirst: jest.fn().mockResolvedValue(null),
      },
    };
    const repositorio = new repositorioestudianteprisma(
      prismasimulado as unknown as servicioprisma,
    );

    await repositorio.buscartodos({ teacherUserId: 'teacher-user-1', limit: 50, offset: 0 });
    await repositorio.buscarporidentificador('student-1', undefined, 'teacher-user-1');

    const assignedinscripcion = {
      status: 'ACTIVE',
      academicYear: { isActive: true },
      course: {
        teacherSubjects: {
          some: {
            teacher: { userId: 'teacher-user-1', deletedAt: null },
            academicYear: { isActive: true },
          },
        },
      },
    };
    expect(prismasimulado.student.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ enrollments: { some: assignedinscripcion } }),
        include: expect.objectContaining({
          enrollments: expect.objectContaining({
            where: assignedinscripcion,
            orderBy: [
              { academicYear: { isActive: 'desc' } },
              { academicYear: { year: 'desc' } },
              { enrollmentDate: 'desc' },
              { id: 'asc' },
            ],
          }),
        }),
      }),
    );
    expect(prismasimulado.student.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ enrollments: { some: assignedinscripcion } }),
        include: expect.objectContaining({
          enrollments: expect.objectContaining({
            where: assignedinscripcion,
            orderBy: [
              { academicYear: { isActive: 'desc' } },
              { academicYear: { year: 'desc' } },
              { enrollmentDate: 'desc' },
              { id: 'asc' },
            ],
          }),
        }),
      }),
    );
  });

  it('omits other tutors from teacher views and limits parent queries to their own relation', async () => {
    const estudiante = {
      id: 'student-1',
      rude: 'SYNTH-1',
      ci: 'SYNTH-CI-1',
      firstName: 'ESTUDIANTE DE PRUEBA',
      lastName: 'REGISTRO',
      birthDate: new Date('2015-01-01T00:00:00.000Z'),
      gender: 'FEMALE',
      address: null,
      phone: null,
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      enrollments: [],
      studentParents: [
        {
          id: 'relation-1',
          relationship: 'GUARDIAN',
          isPrimary: true,
          canPickup: true,
          parent: { id: 'parent-1', firstName: 'TUTORA DE PRUEBA', lastName: 'REGISTRO' },
        },
      ],
    };
    const prismasimulado = {
      student: {
        findMany: jest.fn().mockResolvedValue([estudiante]),
        count: jest.fn().mockResolvedValue(1),
      },
    };
    const repositorio = new repositorioestudianteprisma(
      prismasimulado as unknown as servicioprisma,
    );

    const respuestaDocente = await repositorio.buscartodos({
      teacherUserId: 'teacher-user-1',
      limit: 50,
      offset: 0,
    });
    expect(respuestaDocente.items[0]?.parents).toEqual([]);

    await repositorio.buscartodos({ parentUserId: 'parent-user-1', limit: 50, offset: 0 });
    const consultaFamiliar = prismasimulado.student.findMany.mock.calls[1]?.[0];
    expect(consultaFamiliar.include.studentParents).toMatchObject({
      where: { parent: { userId: 'parent-user-1' } },
      include: {
        parent: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  });
});

describe('PrismaStudentRepository profile updates', () => {
  it('synchronizes changed names with the linked account in the same transaction', async () => {
    const anterior = {
      id: 'student-1',
      userId: 'user-1',
      rude: 'SYNTH-1',
      ci: 'SYNTH-CI-1',
      firstName: 'Ana',
      lastName: 'Pérez',
      birthDate: new Date('2015-01-01T00:00:00.000Z'),
      gender: 'FEMALE',
      address: null,
      phone: null,
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      deletedAt: null,
    };
    const actualizado = {
      ...anterior,
      firstName: 'Ana María',
      enrollments: [],
      studentParents: [],
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'student-1' }]),
      student: {
        findFirst: jest.fn().mockResolvedValue(anterior),
        update: jest.fn().mockResolvedValue(actualizado),
      },
      user: { update: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioestudianteprisma(prisma);

    await repositorio.actualizar('student-1', { firstName: 'Ana María' }, { userId: 'admin-1' });

    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { firstName: 'Ana María' },
    });
    expect(tx.student.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'student-1', deletedAt: null } }),
    );
    expect(tx.user.update.mock.invocationCallOrder[0]).toBeLessThan(
      tx.student.update.mock.invocationCallOrder[0],
    );
    expect(tx.auditLog.create).toHaveBeenCalled();
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.student.findFirst.mock.invocationCallOrder[0],
    );
  });
});
