import { Injectable } from '@nestjs/common';
import { CurriculumStatus as PrismaCurriculumStatus, Prisma } from '@prisma/client';
import { estadoplanestudio } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { errorprohibido } from '../../../../core/application/aplicacionerror';
import {
  actualizacionavancecurricular,
  repositoriocurriculo,
  datoscreaciontemacurricular,
  filtrostemascurriculares,
  registrotemacurricular,
} from '../../domain/repositories/curriculo.repository.interface';

type curriculumtemaconrelations = Prisma.CurriculumTopicGetPayload<{
  include: { subject: true; course: true };
}>;

@Injectable()
export class repositoriocurriculoprisma implements repositoriocurriculo {
  constructor(private readonly prisma: servicioprisma) {}

  async buscaridanioacademicoactivo(): Promise<string | null> {
    const gestion = await this.prisma.academicYear.findFirst({
      where: { isActive: true },
      orderBy: { year: 'desc' },
      select: { id: true },
    });
    return gestion?.id ?? null;
  }

  async buscartemas(filtros: filtrostemascurriculares): Promise<registrotemacurricular[]> {
    const asignaciones = filtros.teacherUserId ? await this.prisma.teacherSubject.findMany({
      where: { teacher: { userId: filtros.teacherUserId, deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
      select: { courseId: true, subjectId: true, academicYearId: true },
    }) : undefined;
    if (asignaciones && (filtros.courseId || filtros.subjectId) && !asignaciones.some((asignacion) =>
      (!filtros.courseId || asignacion.courseId === filtros.courseId) && (!filtros.subjectId || asignacion.subjectId === filtros.subjectId))) {
      throw new errorprohibido('El docente no tiene asignación para el curso o la materia solicitada');
    }
    if (asignaciones && asignaciones.length === 0) return [];
    const where: Prisma.CurriculumTopicWhereInput = {
      ...(asignaciones ? { AND: [{ OR: asignaciones.map((asignacion) => ({
        courseId: asignacion.courseId,
        subjectId: asignacion.subjectId,
        academicYearId: asignacion.academicYearId,
        course: { teacherSubjects: { some: {
          subjectId: asignacion.subjectId,
          academicYearId: asignacion.academicYearId,
          teacher: { userId: filtros.teacherUserId, deletedAt: null },
        } } },
      })) }] } : {}),
      ...(filtros.academicYearId ? { academicYearId: filtros.academicYearId } : {}),
      ...(filtros.courseId ? { courseId: filtros.courseId } : {}),
      ...(filtros.gradeLevel ? { gradeLevel: filtros.gradeLevel } : {}),
      ...(filtros.subjectId ? { subjectId: filtros.subjectId } : {}),
      ...(filtros.periodNumber ? { periodNumber: filtros.periodNumber } : {}),
      ...(filtros.status ? { status: filtros.status as unknown as PrismaCurriculumStatus } : {}),
      ...(filtros.search
        ? {
            OR: [
              { title: { contains: filtros.search, mode: 'insensitive' } },
              { unitTitle: { contains: filtros.search, mode: 'insensitive' } },
              { campo: { contains: filtros.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const temas = await this.prisma.curriculumTopic.findMany({
      where,
      include: { subject: true, course: true },
      orderBy: [{ gradeLevel: 'asc' }, { periodNumber: 'asc' }, { unitTitle: 'asc' }],
    });
    return temas.map(mapatema);
  }

  async actualizarprogreso(
    id: string,
    datos: actualizacionavancecurricular,
  ): Promise<registrotemacurricular | null> {
    try {
      const tema = await this.prisma.curriculumTopic.update({
        where: { id },
        data: {
          ...(datos.status ? { status: datos.status as unknown as PrismaCurriculumStatus } : {}),
          ...(datos.progressPercent !== undefined
            ? { progressPercent: datos.progressPercent }
            : {}),
        },
        include: { subject: true, course: true },
      });
      return mapatema(tema);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
        return null;
      throw error;
    }
  }

  async actualizarprogresodocente(
    id: string,
    datos: actualizacionavancecurricular,
    idusuario: string,
  ): Promise<registrotemacurricular | null> {
    return this.prisma.$transaction(async (tx) => {
      const asignaciones = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT ct."id"
        FROM "curriculum_topics" AS ct
        INNER JOIN "teacher_subjects" AS ts
          ON ts."course_id" = ct."course_id"
          AND ts."subject_id" = ct."subject_id"
          AND ts."academic_year_id" = ct."academic_year_id"
        INNER JOIN "teachers" AS t ON t."id" = ts."teacher_id"
        WHERE ct."id" = ${id}
          AND t."user_id" = ${idusuario}
          AND t."deleted_at" IS NULL
        FOR UPDATE OF ct, ts, t
      `;
      if (asignaciones.length === 0) {
        const tema = await tx.curriculumTopic.findUnique({
          where: { id },
          select: { id: true },
        });
        if (!tema) return null;
        throw new errorprohibido('El docente no tiene asignación para este tema curricular');
      }

      const tema = await tx.curriculumTopic.update({
        where: { id },
        data: {
          ...(datos.status ? { status: datos.status as unknown as PrismaCurriculumStatus } : {}),
          ...(datos.progressPercent !== undefined
            ? { progressPercent: datos.progressPercent }
            : {}),
        },
        include: { subject: true, course: true },
      });
      return mapatema(tema);
    });
  }

  async creartema(datos: datoscreaciontemacurricular): Promise<registrotemacurricular> {
    const tema = await this.prisma.curriculumTopic.create({
      data: {
        ...datos,
        status: PrismaCurriculumStatus.PLANIFICADO,
        progressPercent: 0,
      },
      include: { subject: true, course: true },
    });
    return mapatema(tema);
  }
}

function mapatema(tema: curriculumtemaconrelations): registrotemacurricular {
  return {
    ...tema,
    status: tema.status as unknown as estadoplanestudio,
    course: tema.course ? { ...tema.course, shift: tema.course.shift } : null,
  };
}
