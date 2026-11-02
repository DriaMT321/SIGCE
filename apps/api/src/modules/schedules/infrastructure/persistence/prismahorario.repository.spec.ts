import { Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { errorconflictoaplicacion } from '../../../../core/application/aplicacionerror';
import { repositoriohorarioprisma } from './prismahorario.repository';

describe('PrismaScheduleRepository slot conflict handling', () => {
  it('returns a public teacher projection and filters personal schedules to the active year', async () => {
    const prisma = {
      teacher: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'teacher-1',
          firstName: 'Ana',
          lastName: 'Rojas',
          specialty: 'Matemática',
          user: { firstName: 'Ana', lastName: 'Rojas' },
        }),
      },
      classSchedule: { findMany: jest.fn().mockResolvedValue([]) },
      teacherSubject: { findMany: jest.fn().mockResolvedValue([]) },
    } as unknown as servicioprisma;
    const repositorio = new repositoriohorarioprisma(prisma);

    await repositorio.obtenerhorariodocente('teacher-1', true);

    expect(prisma.teacher.findUnique).toHaveBeenCalledWith({
      where: { id: 'teacher-1' },
      select: expect.objectContaining({
        id: true,
        user: { select: { firstName: true, lastName: true } },
      }),
    });
    expect(prisma.classSchedule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { teacherId: 'teacher-1', academicYear: { is: { isActive: true } } },
      }),
    );
    expect(prisma.teacherSubject.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { teacherId: 'teacher-1', academicYear: { is: { isActive: true } } },
      }),
    );
  });

  it('maps a database teacher-slot uniqueness violation to an application conflict', async () => {
    const databaseconflicto = new Prisma.PrismaClientKnownRequestError('duplicate teacher slot', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });
    const prisma = {
      classSchedule: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      $transaction: jest.fn().mockRejectedValue(databaseconflicto),
    } as unknown as servicioprisma;
    const repositorio = new repositoriohorarioprisma(prisma);

    await expect(
      repositorio.guardarhorariogenerado({
        idCurso: 'course-1',
        idGestionAcademica: 'year-1',
        nombreCursoEsperado: '6to A',
        nivelEsperado: 3,
        turnoEsperado: 'MORNING',
        aula: 'Aula 6to A',
        asignacionesEsperadas: [],
        bloques: [],
      }),
    ).rejects.toThrow(errorconflictoaplicacion);
  });

  it('does not persist a generated schedule after its teacher assignment was removed', async () => {
    const transaction = {
      $queryRaw: jest.fn().mockImplementation((consulta: TemplateStringsArray) => {
        const sql = consulta.join(' ');
        if (sql.includes('FROM "courses"')) {
          return Promise.resolve([
            { academicYearId: 'year-1', name: '6to A', gradeLevel: 3, shift: 'MORNING' },
          ]);
        }
        return Promise.resolve([]);
      }),
      classSchedule: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof transaction) => unknown) =>
        callback(transaction),
      ),
    } as unknown as servicioprisma;
    const repositorio = new repositoriohorarioprisma(prisma);

    await expect(
      repositorio.guardarhorariogenerado({
        idCurso: 'course-1',
        idGestionAcademica: 'year-1',
        nombreCursoEsperado: '6to A',
        nivelEsperado: 3,
        turnoEsperado: 'MORNING',
        aula: 'Aula 6to A',
        asignacionesEsperadas: [{ teacherId: 'teacher-1', subjectId: 'subject-1' }],
        bloques: [
          {
            subjectId: 'subject-1',
            teacherId: 'teacher-1',
            dayOfWeek: 'LUNES',
            periodIndex: 1,
            startTime: '08:00',
            endTime: '08:45',
          },
        ],
      }),
    ).rejects.toThrow('Las asignaciones docentes cambiaron');

    expect(transaction.classSchedule.deleteMany).not.toHaveBeenCalled();
    expect(transaction.classSchedule.createMany).not.toHaveBeenCalled();
  });

  it('persists a generated schedule only while its assignments remain current', async () => {
    const transaction = {
      $queryRaw: jest.fn().mockImplementation((consulta: TemplateStringsArray) => {
        const sql = consulta.join(' ');
        if (sql.includes('FROM "courses"')) {
          return Promise.resolve([
            { academicYearId: 'year-1', name: '6to A', gradeLevel: 3, shift: 'MORNING' },
          ]);
        }
        return Promise.resolve([{ teacherId: 'teacher-1', subjectId: 'subject-1' }]);
      }),
      classSchedule: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof transaction) => unknown) =>
        callback(transaction),
      ),
    } as unknown as servicioprisma;
    const repositorio = new repositoriohorarioprisma(prisma);

    await repositorio.guardarhorariogenerado({
      idCurso: 'course-1',
      idGestionAcademica: 'year-1',
      nombreCursoEsperado: '6to A',
      nivelEsperado: 3,
      turnoEsperado: 'MORNING',
      aula: 'Aula 6to A',
      asignacionesEsperadas: [{ teacherId: 'teacher-1', subjectId: 'subject-1' }],
      bloques: [
        {
          subjectId: 'subject-1',
          teacherId: 'teacher-1',
          dayOfWeek: 'LUNES',
          periodIndex: 1,
          startTime: '08:00',
          endTime: '08:45',
        },
      ],
    });

    expect(transaction.classSchedule.deleteMany).toHaveBeenCalledWith({
      where: { courseId: 'course-1', academicYearId: 'year-1' },
    });
    expect(transaction.classSchedule.createMany).toHaveBeenCalledTimes(1);
  });

  it('rejects a generated schedule when the course level or shift changed', async () => {
    const transaction = {
      $queryRaw: jest
        .fn()
        .mockResolvedValue([
          { academicYearId: 'year-1', name: '6to A', gradeLevel: 4, shift: 'MORNING' },
        ]),
      classSchedule: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof transaction) => unknown) =>
        callback(transaction),
      ),
    } as unknown as servicioprisma;
    const repositorio = new repositoriohorarioprisma(prisma);

    await expect(
      repositorio.guardarhorariogenerado({
        idCurso: 'course-1',
        idGestionAcademica: 'year-1',
        nombreCursoEsperado: '6to A',
        nivelEsperado: 3,
        turnoEsperado: 'MORNING',
        aula: 'Aula 6to A',
        asignacionesEsperadas: [{ teacherId: 'teacher-1', subjectId: 'subject-1' }],
        bloques: [],
      }),
    ).rejects.toThrow('configuración académica cambió');

    expect(transaction.$queryRaw).toHaveBeenCalledTimes(1);
    expect(transaction.classSchedule.deleteMany).not.toHaveBeenCalled();
    expect(transaction.classSchedule.createMany).not.toHaveBeenCalled();
  });

  it('rejects a stale snapshot when a teacher assignment was added before saving', async () => {
    const transaction = {
      $queryRaw: jest.fn().mockImplementation((consulta: TemplateStringsArray) => {
        const sql = consulta.join(' ');
        if (sql.includes('FROM "courses"')) {
          return Promise.resolve([
            { academicYearId: 'year-1', name: '6to A', gradeLevel: 3, shift: 'MORNING' },
          ]);
        }
        return Promise.resolve([
          { teacherId: 'teacher-1', subjectId: 'subject-1' },
          { teacherId: 'teacher-2', subjectId: 'subject-2' },
        ]);
      }),
      classSchedule: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof transaction) => unknown) =>
        callback(transaction),
      ),
    } as unknown as servicioprisma;
    const repositorio = new repositoriohorarioprisma(prisma);

    await expect(
      repositorio.guardarhorariogenerado({
        idCurso: 'course-1',
        idGestionAcademica: 'year-1',
        nombreCursoEsperado: '6to A',
        nivelEsperado: 3,
        turnoEsperado: 'MORNING',
        aula: 'Aula 6to A',
        asignacionesEsperadas: [{ teacherId: 'teacher-1', subjectId: 'subject-1' }],
        bloques: [
          {
            subjectId: 'subject-1',
            teacherId: 'teacher-1',
            dayOfWeek: 'LUNES',
            periodIndex: 1,
            startTime: '08:00',
            endTime: '08:45',
          },
        ],
      }),
    ).rejects.toThrow('Las asignaciones docentes cambiaron');

    expect(transaction.classSchedule.deleteMany).not.toHaveBeenCalled();
    expect(transaction.classSchedule.createMany).not.toHaveBeenCalled();
  });
});

