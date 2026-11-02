import { Injectable } from '@nestjs/common';
import { rolusuario } from '@academic/domain-kernel';
import { actorusuario } from '../../../../core/application/actorusuario';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  registroanuncio,
  repositorioanuncios,
} from '../../application/ports/repositorioanuncios.port';
import { alcanceanuncio } from '@academic/shared-types';

@Injectable()
export class repositorioanuncioprisma implements repositorioanuncios {
  constructor(private readonly prisma: servicioprisma) {}

  async buscarvisiblespara(usuario: actorusuario): Promise<registroanuncio[]> {
    const esmanagement = [rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY].includes(
      usuario.role as rolusuario,
    );

    if (esmanagement) {
      return this.prisma.announcement.findMany({
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, role: true, email: true },
          },
          targetCourse: { select: { id: true, name: true } },
          targetParent: {
            select: { id: true, firstName: true, lastName: true, ci: true, phone: true },
          },
          targetTeacher: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (usuario.role === rolusuario.TEACHER) {
      const docente = await this.prisma.teacher.findUnique({
        where: { userId: usuario.id },
        include: { teacherSubjects: true },
      });
      const docentecursoids = docente ? docente.teacherSubjects.map((ts) => ts.courseId) : [];

      return this.prisma.announcement.findMany({
        where: {
          OR: [
            { scope: alcanceanuncio.ALL_COURSES },
            { scope: alcanceanuncio.ALL_TEACHERS },
            ...(docente?.id ? [{ scope: alcanceanuncio.TEACHER, targetTeacherId: docente.id }] : []),
            { scope: alcanceanuncio.COURSE, targetCourseId: { in: docentecursoids } },
            ...(docente?.id
              ? [{ scope: alcanceanuncio.SPECIFIC_TEACHERS, targetUserIds: { has: docente.id } }]
              : []),
            { scope: alcanceanuncio.SPECIFIC_TEACHERS, targetUserIds: { has: usuario.id } },
          ],
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, role: true },
          },
          targetCourse: { select: { id: true, name: true } },
          targetTeacher: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (usuario.role === rolusuario.PARENT) {
      const familiar = await this.prisma.parent.findUnique({
        where: { userId: usuario.id },
        include: {
          studentParents: {
            include: {
              student: {
                include: { enrollments: { where: { status: 'ACTIVE' } } },
              },
            },
          },
        },
      });

      const hijoscursoids: string[] = [];
      const hijosids: string[] = [];
      if (familiar) {
        familiar.studentParents.forEach((sp) => {
          hijosids.push(sp.student.id);
          sp.student.enrollments.forEach((e) => {
            hijoscursoids.push(e.courseId);
          });
        });
      }

      return this.prisma.announcement.findMany({
        where: {
          OR: [
            { scope: alcanceanuncio.ALL_COURSES },
            { scope: alcanceanuncio.ALL_PARENTS },
            ...(familiar?.id ? [{ scope: alcanceanuncio.PARENT, targetParentId: familiar.id }] : []),
            { scope: alcanceanuncio.COURSE, targetCourseId: { in: hijoscursoids } },
            ...(familiar?.id
              ? [{ scope: alcanceanuncio.SPECIFIC_PARENTS, targetUserIds: { has: familiar.id } }]
              : []),
            { scope: alcanceanuncio.SPECIFIC_PARENTS, targetUserIds: { has: usuario.id } },
            ...hijosids.map((cid) => ({
              scope: alcanceanuncio.SPECIFIC_STUDENTS,
              targetUserIds: { has: cid },
            })),
          ],
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, role: true },
          },
          targetCourse: { select: { id: true, name: true } },
          targetParent: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (usuario.role === rolusuario.STUDENT) {
      const estudiante = await this.prisma.student.findFirst({
        where: { userId: usuario.id, isActive: true, deletedAt: null },
        include: { enrollments: { where: { status: 'ACTIVE' } } },
      });
      const cursoids = estudiante?.enrollments.map((inscripcion) => inscripcion.courseId) ?? [];

      return this.prisma.announcement.findMany({
        where: {
          OR: [
            { scope: alcanceanuncio.ALL_COURSES },
            { scope: alcanceanuncio.COURSE, targetCourseId: { in: cursoids } },
            ...(estudiante?.id
              ? [
                  {
                    scope: alcanceanuncio.SPECIFIC_STUDENTS,
                    targetUserIds: { has: estudiante.id },
                  },
                ]
              : []),
            { scope: alcanceanuncio.SPECIFIC_STUDENTS, targetUserIds: { has: usuario.id } },
          ],
        },
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true, role: true } },
          targetCourse: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.announcement.findMany({
      where: { scope: alcanceanuncio.ALL_COURSES },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async eliminar(id: string): Promise<boolean> {
    const resultado = await this.prisma.announcement.deleteMany({ where: { id } });
    return resultado.count === 1;
  }
}
