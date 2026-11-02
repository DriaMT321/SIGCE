import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { writeSafeExportFile } from './rutaseguradeexportacionfamiliar';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  if (process.env.SIGCE_ALLOW_FAMILY_DATA_EXPORT !== 'true') {
    throw new Error(
      'El listado contiene datos personales; define SIGCE_ALLOW_FAMILY_DATA_EXPORT=true para autorizarlo.',
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
  // 1. Obtener todos los profesores ordenados alfabéticamente
  const teachers = await prisma.teacher.findMany({
    where: { deletedAt: null },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: {
      firstName: true,
      lastName: true,
      specialty: true,
      itemNumber: true,
    },
  });

  // 2. Obtener todos los padres con sus estudiantes y cursos
  const parents = await prisma.parent.findMany({
    where: { deletedAt: null },
    include: {
      studentParents: {
        include: {
          student: {
            include: {
              enrollments: {
                where: { status: 'ACTIVE' },
                include: {
                  course: {
                    select: { name: true },
                  },
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  // Filtrar los que tengan al menos 1 hijo
  const validParents = parents.filter((p) => p.studentParents.length >= 1);

  // Mezclar aleatoriamente (Fisher-Yates)
  for (let i = validParents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validParents[i], validParents[j]] = [validParents[j], validParents[i]];
  }

  // Tomar 90
  const selected90 = validParents.slice(0, 90);

  let mdContent = `# LISTADO INSTITUCIONAL - SIGCE\n\n`;

  mdContent += `## 👨‍🏫 LISTA DE PROFESORES (${teachers.length})\n\n`;
  teachers.forEach((t, i) => {
    mdContent += `${i + 1}. **${t.firstName} ${t.lastName}** (${t.specialty})\n`;
  });

  mdContent += `\n---\n\n## 👨‍👩‍👧‍👦 LISTA DE 90 PADRES DE FAMILIA SELECCIONADOS ALEATORIAMENTE\n\n`;
  selected90.forEach((p, i) => {
    const hijosTexto = p.studentParents
      .map((sp) => {
        const cName = sp.student.enrollments[0]?.course?.name || 'Nivel Escolar';
        return `${sp.student.firstName} ${sp.student.lastName} [${cName}]`;
      })
      .join(', ');
    mdContent += `${i + 1}. **${p.firstName} ${p.lastName}** — Hijos: ${hijosTexto}\n`;
  });

  const outPath = writeSafeExportFile(
    realExportDirectory,
    'LISTADO_PADRES_Y_PROFESORES.md',
    mdContent,
    'utf-8',
  );
  console.log('Archivo creado exitosamente en:', outPath);
}

main().finally(() => prisma.$disconnect());
