import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositorioreferenciadocumentoestudianteprisma } from './prismareferenciadocumentoestudiante.repository';

describe('PrismaStudentDocumentReferenceRepository', () => {
  it('guarda la referencia y su auditoría en la misma transacción', async () => {
    const referencia = {
      id: 'document-1',
      studentId: 'student-1',
      documentType: 'BIRTH_CERTIFICATE',
      reference: 'Archivo físico A-17',
      notes: null,
      createdById: 'admin-1',
      createdAt: new Date('2026-10-22T12:00:00.000Z'),
      createdBy: { id: 'admin-1', firstName: 'Ana', lastName: 'Pérez' },
    };
    const tx = {
      student: { findFirst: jest.fn().mockResolvedValue({ id: 'student-1' }) },
      studentDocumentReference: { create: jest.fn().mockResolvedValue(referencia) },
      auditLog: { create: jest.fn().mockResolvedValue(undefined) },
    };
    const prisma = {
      $transaction: jest.fn((operacion: (client: typeof tx) => unknown) => operacion(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioreferenciadocumentoestudianteprisma(prisma);

    await repositorio.crear({
      studentId: 'student-1',
      documentType: 'BIRTH_CERTIFICATE',
      reference: 'Archivo físico A-17',
      userId: 'admin-1',
      correlationId: 'corr-document-1',
    });

    expect(tx.studentDocumentReference.create).toHaveBeenCalled();
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entity: 'StudentDocumentReference',
          entityId: 'document-1',
          correlationId: 'corr-document-1',
        }),
      }),
    );
  });
});
