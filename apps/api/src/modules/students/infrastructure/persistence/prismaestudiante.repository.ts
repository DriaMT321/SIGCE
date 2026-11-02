import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditAction as PrismaAuditAction,
  Prisma,
  RelationshipType,
  UserRole as PrismaUserRole,
} from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { entidadestudiante } from '../../domain/entities/estudiante.entity';
import {
  datoscreacionestudiante,
  datosconfiguracioncuentaestudiante,
  contextoauditoriaestudiante,
  repositorioestudiantes,
  datosactualizacionestudiante,
} from '../../domain/repositories/estudiante.repository.interface';

function assignedinscripcionfiltro(idusuariodocente: string) {
  return {
    status: 'ACTIVE' as const,
    academicYear: { isActive: true },
    course: {
      teacherSubjects: {
        some: {
          teacher: { userId: idusuariodocente, deletedAt: null },
          academicYear: { isActive: true },
        },
      },
    },
  };
}

function sameauditoriavalor(antes: unknown, after: unknown): boolean {
  if (antes instanceof Date && after instanceof Date) {
    return antes.getTime() === after.getTime();
  }
  return Object.is(antes, after);
}

@Injectable()
export class repositorioestudianteprisma implements repositorioestudiantes {
  constructor(private readonly prisma: servicioprisma) {}

