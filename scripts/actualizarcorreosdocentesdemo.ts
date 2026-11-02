import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';
import { generarcorreodocentedemo } from './datosimportacion';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main(): Promise<void> {
  if (process.env.SIGCE_ALLOW_TEACHER_DEMO_EMAIL_UPDATE !== 'true') {
    throw new Error(
      'Activa SIGCE_ALLOW_TEACHER_DEMO_EMAIL_UPDATE=true para actualizar los correos de muestra.',
    );
  }
  assertLocalDemoDatabaseTarget();

  const docentes = await prisma.teacher.findMany({
    where: { deletedAt: null },
    select: {
      userId: true,
      ci: true,
      firstName: true,
      lastName: true,
      user: { select: { email: true } },
    },
  });
  const docentesobjetivo = docentes.filter(({ user }) => {
    const correo = user.email.toLowerCase();
    return correo.endsWith('@sigce.bo') || correo.endsWith('@sigce.edu.bo');
  });
  const usuarios = await prisma.user.findMany({ select: { id: true, email: true } });
  const propietariocorreo = new Map(
    usuarios.map((usuario) => [usuario.email.toLowerCase(), usuario.id]),
  );
  const cambios = docentesobjetivo.map((docente) => ({
    userId: docente.userId,
    correo: generarcorreodocentedemo(docente.firstName, docente.lastName, docente.ci),
  }));
  const correosnuevos = new Set<string>();

  for (const cambio of cambios) {
    const normalizado = cambio.correo.toLowerCase();
    const propietarioactual = propietariocorreo.get(normalizado);
    if (propietarioactual && propietarioactual !== cambio.userId) {
      throw new Error(
        'Un correo de muestra generado ya pertenece a otra cuenta; no se aplicaron cambios.',
      );
    }
    if (correosnuevos.has(normalizado)) {
      throw new Error('Se generaron correos duplicados; no se aplicaron cambios.');
    }
    correosnuevos.add(normalizado);
  }

  await prisma.$transaction(
    cambios.map((cambio) =>
      prisma.user.update({
        where: { id: cambio.userId },
        data: { email: cambio.correo },
      }),
    ),
  );

  const porproveedor = cambios.reduce(
    (conteo, cambio) => {
      if (cambio.correo.endsWith('@gmail.com')) conteo.gmail += 1;
      if (cambio.correo.endsWith('@hotmail.com')) conteo.hotmail += 1;
      return conteo;
    },
    { gmail: 0, hotmail: 0 },
  );
  console.log(
    `Correos docentes actualizados: ${cambios.length} (${porproveedor.gmail} Gmail, ${porproveedor.hotmail} Hotmail).`,
  );
  console.log('Son direcciones de muestra plausibles; no se verificó que reciban correo.');
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : 'No se pudieron actualizar los correos docentes.',
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
