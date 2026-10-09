import { PrismaClient, UserRole, RelationshipType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MALE_NAMES = [
  'CARLOS', 'JUAN CARLOS', 'MARCELO', 'JORGE', 'MIGUEL ANGEL',
  'JOSE LUIS', 'ROBERTO', 'FERNANDO', 'VICTOR HUGO', 'DANIEL',
  'WALTER', 'OSCAR', 'RAMIRO', 'GONZALO', 'EDGAR',
  'ROLANDO', 'MARIO', 'SERGIO', 'PABLO', 'DIEGO',
  'JAVIER', 'RICARDO', 'RODOLFO', 'ALFREDO', 'DAVID',
  'RAUL', 'ARTURO', 'ERNESTO', 'JAIME', 'RENE',
  'RUBEN', 'FELIX', 'GUIDO', 'HERNAN', 'IVAN',
  'JULIO CESAR', 'NESTOR', 'PEDRO', 'RAFAEL', 'GUSTAVO',
  'ALVARO', 'MAURICIO', 'RODRIGO', 'ALEJANDRO', 'CHRISTIAN',
];

const FEMALE_NAMES = [
  'MARIA ELENA', 'CARMEN ROSA', 'ANA MARIA', 'PATRICIA', 'ROSA',
  'LAURA', 'CLAUDIA', 'SONIA', 'MONICA', 'SILVIA',
  'ELIZABETH', 'SUSANA', 'VERONICA', 'PAOLA', 'BEATRIZ',
  'LOURDES', 'MIRIAM', 'ROXANA', 'GLADYS', 'GABRIELA',
  'MARLENE', 'TERESA', 'MARTHA', 'XIMENA', 'CECILIA',
  'ADRIANA', 'CARLA', 'DANIELA', 'ELENA', 'FABIOLA',
  'LUCIA', 'LILIAN', 'MARCELA', 'NATALIA', 'SANDRA',
  'TANIA', 'VANESSA', 'YOLANDA', 'ANDREA', 'CAROLINA',
];

const OCCUPATIONS = [
  'Comerciante', 'Ingeniero/a Civil', 'Docente', 'Contador/a Público/a',
  'Abogado/a', 'Médico/a', 'Empresario/a', 'Administrador/a de Empresas',
  'Arquitecto/a', 'Auditor/a Financiero/a', 'Bioquímico/a y Farmacéutico/a',
  'Transportista', 'Economista', 'Enfermero/a', 'Odontólogo/a',
  'Servidor/a Público/a', 'Técnico/a en Telecomunicaciones',
  'Mecánico/a Automotriz', 'Psicólogo/a', 'Agrónomo/a',
  'Chef / Gastrónomo/a', 'Analista de Sistemas', 'Periodista',
];

const ADDRESSES = [
  'Av. América Este #1240, Zona Queru Queru',
  'Calle Colombia #456, Edif. Los Ceibos',
  'Av. Heroínas #890, Zona Central',
  'Calle Baptista #345, Casco Viejo',
  'Av. Circunvalación #1120, Zona Norte',
  'Calle Salamanca #678, Zona La Recoleta',
  'Av. Ramón Rivero #456, Frente al Parque',
  'Calle Ecuador #234, Zona San Pedro',
  'Av. Melchor Pérez de Olguín #789',
  'Calle España #123, Pasaje Sucre',
  'Av. Beijing #1450, Zona Sarco',
  'Calle 25 de Mayo #456, Zona Central',
  'Av. Santa Cruz #780, Zona Pantano',
  'Calle Mayor Rocha #320, Zona Norte',
  'Av. Blanco Galindo Km 3.5, Coña Coña',
  'Calle Nataniel Aguirre #650, La Cancha',
  'Av. Juan de la Rosa #890, Zona Hipódromo',
  'Calle Antezana #432, Zona Central',
  'Av. Ballivián (El Prado) #560, Edif. El Prado',
  'Av. Papa Paulo #310, Zona Las Cuadras',
  'Calle Lanza #550, Zona San Antonio',
  'Av. Libertador Bolívar #740, Zona Cala Cala',
  'Calle Potosí #280, Zona Sud',
  'Av. Siglo XX #1500, Zona Alalay',
  'Calle Tarija #190, Zona Tupuraya',
];

export async function seedParents() {
  console.log('===============================================================');
  console.log('POBLANDO BASE DE DATOS CON PADRES DE FAMILIA / TUTORES');
  console.log('===============================================================\n');

  // 1. Obtener estudiantes que no tienen ningún padre vinculado
  const studentsWithoutParent = await prisma.student.findMany({
    where: { studentParents: { none: {} } },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rude: true,
      ci: true,
      gender: true,
    },
  });

  console.log(`Estudiantes sin padre o tutor vinculado: ${studentsWithoutParent.length}`);

  if (studentsWithoutParent.length === 0) {
    console.log('✅ Todos los estudiantes ya cuentan con un padre o tutor vinculado.');
    return;
  }

  // 2. Cargar CIs y Emails existentes para evitar colisiones
  const [existingUsers, existingParents, existingStudents, existingTeachers] = await Promise.all([
    prisma.user.findMany({ select: { email: true } }),
    prisma.parent.findMany({ select: { ci: true } }),
    prisma.student.findMany({ select: { ci: true } }),
    prisma.teacher.findMany({ select: { ci: true } }),
  ]);

  const usedEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));
  const usedCis = new Set([
    ...existingParents.map((p) => p.ci),
    ...existingStudents.map((s) => s.ci),
    ...existingTeachers.map((t) => t.ci),
  ]);

  // 3. Agrupar estudiantes por unidad familiar (mismos apellidos = hermanos)
  const familyMap = new Map<string, typeof studentsWithoutParent>();
  for (const st of studentsWithoutParent) {
    const key = st.lastName.trim().toUpperCase();
    const list = familyMap.get(key) || [];
    list.push(st);
    familyMap.set(key, list);
  }

  console.log(`Unidades familiares identificadas: ${familyMap.size}`);

  // 4. Preparar contraseña estandarizada '123456' para login inmediato en web y móvil
  const passwordHash = await bcrypt.hash('123456', 10);

  // Contador base para generar C.I.s realistas de 7 u 8 dígitos (ej. rango 4.500.000 a 7.900.000)
  let ciSequence = 5200000;

  let totalParentsCreated = 0;
  let totalLinksCreated = 0;

  const familyEntries = Array.from(familyMap.entries());
  const BATCH_SIZE = 50;

  for (let b = 0; b < familyEntries.length; b += BATCH_SIZE) {
    const chunk = familyEntries.slice(b, b + BATCH_SIZE);

    await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < chunk.length; i++) {
          const globalIdx = b + i;
          const [familyLastName, children] = chunk[i];

          // Alternar entre Padre y Madre
          const isFather = globalIdx % 2 === 0;
          const relationship = isFather ? RelationshipType.FATHER : RelationshipType.MOTHER;

          const firstNamePool = isFather ? MALE_NAMES : FEMALE_NAMES;
          const parentFirstName = firstNamePool[globalIdx % firstNamePool.length];
          const parentLastName = familyLastName;

          // Generar CI único no utilizado
          while (usedCis.has(ciSequence.toString())) {
            ciSequence++;
          }
          const parentCi = ciSequence.toString();
          usedCis.add(parentCi);
          ciSequence++;

          // Generar Email único no utilizado
          const emailPrefix = isFather ? 'padre' : 'madre';
          let parentEmail = `${emailPrefix}.${parentCi}@sigce.edu.bo`.toLowerCase();
          let emailCounter = 1;
          while (usedEmails.has(parentEmail)) {
            parentEmail = `${emailPrefix}.${parentCi}.${emailCounter}@sigce.edu.bo`.toLowerCase();
            emailCounter++;
          }
          usedEmails.add(parentEmail);

          // Generar Teléfono realista (8 dígitos comenzando con 7 o 6)
          const phonePrefixes = ['71', '72', '75', '76', '77', '78', '67', '68', '69'];
          const phonePrefix = phonePrefixes[globalIdx % phonePrefixes.length];
          const phoneSuffix = (100000 + ((globalIdx * 97 + 13) % 900000)).toString();
          const parentPhone = `${phonePrefix}${phoneSuffix}`;

          // Dirección y Ocupación
          const address = ADDRESSES[globalIdx % ADDRESSES.length];
          const occupation = OCCUPATIONS[globalIdx % OCCUPATIONS.length];

          // A) Crear User
          const user = await tx.user.create({
            data: {
              email: parentEmail,
              passwordHash,
              firstName: parentFirstName,
              lastName: parentLastName,
              role: UserRole.PARENT,
              isActive: true,
            },
          });

          // B) Crear Parent
          const parent = await tx.parent.create({
            data: {
              userId: user.id,
              ci: parentCi,
              firstName: parentFirstName,
              lastName: parentLastName,
              phone: parentPhone,
              email: parentEmail,
              address,
              occupation,
            },
          });

          totalParentsCreated++;

          // C) Vincular todos los hijos de esta familia con el padre/madre
          for (const child of children) {
            await tx.studentParent.create({
              data: {
                studentId: child.id,
                parentId: parent.id,
                relationship,
                isPrimary: true,
                canPickup: true,
              },
            });
            totalLinksCreated++;
          }
        }
      },
      {
        timeout: 60000,
      }
    );

    console.log(
      `  -> Lote procesado: ${Math.min(b + BATCH_SIZE, familyEntries.length)} / ${familyEntries.length} familias...`
    );
  }

  console.log('\n===============================================================');
  console.log('✅ INSERCIÓN Y VINCULACIÓN COMPLETADA CON ÉXITO');
  console.log(`   - Nuevos Padres/Tutores creados: ${totalParentsCreated}`);
  console.log(`   - Nuevos Vínculos Estudiante-Padre creados: ${totalLinksCreated}`);
  console.log('===============================================================\n');

  // Verificación final
  const remainingWithoutParent = await prisma.student.count({
    where: { studentParents: { none: {} } },
  });
  const totalParentsInDb = await prisma.parent.count();
  const totalStudentParents = await prisma.studentParent.count();

  console.log('📊 RESUMEN FINAL EN BASE DE DATOS:');
  console.log(`   - Estudiantes sin padre o tutor: ${remainingWithoutParent}`);
  console.log(`   - Total Padres/Tutores en BD: ${totalParentsInDb}`);
  console.log(`   - Total Vínculos Estudiante-Padre: ${totalStudentParents}`);

  // Mostrar un ejemplo con hermanos
  const sampleMultiChild = await prisma.parent.findFirst({
    where: { studentParents: { some: {} } },
    include: {
      user: { select: { email: true } },
      studentParents: {
        include: {
          student: { select: { firstName: true, lastName: true, rude: true } },
        },
      },
    },
    orderBy: { studentParents: { _count: 'desc' } },
  });

  if (sampleMultiChild) {
    console.log('\nEjemplo de Tutor con múltiples hijos vinculados:');
    console.log(`Tutor: ${sampleMultiChild.firstName} ${sampleMultiChild.lastName} (CI: ${sampleMultiChild.ci})`);
    console.log(`Email de acceso: ${sampleMultiChild.email} | Clave: 123456`);
    console.log(`Hijos vinculados (${sampleMultiChild.studentParents.length}):`);
    sampleMultiChild.studentParents.forEach((sp) => {
      console.log(`  - ${sp.student.firstName} ${sp.student.lastName} (RUDE: ${sp.student.rude})`);
    });
  }
}

seedParents()
  .catch((e) => {
    console.error('Error insertando padres de familia:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
