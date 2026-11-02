import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { materiassecundaria } from '../prisma/catalogomateriassecundaria';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config();
assertLocalDemoDatabaseTarget();
const prisma = new PrismaClient();

async function main() {
  for (const materia of materiassecundaria) {
    await prisma.subject.upsert({
      where: { code: materia.code },
      update: { name: materia.name, area: materia.area },
      create: materia,
    });
  }
  console.log(`Catálogo actualizado: ${materiassecundaria.length} materias de secundaria.`);
}

main().finally(() => prisma.$disconnect());
