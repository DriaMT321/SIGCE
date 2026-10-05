import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, AssignmentStatus, AssignmentType } from '@prisma/client';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';

type AssignmentWithRelations = Prisma.AssignmentGetPayload<{
  include: { course: true; subject: true; teacher: true };
}>;

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    params: {
      courseId?: string;
      subjectId?: string;
      teacherId?: string;
      type?: AssignmentType;
      status?: AssignmentStatus;
      search?: string;
    },
    user: AuthenticatedUser,
  ) {
    const where: Prisma.AssignmentWhereInput = {
      deletedAt: null,
      ...(params.type ? { type: params.type } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.subjectId ? { subjectId: params.subjectId } : {}),
    };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { subject: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    // Caso 1: DOCENTE
    if (user.role === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (!teacher) return [];
      where.teacherId = teacher.id;
      if (params.courseId) where.courseId = params.courseId;

      return this.prisma.assignment.findMany({
        where,
        include: {
          course: true,
          subject: true,
          teacher: true,
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      });
    }

    // Caso 2: Verificar si el usuario es ESTUDIANTE (los estudiantes tienen cuenta asociada a User)
    const student = await this.prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        enrollments: {
          where: { status: 'ACTIVE' },
          include: { course: true },
          take: 1,
        },
      },
    });

    if (student) {
      const activeEnrollment = student.enrollments[0];
      if (!activeEnrollment) return [];
      where.courseId = activeEnrollment.courseId;

      const items = await this.prisma.assignment.findMany({
        where,
        include: {
          course: true,
          subject: true,
          teacher: true,
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      });

      return items.map((item) => ({
        ...item,
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        },
      }));
    }

    // Caso 3: Verificar si el usuario es PADRE / TUTOR con hijos vinculados
    const parent = await this.prisma.parent.findUnique({
      where: { userId: user.id },
      include: {
        studentParents: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: { status: 'ACTIVE' },
                  include: { course: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (parent && parent.studentParents.length > 0) {
      const results: Array<
        AssignmentWithRelations & {
          student?: { id: string; firstName: string; lastName: string };
        }
      > = [];
      for (const sp of parent.studentParents) {
        const child = sp.student;
        const enrollment = child.enrollments[0];
        if (!enrollment?.courseId) continue;

        if (params.courseId && params.courseId !== enrollment.courseId) {
          continue;
        }

        const childWhere = {
          ...where,
          courseId: enrollment.courseId,
        };

        const assignments = await this.prisma.assignment.findMany({
          where: childWhere,
          include: {
            course: true,
            subject: true,
            teacher: true,
          },
          orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        });

        for (const a of assignments) {
          results.push({
            ...a,
            student: {
              id: child.id,
              firstName: child.firstName,
              lastName: child.lastName,
            },
          });
        }
      }

      // Ordenar por fecha de entrega
      return results.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    // Caso 4: ADMIN / DIRECTOR / SECRETARY
    if (params.courseId) where.courseId = params.courseId;
    if (params.teacherId) where.teacherId = params.teacherId;

    return this.prisma.assignment.findMany({
      where,
      include: {
        course: true,
        subject: true,
        teacher: true,
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(dto: CreateAssignmentDto, user: AuthenticatedUser) {
    let teacherId = dto.teacherId;

    if (user.role === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (!teacher) {
        throw new ForbiddenException('No se encontró el registro docente para este usuario');
      }
      teacherId = teacher.id;
    }

    if (!teacherId) {
      // Buscar si hay docente asignado para esta materia y curso
      const ts = await this.prisma.teacherSubject.findFirst({
        where: { courseId: dto.courseId, subjectId: dto.subjectId },
      });
      if (ts) {
        teacherId = ts.teacherId;
      } else {
        const firstTeacher = await this.prisma.teacher.findFirst();
        if (!firstTeacher) {
          throw new NotFoundException('No existe ningún docente registrado en el sistema');
        }
        teacherId = firstTeacher.id;
      }
    }

    return this.prisma.assignment.create({
      data: {
        title: dto.title,
        type: dto.type ?? AssignmentType.TAREA,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        maxScore: dto.maxScore ?? 100,
        status: AssignmentStatus.PENDIENTE,
        courseId: dto.courseId,
        subjectId: dto.subjectId,
        teacherId,
      },
      include: {
        course: true,
        subject: true,
        teacher: true,
      },
    });
  }

  async update(id: string, dto: UpdateAssignmentDto, user: AuthenticatedUser) {
    const existing = await this.prisma.assignment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('Tarea o examen no encontrado');
    }

    if (user.role === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (!teacher || existing.teacherId !== teacher.id) {
        throw new ForbiddenException('No tienes permisos para modificar esta actividad');
      }
    }

    return this.prisma.assignment.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.type ? { type: dto.type } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
        ...(dto.maxScore !== undefined ? { maxScore: dto.maxScore } : {}),
        ...(dto.status ? { status: dto.status } : {}),
      },
      include: {
        course: true,
        subject: true,
        teacher: true,
      },
    });
  }

  async delete(id: string, user: AuthenticatedUser) {
    const existing = await this.prisma.assignment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('Tarea o examen no encontrado');
    }

    if (user.role === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (!teacher || existing.teacherId !== teacher.id) {
        throw new ForbiddenException('No tienes permisos para eliminar esta actividad');
      }
    }

    await this.prisma.assignment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: AssignmentStatus.CANCELADO,
      },
    });

    return { message: 'Actividad eliminada exitosamente' };
  }
}
