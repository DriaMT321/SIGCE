import { Injectable } from '@nestjs/common';
import { alcanceanuncio, rolusuario } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { resolvedordestinatariosanuncio } from '../../application/ports/anunciodestinatarioresolvedor.port';
import { datoscreacionanuncio } from '../../application/ports/repositorioanuncios.port';

@Injectable()
export class resolvedordestinatariosanuncioprisma implements resolvedordestinatariosanuncio {
  constructor(private readonly prisma: servicioprisma) {}

  async resolverdestinatarios(datos: datoscreacionanuncio): Promise<string[]> {
    const idsdestinatarios = datos.targetUserIds ?? [];

    switch (datos.scope) {
      case alcanceanuncio.ALL_PARENTS: {
        const familiares = await this.prisma.parent.findMany({ select: { userId: true } });
        return familiares.map((familiar) => familiar.userId);
      }
      case alcanceanuncio.ALL_TEACHERS: {
        const docentes = await this.prisma.teacher.findMany({ select: { userId: true } });
        return docentes.map((docente) => docente.userId);
      }
      case alcanceanuncio.PARENT: {
        if (!datos.targetParentId) return [];
        const familiar = await this.prisma.parent.findUnique({
          where: { id: datos.targetParentId },
          select: { userId: true },
        });
        return familiar ? [familiar.userId] : [];
      }
      case alcanceanuncio.TEACHER: {
        if (!datos.targetTeacherId) return [];
        const docente = await this.prisma.teacher.findUnique({
          where: { id: datos.targetTeacherId },
          select: { userId: true },
        });
        return docente ? [docente.userId] : [];
      }
      case alcanceanuncio.SPECIFIC_PARENTS: {
        if (idsdestinatarios.length === 0) return [];
        const familiares = await this.prisma.parent.findMany({
          where: { id: { in: idsdestinatarios } },
          select: { userId: true },
        });
        return familiares.map((familiar) => familiar.userId);
      }
      case alcanceanuncio.SPECIFIC_TEACHERS: {
        if (idsdestinatarios.length === 0) return [];
        const docentes = await this.prisma.teacher.findMany({
          where: { id: { in: idsdestinatarios } },
          select: { userId: true },
        });
        return docentes.map((docente) => docente.userId);
      }
      case alcanceanuncio.SPECIFIC_STUDENTS: {
        if (idsdestinatarios.length === 0) return [];
        const estudiantes = await this.prisma.student.findMany({
          where: { id: { in: idsdestinatarios } },
          include: { studentParents: { include: { parent: true } } },
        });
        const idsusuariosestudiantes = estudiantes
          .map((estudiante) => estudiante.userId)
          .filter((id): id is string => Boolean(id));
        const idsusuariosfamiliares = estudiantes.flatMap((estudiante) =>
          estudiante.studentParents.map((relacion) => relacion.parent.userId),
        );
        return [...new Set([...idsusuariosestudiantes, ...idsusuariosfamiliares])];
      }
      case alcanceanuncio.COURSE: {
        if (!datos.targetCourseId) return [];
        const [matriculas, asignacionesdocentes] = await Promise.all([
          this.prisma.enrollment.findMany({
            where: { courseId: datos.targetCourseId, status: 'ACTIVE' },
            include: {
              student: {
                include: { studentParents: { include: { parent: true } } },
              },
            },
          }),
          this.prisma.teacherSubject.findMany({
            where: { courseId: datos.targetCourseId },
            include: { teacher: true },
          }),
        ]);
        const idsusuariosestudiantes = matriculas
          .map((matricula) => matricula.student.userId)
          .filter((id): id is string => Boolean(id));
        const idsusuariosfamiliares = matriculas.flatMap((matricula) =>
          matricula.student.studentParents.map((relacion) => relacion.parent.userId),
        );
        const idsusuariosdocentes = asignacionesdocentes.map(
          (asignacion) => asignacion.teacher.userId,
        );
        return [
          ...new Set([...idsusuariosestudiantes, ...idsusuariosfamiliares, ...idsusuariosdocentes]),
        ];
      }
      case alcanceanuncio.ALL_COURSES: {
        const usuarios = await this.prisma.user.findMany({
          where: { role: { in: [rolusuario.PARENT, rolusuario.TEACHER, rolusuario.STUDENT] } },
          select: { id: true },
        });
        return usuarios.map((usuario) => usuario.id);
      }
      default:
        return [];
    }
  }
}
