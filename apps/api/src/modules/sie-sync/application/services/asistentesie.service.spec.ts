import { AuditAction } from '@prisma/client';
import {
  errorconflictoaplicacion,
  errorsolicitudincorrecta,
} from '../../../../core/application/aplicacionerror';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositorioasistentesieprisma } from '../../infrastructure/persistence/prismaasistentesie.repository';
import { servicioasistentesie } from './asistentesie.service';

describe('Asistente de carga SIE', () => {
  const seleccion = {
    academicYearId: '66a63e1e-5cc5-4f2d-998b-bbc9b58d2bb0',
    courseId: '7f285505-351c-4cea-9275-05b2c0dd48b0',
    subjectId: 'c60111bf-aab3-49d0-a2ca-2e222ac32217',
    periodNumber: 1,
  };
  const gradeId = 'c91604aa-a3f3-41e4-b962-c52d84d309ba';
  const otraNotaId = 'bf6e3851-b4fa-450f-b76b-d57a25187413';
  const periodo = {
    id: '4ac66251-9bb3-4dcc-afc5-619ff650b5c8',
    name: 'Primer trimestre',
    number: 1,
    isClosed: true,
  };
  const nota = {
    id: gradeId,
    studentId: '8bc77f31-e324-40a1-b132-394952201a3c',
    value: 84,
    updatedAt: new Date('2026-11-08T10:00:00.000Z'),
    publishedAt: new Date('2026-11-08T10:00:00.000Z'),
    student: {
      rude: '81891912026504',
      firstName: 'Ana',
      lastName: 'Rojas',
    },
  };
  const prisma = {
    course: {
      findFirst: jest.fn().mockResolvedValue({ id: seleccion.courseId, name: 'Primero A' }),
    },
    subject: {
      findUnique: jest.fn().mockResolvedValue({
        id: seleccion.subjectId,
        name: 'Matemática',
        code: 'MAT',
      }),
    },
    academicPeriod: { findUnique: jest.fn().mockResolvedValue(periodo) },
    grade: { findMany: jest.fn().mockResolvedValue([nota]) },
    auditLog: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'd3fb76ed-eaef-4e52-8438-1e9f8f364081',
        createdAt: new Date('2026-11-08T10:05:00.000Z'),
      }),
    },
  };
  const repositorio = new repositorioasistentesieprisma(prisma as unknown as servicioprisma);
  const servicio = new servicioasistentesie(repositorio);
  const actor = { userId: '047ed0ba-9e0b-4295-a09d-7dcbe01c2c33' };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.course.findFirst.mockResolvedValue({ id: seleccion.courseId, name: 'Primero A' });
    prisma.subject.findUnique.mockResolvedValue({
      id: seleccion.subjectId,
      name: 'Matemática',
      code: 'MAT',
    });
    prisma.academicPeriod.findUnique.mockResolvedValue(periodo);
    prisma.grade.findMany.mockResolvedValue([nota]);
    prisma.auditLog.findUnique.mockResolvedValue(null);
  });

  it('rechaza un trimestre abierto', async () => {
    prisma.academicPeriod.findUnique.mockResolvedValue({ ...periodo, isClosed: false });

    await expect(servicio.prepararnotas(seleccion)).rejects.toThrow(errorsolicitudincorrecta);
    expect(prisma.grade.findMany).not.toHaveBeenCalled();
  });

  it('consulta únicamente notas publicadas de matrículas vigentes del curso', async () => {
    const preparado = await servicio.prepararnotas(seleccion);

    expect(prisma.grade.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          subjectId: seleccion.subjectId,
          periodId: periodo.id,
          publishedAt: { not: null },
          student: { isActive: true, deletedAt: null },
          enrollment: {
            courseId: seleccion.courseId,
            academicYearId: seleccion.academicYearId,
            status: 'ACTIVE',
          },
        }),
      }),
    );
    expect(preparado.grades).toEqual([
      expect.objectContaining({ gradeId, rude: nota.student.rude, value: 84 }),
    ]);

    prisma.grade.findMany.mockResolvedValueOnce([]);
    const sinPublicar = await servicio.prepararnotas(seleccion);
    expect(sinPublicar.grades).toEqual([]);
  });

  it('rechaza el resumen si cambió la selección desde la preparación', async () => {
    await expect(
      servicio.registrarresumen(
        {
          ...seleccion,
          fingerprint: '0'.repeat(64),
          operationId: '0f4f1693-b1a3-43f7-82c7-b751d23d73aa',
          entries: [{ gradeId, result: 'FILLED' }],
        },
        actor,
      ),
    ).rejects.toThrow(errorconflictoaplicacion);
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('rechaza notas duplicadas o ajenas al curso', async () => {
    const { fingerprint } = await servicio.prepararnotas(seleccion);

    await expect(
      servicio.registrarresumen(
        {
          ...seleccion,
          fingerprint,
          operationId: '46f8607c-b0b9-46f0-b9cd-6ba043b5401f',
          entries: [
            { gradeId, result: 'FILLED' },
            { gradeId, result: 'CONFIRMED_BY_USER' },
          ],
        },
        actor,
      ),
    ).rejects.toThrow(errorsolicitudincorrecta);
    await expect(
      servicio.registrarresumen(
        {
          ...seleccion,
          fingerprint,
          operationId: 'd0d32623-05ce-4a1c-b7bf-5291e1790d18',
          entries: [{ gradeId: otraNotaId, result: 'FILLED' }],
        },
        actor,
      ),
    ).rejects.toThrow(errorsolicitudincorrecta);
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('registra una confirmación informada por la responsable sin afirmar verificación', async () => {
    const { fingerprint } = await servicio.prepararnotas(seleccion);
    const respuesta = await servicio.registrarresumen(
      {
        ...seleccion,
        fingerprint,
        operationId: 'f35beee6-9848-44da-9db3-ac42a15bb42d',
        entries: [{ gradeId, result: 'CONFIRMED_BY_USER' }],
      },
      actor,
    );

    expect(respuesta).toMatchObject({ verification: 'USER_REPORTED', recordedEntries: 1 });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: actor.userId,
        action: AuditAction.CREATE,
        entity: 'SieAssistedEntrySummary',
        studentIds: [nota.studentId],
        newValue: expect.objectContaining({
          event: 'ASSISTED_UI_ENTRY_REPORTED',
          entries: [{ gradeId, result: 'CONFIRMED_BY_USER' }],
        }),
      }),
      select: { id: true, createdAt: true },
    });
  });
});
