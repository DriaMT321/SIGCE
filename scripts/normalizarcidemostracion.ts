import { randomInt } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config();

const prisma = new PrismaClient();

async function normalizarcidemostracion() {
  assertLocalDemoDatabaseTarget();

  const [estudiantes, familiares] = await Promise.all([
    prisma.student.findMany({ select: { id: true, ci: true }, orderBy: { id: 'asc' } }),
    prisma.parent.findMany({ select: { id: true, ci: true }, orderBy: { id: 'asc' } }),
  ]);

  const registros = [
    ...estudiantes.map((registro) => ({ tipo: 'estudiante' as const, ...registro })),
    ...familiares.map((registro) => ({ tipo: 'familiar' as const, ...registro })),
  ].sort((a, b) => `${a.tipo}:${a.id}`.localeCompare(`${b.tipo}:${b.id}`));
  const usados = new Set<string>();
  const actualizaciones: Array<{ tipo: 'estudiante' | 'familiar'; id: string; ci: string }> = [];

  for (const registro of registros) {
    if (/^\d{7}$/.test(registro.ci) && !usados.has(registro.ci)) {
      usados.add(registro.ci);
      continue;
    }

    let ci: string;
    do {
      ci = String(randomInt(1_000_000, 10_000_000));
    } while (usados.has(ci));

    usados.add(ci);
    actualizaciones.push({ tipo: registro.tipo, id: registro.id, ci });
  }

  await prisma.$transaction(async (transaccion) => {
    for (const actualizacion of actualizaciones) {
      if (actualizacion.tipo === 'estudiante') {
        await transaccion.student.update({
          where: { id: actualizacion.id },
          data: { ci: actualizacion.ci },
        });
      } else {
        await transaccion.parent.update({
          where: { id: actualizacion.id },
          data: { ci: actualizacion.ci },
        });
      }
    }
  }, { timeout: 120_000 });

  console.log(JSON.stringify({
    estudiantesRevisados: estudiantes.length,
    familiaresRevisados: familiares.length,
    identificadoresActualizados: actualizaciones.length,
    formato: 'siete dígitos, valores de demostración',
  }));
}

normalizarcidemostracion()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'No se pudieron normalizar los C.I.');
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
