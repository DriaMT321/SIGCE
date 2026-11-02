import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { materiasinicialyprimaria } from '../prisma/catalogomateriasprimaria';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config();
assertLocalDemoDatabaseTarget();
const prisma = new PrismaClient();

async function main() {
  for (const materia of materiasinicialyprimaria) {
    await prisma.subject.upsert({
      where: { code: materia.code },
      update: { name: materia.name, area: materia.area },
      create: materia,
    });
  }
  console.log(
    `Catálogo actualizado: ${materiasinicialyprimaria.length} materias de inicial y primaria.`,
  );
}

main().finally(() => prisma.$disconnect());
