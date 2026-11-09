import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { rolusuario } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import type { actorusuario } from '../../../../core/application/actorusuario';
import type {
  datosactualizareventoacademico,
  datoscreacioneventoacademico,
  filtroslistadoeventosacademicos,
  registroeventoacademico,
  repositorioeventosacademicos,
} from '../../application/ports/eventosacademicos.port';

const incluirrelaciones = {
  targetCourse: { select: { id: true, name: true, gradeLevel: true, section: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.AcademicEventInclude;

@Injectable()
export class prismaeventosacademicosrepository implements repositorioeventosacademicos {
  constructor(private readonly prisma: servicioprisma) {}

  async buscarcursosvisibles(usuario: actorusuario): Promise<string[]> {
    if (usuario.role === rolusuario.TEACHER) {
      const docente = await this.prisma.teacher.findUnique({
        where: { userId: usuario.id, deletedAt: null },
        select: {
          teacherSubjects: {
            where: { academicYear: { isActive: true } },
            select: { courseId: true },
          },
        },
      });
      return [...new Set(docente?.teacherSubjects.map((asignacion) => asignacion.courseId) ?? [])];
    }

    if (usuario.role === rolusuario.STUDENT) {
      const estudiante = await this.prisma.student.findFirst({
        where: { userId: usuario.id, isActive: true, deletedAt: null },
        select: {
          enrollments: {
            where: { status: 'ACTIVE', course: { academicYear: { isActive: true } } },
            select: { courseId: true },
          },
        },
      });
      return [...new Set(estudiante?.enrollments.map((matricula) => matricula.courseId) ?? [])];
    }

    if (usuario.role === rolusuario.PARENT) {
      const familiar = await this.prisma.parent.findUnique({
        where: { userId: usuario.id },
        select: {
          studentParents: {
            where: { student: { isActive: true, deletedAt: null } },
            select: {
              student: {
                select: {
                  enrollments: {
                    where: { status: 'ACTIVE', course: { academicYear: { isActive: true } } },
                    select: { courseId: true },
                  },
                },
              },
            },
          },
        },
      });
      const ids =
        familiar?.studentParents.flatMap((relacion) =>
          relacion.student.enrollments.map((matricula) => matricula.courseId),
        ) ?? [];
      return [...new Set(ids)];
    }

    return [];
  }

  async docentetieneasignacion(usuarioId: string, cursoId: string): Promise<boolean> {
    const asignacion = await this.prisma.teacherSubject.findFirst({
      where: {
        courseId: cursoId,
        teacher: { userId: usuarioId, deletedAt: null },
        course: { academicYear: { isActive: true } },
      },
      select: { id: true },
    });
    return Boolean(asignacion);
  }

  async existecurso(cursoId: string): Promise<boolean> {
    const curso = await this.prisma.course.findUnique({
      where: { id: cursoId },
      select: { id: true },
    });
    return Boolean(curso);
  }

  listar(filtros: filtroslistadoeventosacademicos): Promise<registroeventoacademico[]> {
    const condiciones: Prisma.AcademicEventWhereInput[] = [];
    if (!filtros.sinrestricciondecursos) {
      condiciones.push({
        OR: [
          { targetCourseId: null },
          { targetCourseId: { in: filtros.cursosvisibles } },
        ],
      });
    }
    if (filtros.courseId) {
      condiciones.push({
        OR: [{ targetCourseId: null }, { targetCourseId: filtros.courseId }],
      });
    }
    if (filtros.desde || filtros.hasta) {
      condiciones.push({
        ...(filtros.desde ? { endsAt: { gte: filtros.desde } } : {}),
        ...(filtros.hasta ? { startsAt: { lt: filtros.hasta } } : {}),
      });
    }

    return this.prisma.academicEvent.findMany({
      where: { AND: condiciones },
      include: incluirrelaciones,
      orderBy: [{ startsAt: 'asc' }, { title: 'asc' }],
    });
  }

  buscarporid(id: string): Promise<registroeventoacademico | null> {
    return this.prisma.academicEvent.findUnique({
      where: { id },
      include: incluirrelaciones,
    });
  }

  crear(datos: datoscreacioneventoacademico): Promise<registroeventoacademico> {
    return this.prisma.academicEvent.create({
      data: {
        ...datos,
        targetCourseId: datos.targetCourseId ?? null,
      },
      include: incluirrelaciones,
    });
  }

  actualizar(id: string, datos: datosactualizareventoacademico): Promise<registroeventoacademico> {
    const { targetCourseId, ...campos } = datos;
    return this.prisma.academicEvent.update({
      where: { id },
      data: {
        ...campos,
        ...(targetCourseId !== undefined
          ? targetCourseId
            ? { targetCourse: { connect: { id: targetCourseId } } }
            : { targetCourse: { disconnect: true } }
          : {}),
      },
      include: incluirrelaciones,
    });
  }
}

