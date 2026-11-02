import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { escapeCsvCell } from './celdaseguracsv';
import { writeSafeExportFile } from './rutaseguradeexportacionfamiliar';

const prisma = new PrismaClient();

async function main() {
  if (process.env.SIGCE_ALLOW_FAMILY_DATA_EXPORT !== 'true') {
    throw new Error(
      'El volcado contiene datos personales; define SIGCE_ALLOW_FAMILY_DATA_EXPORT=true para autorizarlo.',
    );
  }
  const configuredExportDirectory = process.env.SIGCE_FAMILY_EXPORT_DIR?.trim();
  if (!configuredExportDirectory || !path.isAbsolute(configuredExportDirectory)) {
    throw new Error(
      'Define SIGCE_FAMILY_EXPORT_DIR como una ruta absoluta protegida fuera del repositorio.',
    );
  }
  const repositoryRoot = path.resolve(__dirname, '..');
  const exportDirectory = path.resolve(configuredExportDirectory);
  const relativeExportPath = path.relative(repositoryRoot, exportDirectory);
  if (
    relativeExportPath === '' ||
    (!relativeExportPath.startsWith(`..${path.sep}`) &&
      relativeExportPath !== '..' &&
      !path.isAbsolute(relativeExportPath))
  ) {
    throw new Error('La exportación debe guardarse fuera del repositorio.');
  }
  fs.mkdirSync(exportDirectory, { recursive: true });
  const realRepositoryRoot = fs.realpathSync(repositoryRoot);
  const realExportDirectory = fs.realpathSync(exportDirectory);
  const realRelativeExportPath = path.relative(realRepositoryRoot, realExportDirectory);
  if (
    realRelativeExportPath === '' ||
    (!realRelativeExportPath.startsWith(`..${path.sep}`) &&
      realRelativeExportPath !== '..' &&
      !path.isAbsolute(realRelativeExportPath))
  ) {
    throw new Error(
      'La exportación debe guardarse fuera del repositorio, también al resolver enlaces de directorio.',
    );
  }
  console.log('Consultando estudiantes, cursos, padres y hermanos...');

  const students = await prisma.student.findMany({
    where: { deletedAt: null },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    include: {
      enrollments: {
        where: { status: 'ACTIVE' },
        include: {
          course: {
            select: { name: true, gradeLevel: true, section: true },
          },
        },
        take: 1,
      },
      studentParents: {
        include: {
          parent: {
            include: {
              studentParents: {
                include: {
                  student: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      rude: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  console.log(`Total estudiantes encontrados: ${students.length}`);

  // 1. Estructura para JSON
  const jsonOutput = students.map((s) => {
    const courseName = s.enrollments[0]?.course?.name || 'Sin Curso';
    const primaryLink = s.studentParents[0];
    const parent = primaryLink?.parent;

    // Hermanos vinculados al mismo padre/madre (excluyendo al estudiante actual)
    const siblings = parent
      ? parent.studentParents
          .filter((sp) => sp.student.id !== s.id)
          .map((sp) => ({
            nombreCompleto: `${sp.student.firstName} ${sp.student.lastName}`.trim(),
            rude: sp.student.rude,
          }))
      : [];

    return {
      estudiante: {
        id: s.id,
        rude: s.rude,
        ci: s.ci,
        nombres: s.firstName,
        apellidos: s.lastName,
        nombreCompleto: `${s.firstName} ${s.lastName}`.trim(),
        curso: courseName,
      },
      tutor: parent
        ? {
            id: parent.id,
            nombreCompleto: `${parent.firstName} ${parent.lastName}`.trim(),
            ci: parent.ci,
            parentesco:
              primaryLink.relationship === 'FATHER'
                ? 'Padre'
                : primaryLink.relationship === 'MOTHER'
                  ? 'Madre'
                  : 'Tutor',
            telefono: parent.phone,
            email: parent.email,
            ocupacion: parent.occupation || 'N/A',
            direccion: parent.address || 'N/A',
          }
        : null,
      hermanos: siblings,
      tieneHermanos: siblings.length > 0,
      cantidadHermanos: siblings.length,
    };
  });

  // Guardar JSON
  const jsonPath = writeSafeExportFile(
    realExportDirectory,
    'estudiantes_familias.json',
    JSON.stringify(jsonOutput, null, 2),
    'utf-8',
  );
  console.log(`✅ Archivo JSON creado en: ${jsonPath}`);

  // 2. Estructura para CSV (compatible con Excel con BOM UTF-8)
  const csvHeaders = [
    'Estudiante Nombres',
    'Estudiante Apellidos',
    'RUDE',
    'CI Estudiante',
    'Curso Actual',
    'Parentesco',
    'Tutor / Padre Nombre',
    'CI Tutor',
    'Teléfono Tutor',
    'Email Tutor (Login)',
    'Ocupación Tutor',
    'Dirección',
    'Tiene Hermanos',
    'Cantidad Hermanos',
    'Nombres de Hermanos',
  ];

  const csvRows = [
    csvHeaders.join(';'),
    ...jsonOutput.map((item) => {
      const e = item.estudiante;
      const t = item.tutor;
      const sibNames = item.hermanos.map((h) => h.nombreCompleto).join(', ');
      return [
        escapeCsvCell(e.nombres),
        escapeCsvCell(e.apellidos),
        escapeCsvCell(e.rude),
        escapeCsvCell(e.ci),
        escapeCsvCell(e.curso),
        escapeCsvCell(t?.parentesco || 'Sin Asignar'),
        escapeCsvCell(t?.nombreCompleto || 'Sin Asignar'),
        escapeCsvCell(t?.ci || ''),
        escapeCsvCell(t?.telefono || ''),
        escapeCsvCell(t?.email || ''),
        escapeCsvCell(t?.ocupacion || ''),
        escapeCsvCell(t?.direccion || ''),
        escapeCsvCell(item.tieneHermanos ? 'SI' : 'NO'),
        escapeCsvCell(item.cantidadHermanos),
        escapeCsvCell(sibNames),
      ].join(';');
    }),
  ];

  // '\uFEFF' es el BOM UTF-8 para que Microsoft Excel abra las tildes y eñes correctamente sin configurar nada
  const csvPath = writeSafeExportFile(
    realExportDirectory,
    'estudiantes_familias.csv',
    '\uFEFF' + csvRows.join('\r\n'),
    'utf-8',
  );
  console.log(`✅ Archivo CSV creado en: ${csvPath}`);

  // 3. Estructura agrupada por FAMILIAS (Padres con sus respectivos hijos)
  const familiesMap = new Map<
    string,
    {
      tutor: any;
      hijos: any[];
    }
  >();

  for (const item of jsonOutput) {
    if (!item.tutor) continue;
    const parentId = item.tutor.id;
    if (!familiesMap.has(parentId)) {
      familiesMap.set(parentId, {
        tutor: item.tutor,
        hijos: [],
      });
    }
    familiesMap.get(parentId)!.hijos.push({
      nombre: item.estudiante.nombreCompleto,
      rude: item.estudiante.rude,
      ci: item.estudiante.ci,
      curso: item.estudiante.curso,
    });
  }

  const familiesList = Array.from(familiesMap.values()).sort(
    (a, b) => b.hijos.length - a.hijos.length,
  );

  // Guardar archivo JSON agrupado por familias
  const familiesJsonPath = writeSafeExportFile(
    realExportDirectory,
    'familias_agrupadas.json',
    JSON.stringify(familiesList, null, 2),
    'utf-8',
  );
  console.log(`✅ Archivo Familias Agrupadas JSON creado en: ${familiesJsonPath}`);

  // Estadísticas rápidas
  const conHermanos = jsonOutput.filter((i) => i.tieneHermanos).length;
  console.log('\n--- RESUMEN GENERADO ---');
  console.log(`Total Estudiantes procesados: ${jsonOutput.length}`);
  console.log(`Total Familias / Padres únicos: ${familiesList.length}`);
  console.log(`Estudiantes que tienen 1 o más hermanos en el colegio: ${conHermanos}`);
  console.log(
    `Familias con múltiples hijos (hermanos): ${familiesList.filter((f) => f.hijos.length > 1).length}`,
  );
}

main()
  .catch((e) => {
    console.error('Error generando archivos:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
