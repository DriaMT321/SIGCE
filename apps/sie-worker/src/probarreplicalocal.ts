import { PrismaClient } from '@prisma/client';
import { estadosincronizacionsie } from '@academic/domain-kernel';
import type { trabajoprocesamientosie } from './application/modelos/sincronizacion.model';
import { adaptadorpuppeteersie } from './infrastructure/browser/adaptadorpuppeteersie.adapter';

const ruta = process.argv[2] ?? process.env.SIE_LOCAL_REPLICA_PATH;

const trabajosdemostracion: Array<{
  datos: trabajoprocesamientosie;
  esperado: estadosincronizacionsie;
}> = [
  {
    datos: {
      synchronizationId: 'demo-replica-2026',
      itemId: 'demo-coincidencia',
      studentRude: 'DEMO-RUDE-001',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT-SEC',
      localGrade: 85,
    },
    esperado: estadosincronizacionsie.VERIFIED,
  },
  {
    datos: {
      synchronizationId: 'demo-replica-2026',
      itemId: 'demo-discrepancia',
      studentRude: 'DEMO-RUDE-002',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT-SEC',
      localGrade: 70,
    },
    esperado: estadosincronizacionsie.DISCREPANCY,
  },
  {
    datos: {
      synchronizationId: 'demo-replica-2026',
      itemId: 'demo-sin-nota',
      studentRude: 'DEMO-RUDE-004',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT-SEC',
      localGrade: 64,
    },
    esperado: estadosincronizacionsie.FAILED,
  },
];

async function obtenertrabajoactual(): Promise<trabajoprocesamientosie> {
  const prisma = new PrismaClient();
  try {
    const calificacion = await prisma.grade.findFirst({
      where: {
        enrollment: { status: 'ACTIVE' },
        period: { number: 1 },
        student: { isActive: true, deletedAt: null },
      },
      include: {
        student: { select: { rude: true } },
        subject: { select: { code: true } },
        period: { include: { academicYear: { select: { year: true } } } },
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });

    if (!calificacion) {
      throw new Error('No hay notas vigentes del primer trimestre para probar la réplica local.');
    }

    return {
      synchronizationId: 'prueba-local-datos-sigce',
      itemId: `prueba-${calificacion.id}`,
      studentRude: calificacion.student.rude,
      academicYear: calificacion.period.academicYear.year,
      periodNumber: calificacion.period.number,
      subjectCode: calificacion.subject.code,
      localGrade: calificacion.value,
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function ejecutar(): Promise<void> {
  const adapter = new adaptadorpuppeteersie(undefined, ruta);
  const trabajos = ruta
    ? trabajosdemostracion
    : [{ datos: await obtenertrabajoactual(), esperado: estadosincronizacionsie.VERIFIED }];
  let fallo = false;

  try {
    for (const trabajo of trabajos) {
      const resultado = await adapter.procesarsincronizacioncalificacion(trabajo.datos);
      const correcto =
        resultado.status === trabajo.esperado &&
        (trabajo.esperado !== estadosincronizacionsie.VERIFIED ||
          resultado.sieValue === trabajo.datos.localGrade);
      fallo ||= !correcto;
      console.log(
        ruta
          ? `${correcto ? 'PASS' : 'FAIL'} ${trabajo.datos.studentRude}: esperado=${trabajo.esperado}, obtenido=${resultado.status}`
          : `${correcto ? 'PASS' : 'FAIL'} Puppeteer leyó una nota vigente de SIGCE y la reconoció en la réplica local (${trabajo.datos.academicYear}, trimestre ${trabajo.datos.periodNumber}).`,
      );
    }
  } finally {
    await adapter.cerrar();
  }

  if (fallo) process.exitCode = 1;
}

void ejecutar().catch((error: unknown) => {
  console.error('Falló la prueba con la réplica local:', error);
  process.exitCode = 1;
});
