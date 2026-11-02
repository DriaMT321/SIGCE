import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (process.env.SIGCE_REPLACE_BIRTH_CERTIFICATES_WITH_DEMO !== 'true') {
  throw new Error('Activa SIGCE_REPLACE_BIRTH_CERTIFICATES_WITH_DEMO=true para poblar los datos ficticios locales.');
}
assertLocalDemoDatabaseTarget();

const prisma = new PrismaClient();

async function main() {
  const [estudiantes, administrador] = await Promise.all([
    prisma.student.findMany({
      where: { isActive: true, deletedAt: null },
      select: {
        id: true,
        documentReferences: {
          where: { documentType: 'BIRTH_CERTIFICATE' },
          select: { id: true, reference: true },
        },
      },
    }),
    prisma.user.findFirst({ where: { role: 'ADMINISTRATIVE', isActive: true, deletedAt: null }, select: { id: true } }),
  ]);
  if (!administrador) throw new Error('No se encontró una cuenta administrativa activa para identificar los datos de muestra.');
  if (!estudiantes.length) throw new Error('No se encontraron estudiantes activos.');

  const reemplazar = estudiantes.flatMap((estudiante) =>
    estudiante.documentReferences
      .filter(({ reference }) => reference.trim().toLowerCase() === 'pendiente de adjuntar copia digital')
      .map(({ id }) => ({
        id,
        reference: `MUESTRA FICTICIA CN-2026-${estudiante.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
      })),
  );
  const crear = estudiantes
    .filter(({ documentReferences }) => documentReferences.length === 0)
    .map(({ id }) => ({
      studentId: id,
      documentType: 'BIRTH_CERTIFICATE' as const,
      reference: `MUESTRA FICTICIA CN-2026-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
      notes: 'Dato inventado para demostración local. No representa un certificado válido ni una copia digital adjunta.',
      createdById: administrador.id,
    }));

  await prisma.$transaction(async (tx) => {
    for (const document of reemplazar) {
      await tx.studentDocumentReference.update({
        where: { id: document.id },
        data: {
          reference: document.reference,
          notes: 'Dato inventado para demostración local. No representa un certificado válido ni una copia digital adjunta.',
          createdById: administrador.id,
        },
      });
    }
    if (crear.length) await tx.studentDocumentReference.createMany({ data: crear });
  });

  console.log(JSON.stringify({
    referenciasPendientesReemplazadas: reemplazar.length,
    referenciasFicticiasCreadas: crear.length,
    otrasReferenciasConservadas: estudiantes.reduce((total, estudiante) => total + estudiante.documentReferences.length, 0) - reemplazar.length,
    nota: 'Los valores de muestra son ficticios; no incluyen ni simulan una copia digital del certificado.',
  }));
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
