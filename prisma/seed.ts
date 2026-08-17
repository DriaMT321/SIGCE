import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando Seed de Base de Datos...');

  // 1. Permisos base del sistema
  const permissionsData = [
    // Módulo Usuarios & Auth
    { name: 'users:read', description: 'Ver usuarios', module: 'users' },
    { name: 'users:create', description: 'Crear usuarios', module: 'users' },
    { name: 'users:update', description: 'Editar usuarios', module: 'users' },
    { name: 'users:delete', description: 'Eliminar usuarios', module: 'users' },

    // Módulos académicos
    { name: 'academic-years:read', description: 'Ver gestiones académicas', module: 'academic-years' },
    { name: 'periods:read', description: 'Ver periodos académicos', module: 'periods' },
    { name: 'subjects:read', description: 'Ver materias', module: 'subjects' },
    { name: 'courses:read', description: 'Ver cursos', module: 'courses' },
    { name: 'courses:create', description: 'Crear cursos', module: 'courses' },
    { name: 'courses:update', description: 'Editar cursos', module: 'courses' },
    { name: 'courses:delete', description: 'Eliminar cursos', module: 'courses' },
    { name: 'enrollments:read', description: 'Ver matrículas', module: 'enrollments' },
    { name: 'enrollments:create', description: 'Crear matrículas', module: 'enrollments' },
    { name: 'enrollments:update', description: 'Editar matrículas', module: 'enrollments' },
    { name: 'alerts:read', description: 'Ver alertas', module: 'alerts' },
    { name: 'alerts:update', description: 'Marcar alertas como leídas', module: 'alerts' },

    // Módulos de comunidad educativa
    { name: 'parents:read', description: 'Ver familiares', module: 'parents' },
    { name: 'parents:create', description: 'Registrar familiares', module: 'parents' },
    { name: 'parents:update', description: 'Actualizar familiares', module: 'parents' },
    { name: 'teachers:read', description: 'Ver docentes', module: 'teachers' },
    { name: 'teachers:create', description: 'Registrar docentes', module: 'teachers' },
    { name: 'teachers:update', description: 'Actualizar docentes', module: 'teachers' },

    // Módulo Estudiantes
    { name: 'students:read', description: 'Ver estudiantes', module: 'students' },
    { name: 'students:create', description: 'Registrar estudiantes', module: 'students' },
    { name: 'students:update', description: 'Actualizar estudiantes', module: 'students' },
    { name: 'students:delete', description: 'Eliminar estudiantes', module: 'students' },

    // Módulo Calificaciones
    { name: 'grades:read', description: 'Ver calificaciones', module: 'grades' },
    { name: 'grades:create', description: 'Registrar calificaciones', module: 'grades' },
    { name: 'grades:update', description: 'Modificar calificaciones', module: 'grades' },

    // Módulo Asistencia
    { name: 'attendance:read', description: 'Ver asistencia', module: 'attendance' },
    { name: 'attendance:create', description: 'Registrar asistencia', module: 'attendance' },
    { name: 'attendance:update', description: 'Modificar asistencia', module: 'attendance' },

    // Módulo Auditoría
    { name: 'audit:read', description: 'Ver bitácora de auditoría', module: 'audit' },

    // Módulo Sincronización SIE
    { name: 'sie:read', description: 'Ver estado de sincronizaciones SIE', module: 'sie-sync' },
    { name: 'sie:execute', description: 'Ejecutar sincronización con el SIE', module: 'sie-sync' },
  ];

  console.log('  -> Insertando permisos base...');
  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description, module: perm.module },
      create: perm,
    });
  }

  // 2. Asignar permisos a roles
  const allPermissions = await prisma.permission.findMany();
  const permissionNamesByRole: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: allPermissions.map((permission) => permission.name),
    [UserRole.DIRECTOR]: [
      'users:read', 'students:read', 'students:update', 'grades:read',
      'attendance:read', 'audit:read', 'sie:read', 'sie:execute',
      'academic-years:read', 'periods:read', 'subjects:read', 'courses:read', 'courses:create', 'courses:update', 'courses:delete',
      'enrollments:read', 'enrollments:create', 'enrollments:update', 'alerts:read', 'alerts:update',
      'parents:read', 'parents:create', 'parents:update', 'teachers:read', 'teachers:create', 'teachers:update',
    ],
    [UserRole.SECRETARY]: [
      'users:read', 'students:read', 'students:create', 'students:update',
      'sie:read', 'sie:execute', 'academic-years:read', 'periods:read', 'subjects:read',
      'courses:read', 'courses:create', 'courses:update', 'enrollments:read', 'enrollments:create', 'enrollments:update', 'alerts:read', 'alerts:update',
      'parents:read', 'parents:create', 'parents:update', 'teachers:read', 'teachers:create', 'teachers:update',
    ],
    [UserRole.TEACHER]: [
      'students:read', 'grades:read', 'grades:create', 'grades:update',
      'attendance:read', 'attendance:create', 'attendance:update', 'sie:read', 'academic-years:read', 'periods:read', 'subjects:read', 'courses:read', 'enrollments:read', 'alerts:read', 'alerts:update', 'teachers:read',
    ],
    [UserRole.PARENT]: ['students:read', 'grades:read', 'attendance:read', 'enrollments:read', 'academic-years:read', 'periods:read', 'subjects:read', 'alerts:read', 'alerts:update'],
  };

  console.log('  -> Asignando permisos a roles...');
  for (const [role, permissionNames] of Object.entries(permissionNamesByRole) as [UserRole, string[]][]) {
    for (const permission of allPermissions.filter((item) => permissionNames.includes(item.name))) {
      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          role,
          permissionId: permission.id,
        },
      });
    }
  }

  // 3. Crear usuario administrador inicial
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD son obligatorias para ejecutar el seed');
  }
  const adminFirstName = process.env.SEED_ADMIN_FIRST_NAME || 'Administrador';
  const adminLastName = process.env.SEED_ADMIN_LAST_NAME || 'General';

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: adminFirstName,
      lastName: adminLastName,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash: passwordHash,
      firstName: adminFirstName,
      lastName: adminLastName,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log(`  -> Usuario Admin preparado: ${adminUser.email} (Rol: ${adminUser.role})`);

  // 4. Crear año académico inicial (2026) y periodos trimestrales
  const currentYear = 2026;
  const academicYear = await prisma.academicYear.upsert({
    where: { year: currentYear },
    update: {
      name: `Gestión Académica ${currentYear}`,
      isActive: true,
    },
    create: {
      year: currentYear,
      name: `Gestión Académica ${currentYear}`,
      startDate: new Date(`${currentYear}-02-01T00:00:00.000Z`),
      endDate: new Date(`${currentYear}-11-30T23:59:59.000Z`),
      isActive: true,
      isClosed: false,
    },
  });

  // 3 Trimestres
  const periods = [
    { number: 1, name: '1er Trimestre', start: `${currentYear}-02-01`, end: `${currentYear}-05-15` },
    { number: 2, name: '2do Trimestre', start: `${currentYear}-05-16`, end: `${currentYear}-08-31` },
    { number: 3, name: '3er Trimestre', start: `${currentYear}-09-01`, end: `${currentYear}-11-30` },
  ];

  for (const p of periods) {
    await prisma.academicPeriod.upsert({
      where: {
        academicYearId_number: {
          academicYearId: academicYear.id,
          number: p.number,
        },
      },
      update: {
        name: p.name,
        startDate: new Date(`${p.start}T00:00:00.000Z`),
        endDate: new Date(`${p.end}T23:59:59.000Z`),
      },
      create: {
        academicYearId: academicYear.id,
        name: p.name,
        number: p.number,
        startDate: new Date(`${p.start}T00:00:00.000Z`),
        endDate: new Date(`${p.end}T23:59:59.000Z`),
        isClosed: false,
      },
    });
  }

  // 5. Materias base
  const subjectsData = [
    { name: 'Matemática', code: 'MAT-SEC', area: 'Ciencia y Tecnología' },
    { name: 'Lenguaje y Comunicación', code: 'LEN-SEC', area: 'Humanidades' },
    { name: 'Ciencias Naturales: Física', code: 'FIS-SEC', area: 'Ciencia y Tecnología' },
    { name: 'Ciencias Naturales: Química', code: 'QUI-SEC', area: 'Ciencia y Tecnología' },
    { name: 'Ciencias Sociales: Historia', code: 'HIS-SEC', area: 'Ciencias Sociales' },
    { name: 'Lengua Extranjera: Inglés', code: 'ING-SEC', area: 'Humanidades' },
    { name: 'Educación Física y Deportes', code: 'EFD-SEC', area: 'Deportes' },
  ];

  for (const s of subjectsData) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: { name: s.name, area: s.area },
      create: s,
    });
  }

  // 6. Registro de auditoría inicial del seed
  const bootstrapAudit = await prisma.auditLog.findFirst({
    where: {
      userId: adminUser.id,
      action: 'CREATE',
      entity: 'SystemBootstrap',
      entityId: adminUser.id,
    },
  });
  if (!bootstrapAudit) {
    await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'CREATE',
      entity: 'SystemBootstrap',
      entityId: adminUser.id,
      newValue: {
        event: 'DATABASE_INITIALIZED_AND_SEEDED',
        timestamp: new Date().toISOString(),
      },
      ipAddress: '127.0.0.1',
        userAgent: 'PrismaSeed/1.0',
      },
    });
  }

  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