  async buscarcoincidencias(consulta: { rude?: string; ci?: string }) {
    const condiciones: Prisma.StudentWhereInput[] = [];
    if (consulta.rude) condiciones.push({ rude: consulta.rude });
    if (consulta.ci) condiciones.push({ ci: consulta.ci });
    if (!condiciones.length) return [];
    return this.prisma.student.findMany({
      where: { OR: condiciones },
      select: { id: true, rude: true, ci: true, firstName: true, lastName: true, isActive: true, deletedAt: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async buscartodos(consulta: {
    search?: string;
    courseId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    if (consulta.teacherUserId && consulta.courseId) {
      const asignacion = await this.prisma.teacherSubject.findFirst({
        where: {
          teacher: { userId: consulta.teacherUserId, deletedAt: null },
          courseId: consulta.courseId,
          academicYear: { isActive: true },
          course: { academicYear: { isActive: true } },
        },
        select: { id: true },
      });
      if (!asignacion) {
        throw new ForbiddenException('El docente no tiene asignación académica para este curso');
      }
    }
    const where = {
      deletedAt: null,
      ...(consulta.parentUserId
        ? {
            OR: [
              { studentParents: { some: { parent: { userId: consulta.parentUserId } } } },
              { userId: consulta.parentUserId },
            ],
          }
        : {}),
      ...(consulta.teacherUserId || consulta.courseId
        ? {
            enrollments: {
              some: {
                ...(consulta.teacherUserId ? assignedinscripcionfiltro(consulta.teacherUserId) : { status: 'ACTIVE' as const }),
                ...(consulta.courseId ? { courseId: consulta.courseId } : {}),
              },
            },
          }
        : {}),
      ...(consulta.search
        ? {
            AND: [
              {
                OR: [
                  { firstName: { contains: consulta.search, mode: 'insensitive' as const } },
                  { lastName: { contains: consulta.search, mode: 'insensitive' as const } },
                  { rude: { contains: consulta.search, mode: 'insensitive' as const } },
                  { ci: { contains: consulta.search, mode: 'insensitive' as const } },
                ],
              },
            ],
          }
        : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }, { id: 'asc' }],
        include: {
          enrollments: {
            where: {
              ...(consulta.teacherUserId ? assignedinscripcionfiltro(consulta.teacherUserId) : { status: 'ACTIVE' }),
              ...(consulta.courseId ? { courseId: consulta.courseId } : {}),
            },
            orderBy: [
              { academicYear: { isActive: 'desc' } },
              { academicYear: { year: 'desc' } },
              { enrollmentDate: 'desc' },
              { id: 'asc' },
            ],
            include: { course: true, academicYear: true },
          },
          studentParents: {
            ...(consulta.parentUserId
              ? { where: { parent: { userId: consulta.parentUserId } } }
              : {}),
            include: {
              parent: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);
    return {
      items: elementos.map((elemento) =>
        this.mapa(elemento, !consulta.parentUserId && !consulta.teacherUserId),
      ),
      total,
    };
  }

  async buscarporidentificador(id: string, idusuariofamiliar?: string, idusuariodocente?: string) {
    const where = {
      id,
      deletedAt: null,
      ...(idusuariofamiliar
        ? {
            OR: [
              { studentParents: { some: { parent: { userId: idusuariofamiliar } } } },
              { userId: idusuariofamiliar },
            ],
          }
        : {}),
      ...(idusuariodocente
        ? { enrollments: { some: assignedinscripcionfiltro(idusuariodocente) } }
        : {}),
    };
    const estudiante = await this.prisma.student.findFirst({
      where,
      include: {
        enrollments: {
          ...(idusuariodocente ? { where: assignedinscripcionfiltro(idusuariodocente) } : {}),
          orderBy: [
            { academicYear: { isActive: 'desc' } },
            { academicYear: { year: 'desc' } },
            { enrollmentDate: 'desc' },
            { id: 'asc' },
          ],
          include: { course: true, academicYear: true },
        },
        studentParents: {
          ...(idusuariofamiliar ? { where: { parent: { userId: idusuariofamiliar } } } : {}),
          include: { parent: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });
    return estudiante ? this.mapa(estudiante, !idusuariofamiliar && !idusuariodocente) : null;
  }

  async crear(
    datos: datoscreacionestudiante,
    cuentaconfiguracion: datosconfiguracioncuentaestudiante,
    auditoria: contextoauditoriaestudiante,
  ) {
    const { parentId: familiarid, relationship, ...estudiantecampos } = datos;

    const estudiante = await this.prisma
      .$transaction(async (tx) => {
        const creado = await tx.student.create({
          data: {
            ...estudiantecampos,
            gender: estudiantecampos.gender as 'MALE' | 'FEMALE' | 'UNSPECIFIED',
          },
        });

        const usuario = await tx.user.create({
          data: {
            email: `student.${creado.id}@accounts.sigce.local`,
            passwordHash: cuentaconfiguracion.placeholderPasswordHash,
            passwordSetupTokenHash: cuentaconfiguracion.activationTokenHash,
            passwordSetupExpiresAt: cuentaconfiguracion.activationExpiresAt,
            passwordSetupRequired: true,
            credentialVersion: 1,
            firstName: estudiantecampos.firstName,
            lastName: estudiantecampos.lastName,
            role: PrismaUserRole.STUDENT,
          },
        });
        await tx.student.update({ where: { id: creado.id }, data: { userId: usuario.id } });

        if (familiarid) {
          const familiar = await tx.parent.findUnique({ where: { id: familiarid } });
          if (familiar) {
            const rel =
              relationship &&
              Object.values(RelationshipType).includes(relationship as RelationshipType)
                ? (relationship as RelationshipType)
                : RelationshipType.TUTOR;

            await tx.studentParent.create({
              data: {
                studentId: creado.id,
                parentId: familiar.id,
                relationship: rel,
                isPrimary: true,
                canPickup: true,
              },
            });
          }
        }

        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'Student',
            entityId: creado.id,
            studentIds: [creado.id],
            newValue: auditoria.newValue as Prisma.InputJsonValue,
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });

        return tx.student.findUniqueOrThrow({
          where: { id: creado.id },
          include: {
            enrollments: {
              orderBy: [
                { academicYear: { isActive: 'desc' } },
                { academicYear: { year: 'desc' } },
                { enrollmentDate: 'desc' },
                { id: 'asc' },
              ],
              include: { course: true, academicYear: true },
            },
            studentParents: {
              include: { parent: { select: { id: true, firstName: true, lastName: true } } },
            },
          },
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new ConflictException('Ya existe un estudiante con ese RUDE o CI');
        }
        throw error;
      });

    return this.mapa(estudiante);
  }

  async reemitiractivacion(
    id: string,
    cuentaconfiguracion: datosconfiguracioncuentaestudiante,
    auditoria: contextoauditoriaestudiante,
  ): Promise<string | null> {
    return this.prisma.$transaction(async (tx) => {
      const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "students"
        WHERE "id" = ${id} AND "is_active" = true AND "deleted_at" IS NULL
        FOR UPDATE
      `;
      if (bloqueado.length === 0) return null;

      const estudiante = await tx.student.findFirst({
        where: { id, isActive: true, deletedAt: null },
        select: { id: true, userId: true, firstName: true, lastName: true },
      });
      if (!estudiante) return null;

      if (estudiante.userId) {
        const usuario = await tx.user.findUnique({
          where: { id: estudiante.userId },
          select: { id: true, role: true, isActive: true, deletedAt: true },
        });
        if (
          !usuario ||
          usuario.role !== PrismaUserRole.STUDENT ||
          !usuario.isActive ||
          usuario.deletedAt
        ) {
          return null;
        }
        await tx.user.update({
          where: { id: usuario.id },
          data: {
            passwordSetupTokenHash: cuentaconfiguracion.activationTokenHash,
            passwordSetupExpiresAt: cuentaconfiguracion.activationExpiresAt,
            passwordSetupRequired: true,
            credentialVersion: { increment: 1 },
          },
        });
        await tx.refreshToken.updateMany({
          where: { userId: usuario.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'StudentAccountActivation',
            entityId: usuario.id,
            studentIds: [id],
            newValue: { activationReissued: true },
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return usuario.id;
      }

      const usuario = await tx.user.create({
        data: {
          email: `student.${estudiante.id}@accounts.sigce.local`,
          passwordHash: cuentaconfiguracion.placeholderPasswordHash,
          passwordSetupTokenHash: cuentaconfiguracion.activationTokenHash,
          passwordSetupExpiresAt: cuentaconfiguracion.activationExpiresAt,
          passwordSetupRequired: true,
          credentialVersion: 1,
          firstName: estudiante.firstName,
          lastName: estudiante.lastName,
          role: PrismaUserRole.STUDENT,
        },
      });
      const asociacion = await tx.student.updateMany({
        where: { id: estudiante.id, userId: null, isActive: true, deletedAt: null },
        data: { userId: usuario.id },
      });
      if (asociacion.count !== 1) throw new NotFoundException('Estudiante no encontrado');
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: PrismaAuditAction.UPDATE,
          entity: 'StudentAccountActivation',
          entityId: usuario.id,
          studentIds: [id],
          newValue: { activationReissued: true },
          ipAddress: auditoria.ipAddress,
          correlationId: auditoria.correlationId,
        },
      });
      return usuario.id;
    });
  }

  async actualizar(
    id: string,
    datos: datosactualizacionestudiante,
    auditoria: contextoauditoriaestudiante,
  ) {
    try {
      const estudiante = await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "students"
          WHERE "id" = ${id} AND "deleted_at" IS NULL
          FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Estudiante no encontrado');
        const anterior = await tx.student.findFirst({ where: { id, deletedAt: null } });
        if (!anterior) throw new NotFoundException('Estudiante no encontrado');
        const { parentId: familiarid, relationship, gender, ...campos } = datos;
        let relacionfamiliaranterior: { relationship: RelationshipType } | null = null;
        let relacionfamiliaractual: RelationshipType | null = null;
        if (familiarid) {
          const familiar = await tx.parent.findFirst({
            where: { id: familiarid, deletedAt: null },
            select: { id: true },
          });
          if (!familiar) throw new NotFoundException('Padre o tutor no encontrado');

          const relacionexistente = await tx.studentParent.findUnique({
            where: { studentId_parentId: { studentId: id, parentId: familiar.id } },
            select: { relationship: true },
          });
          relacionfamiliaranterior = relacionexistente;
          relacionfamiliaractual = relationship &&
            Object.values(RelationshipType).includes(relationship as RelationshipType)
            ? (relationship as RelationshipType)
            : RelationshipType.TUTOR;
          const yaexisteprincipal = await tx.studentParent.count({
            where: { studentId: id, isPrimary: true },
          });
          await tx.studentParent.upsert({
            where: { studentId_parentId: { studentId: id, parentId: familiar.id } },
            update: { relationship: relacionfamiliaractual },
            create: {
              studentId: id,
              parentId: familiar.id,
              relationship: relacionfamiliaractual,
              isPrimary: yaexisteprincipal === 0,
              canPickup: true,
            },
          });
        }
        if (anterior.userId && (datos.firstName !== undefined || datos.lastName !== undefined)) {
          await tx.user.update({
            where: { id: anterior.userId },
            data: {
              ...(datos.firstName !== undefined ? { firstName: datos.firstName } : {}),
              ...(datos.lastName !== undefined ? { lastName: datos.lastName } : {}),
            },
          });
        }
        const actualizado = await tx.student.update({
          where: { id, deletedAt: null },
          data: {
            ...campos,
            ...(gender ? { gender: gender as 'MALE' | 'FEMALE' | 'UNSPECIFIED' } : {}),
          },
          include: {
            enrollments: {
              orderBy: [
                { academicYear: { isActive: 'desc' } },
                { academicYear: { year: 'desc' } },
                { enrollmentDate: 'desc' },
                { id: 'asc' },
              ],
              include: { course: true, academicYear: true },
            },
            studentParents: {
              include: { parent: { select: { id: true, firstName: true, lastName: true } } },
            },
          },
        });
        const valoranterior: Record<string, unknown> = {};
        const valornuevo: Record<string, unknown> = {};
        for (const clave of Object.keys(datos)) {
          if (clave === 'parentId' || clave === 'relationship') continue;
          const antes = (anterior as unknown as Record<string, unknown>)[clave];
          const after = (actualizado as unknown as Record<string, unknown>)[clave];
          if (!sameauditoriavalor(antes, after)) {
            valoranterior[clave] = antes ?? null;
            valornuevo[clave] = after ?? null;
          }
        }
        if (familiarid && relacionfamiliaractual) {
          valoranterior.parentLink = relacionfamiliaranterior
            ? { parentId: familiarid, relationship: relacionfamiliaranterior.relationship }
            : null;
          valornuevo.parentLink = { parentId: familiarid, relationship: relacionfamiliaractual };
        }
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Student',
            entityId: id,
            studentIds: [id],
            previousValue: valoranterior as Prisma.InputJsonValue,
            newValue: valornuevo as Prisma.InputJsonValue,
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return actualizado;
      });
      return this.mapa(estudiante);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe un estudiante con ese RUDE o CI');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Estudiante no encontrado');
      }
      throw error;
    }
  }

  async eliminarlogicamente(id: string, auditoria: contextoauditoriaestudiante) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "students"
          WHERE "id" = ${id} AND "deleted_at" IS NULL
          FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Estudiante no encontrado');
        const estudiante = await tx.student.findFirst({ where: { id, deletedAt: null } });
        if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
        const fechadebaja = new Date();
        await tx.student.update({
          where: { id, deletedAt: null },
          data: { deletedAt: fechadebaja, isActive: false },
        });
        if (estudiante.userId) {
          await tx.user.update({
            where: { id: estudiante.userId },
            data: { deletedAt: fechadebaja, isActive: false },
          });
        }
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.DELETE,
            entity: 'Student',
            entityId: id,
            studentIds: [id],
            previousValue: {
              rude: estudiante.rude,
              ci: estudiante.ci,
              firstName: estudiante.firstName,
              lastName: estudiante.lastName,
              isActive: estudiante.isActive,
            },
            newValue: { isActive: false, deleted: true },
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Estudiante no encontrado');
      }
      throw error;
    }
  }

  private mapa(
    estudiante: Awaited<ReturnType<servicioprisma['student']['findFirst']>> & {
      enrollments?: unknown;
      studentParents?: unknown;
    },
    mostrarTutores = true,
  ): entidadestudiante {
    const valor = estudiante as NonNullable<
      Awaited<ReturnType<servicioprisma['student']['findFirst']>>
    > & {
      enrollments?: Array<{
        id: string;
        status: string;
        course: { id: string; name: string; gradeLevel: number; section: string };
        academicYear: { id: string; year: number; name: string };
      }>;
      studentParents?: Array<{
        id: string;
        relationship: string;
        isPrimary: boolean;
        canPickup: boolean;
        parent: {
          id: string;
          firstName: string;
          lastName: string;
        };
      }>;
    };
    return {
      id: valor.id,
      rude: valor.rude,
      ci: valor.ci,
      firstName: valor.firstName,
      lastName: valor.lastName,
      birthDate: valor.birthDate,
      gender: valor.gender,
      address: valor.address,
      phone: valor.phone,
      isActive: valor.isActive,
      createdAt: valor.createdAt,
      updatedAt: valor.updatedAt,
      enrollments: valor.enrollments ?? [],
      parents: mostrarTutores
        ? (valor.studentParents ?? []).map((sp) => ({
            id: sp.id,
            relationship: sp.relationship,
            isPrimary: sp.isPrimary,
            canPickup: sp.canPickup,
            parent: {
              id: sp.parent.id,
              firstName: sp.parent.firstName,
              lastName: sp.parent.lastName,
            },
          }))
        : [],
    };
  }
}