describe('PrismaScheduleRepository manual writes', () => {
  const datos = {
    courseId: 'course-1',
    subjectId: 'subject-1',
    teacherId: 'teacher-1',
    academicYearId: 'year-1',
    dayOfWeek: 'LUNES' as const,
    startTime: '08:00',
    endTime: '08:40',
    periodIndex: 1,
    classroom: 'Aula de prueba',
  };

  function crearrepositoriomanual(opciones?: {
    idgestioncurso?: string;
    asignacionvalida?: boolean;
  }) {
    const transaccion = {
      $queryRaw: jest.fn().mockImplementation((consulta: TemplateStringsArray) => {
        const sql = consulta.join(' ');
        if (sql.includes('FROM "courses"')) {
          return Promise.resolve([
            { id: 'course-1', academicYearId: opciones?.idgestioncurso ?? 'year-1' },
          ]);
        }
        return Promise.resolve(
          opciones?.asignacionvalida === false ? [] : [{ id: 'assignment-1' }],
        );
      }),
      classSchedule: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'schedule-1' }),
        update: jest.fn().mockResolvedValue({ id: 'schedule-1' }),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof transaccion) => unknown) =>
        callback(transaccion),
      ),
    } as unknown as servicioprisma;
    return { repositorio: new repositoriohorarioprisma(prisma), transaccion };
  }

  it('rejects a schedule whose year does not match its course', async () => {
    const { repositorio, transaccion } = crearrepositoriomanual({ idgestioncurso: 'year-2' });

    await expect(repositorio.crear(datos)).rejects.toThrow('gestión académica del curso');

    expect(transaccion.classSchedule.create).not.toHaveBeenCalled();
  });

  it('rejects a schedule without a current teacher-subject assignment', async () => {
    const { repositorio, transaccion } = crearrepositoriomanual({ asignacionvalida: false });

    await expect(repositorio.insertaroactualizar(datos)).rejects.toThrow('no tiene asignación');

    expect(transaccion.classSchedule.create).not.toHaveBeenCalled();
    expect(transaccion.classSchedule.update).not.toHaveBeenCalled();
  });

  it('writes a schedule after validating its course year and assignment', async () => {
    const { repositorio, transaccion } = crearrepositoriomanual();

    await repositorio.crear(datos);

    expect(transaccion.$queryRaw).toHaveBeenCalledTimes(2);
    expect(transaccion.classSchedule.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          courseId: 'course-1',
          academicYearId: 'year-1',
          subjectId: 'subject-1',
          teacherId: 'teacher-1',
        }),
      }),
    );
  });
});
