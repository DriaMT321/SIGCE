import { Injectable } from '@nestjs/common';
import {
  AssignmentStatus as PrismaAssignmentStatus,
  AssignmentType as PrismaAssignmentType,
  Prisma,
} from '@prisma/client';
import { estadoasignacion, tipoasignacion } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  datoscreaciontarea,
  consultatareas,
  registrotarea,
  repositoriotareas,
  datosactualizaciontarea,
  destinatarioestudiantetarea,
  asignacionconestudiantesysubmissions,
  calificacionestudianteentrada,
} from '../../domain/repositories/tarea.repository.interface';

type asignacionconrelations = Prisma.AssignmentGetPayload<{
  include: {
    course: true;
    subject: true;
    teacher: true;
    submissions: {
      select: {
        id: true;
        studentId: true;
        score: true;
        feedback: true;
        status: true;
        gradedAt: true;
      };
    };
  };
}>;

@Injectable()
export class repositoriotareaprisma implements repositoriotareas {
  constructor(private readonly prisma: servicioprisma) {}

  async buscariddocente(idusuario: string): Promise<string | null> {
    const docente = await this.prisma.teacher.findUnique({
      where: { userId: idusuario },
      select: { id: true },
    });
    return docente?.id ?? null;
  }

  async buscardestinatarioestudiante(
    idusuario: string,
  ): Promise<destinatarioestudiantetarea | null> {
    const estudiante = await this.prisma.student.findFirst({
      where: { userId: idusuario, isActive: true, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        enrollments: {
          where: { status: 'ACTIVE', academicYear: { is: { isActive: true } } },
          select: { courseId: true },
          take: 1,
          orderBy: { enrollmentDate: 'desc' },
        },
      },
    });
    const idcurso = estudiante?.enrollments[0]?.courseId;
    return estudiante
      ? {
          id: estudiante.id,
          firstName: estudiante.firstName,
          lastName: estudiante.lastName,
          courseId: idcurso ?? null,
        }
      : null;
  }

  async buscardestinatariosfamiliares(idusuario: string): Promise<destinatarioestudiantetarea[]> {
    const familiar = await this.prisma.parent.findUnique({
      where: { userId: idusuario },
      select: {
        studentParents: {
          select: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                enrollments: {
                  where: { status: 'ACTIVE', academicYear: { is: { isActive: true } } },
                  select: { courseId: true },
                  take: 1,
                  orderBy: { enrollmentDate: 'desc' },
                },
              },
            },
          },
        },
      },
    });
    return (familiar?.studentParents ?? []).flatMap(({ student: estudiante }) => {
      const idcurso = estudiante.enrollments[0]?.courseId;
      return [
        {
          id: estudiante.id,
          firstName: estudiante.firstName,
          lastName: estudiante.lastName,
          courseId: idcurso ?? null,
        },
      ];
    });
  }

  async buscariddocenteasignado(idcurso: string, idmateria: string): Promise<string | null> {
    const tarea = await this.prisma.teacherSubject.findFirst({
      where: { courseId: idcurso, subjectId: idmateria },
      select: { teacherId: true },
    });
    return tarea?.teacherId ?? null;
  }

  async tieneasignaciondocentevigente(
    iddocente: string,
    idcurso: string,
    idmateria: string,
  ): Promise<boolean> {
    const tarea = await this.prisma.teacherSubject.findFirst({
      where: {
        teacherId: iddocente,
        courseId: idcurso,
        subjectId: idmateria,
        academicYear: { is: { isActive: true } },
      },
      select: { id: true },
    });
    return Boolean(tarea);
  }

  async buscartodos(consulta: consultatareas): Promise<registrotarea[]> {
    const where: Prisma.AssignmentWhereInput = {
      deletedAt: null,
      ...(consulta.courseId ? { courseId: consulta.courseId } : {}),
      ...(consulta.courseIds ? { courseId: { in: consulta.courseIds } } : {}),
      ...(consulta.subjectId ? { subjectId: consulta.subjectId } : {}),
      ...(consulta.teacherId ? { teacherId: consulta.teacherId } : {}),
      ...(consulta.type ? { type: consulta.type as unknown as PrismaAssignmentType } : {}),
      ...(consulta.status ? { status: consulta.status as unknown as PrismaAssignmentStatus } : {}),
      ...(consulta.search
        ? {
            OR: [
              { title: { contains: consulta.search, mode: 'insensitive' } },
              { description: { contains: consulta.search, mode: 'insensitive' } },
              { subject: { name: { contains: consulta.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
    const asignaciones = await this.prisma.assignment.findMany({
      where,
      include: {
        course: true,
        subject: true,
        teacher: true,
        submissions: {
          select: {
            id: true,
            studentId: true,
            score: true,
            feedback: true,
            status: true,
            gradedAt: true,
          },
        },
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
    return asignaciones.map((a) => mapaasignacion(a, consulta.studentId));
  }

  async crear(datos: datoscreaciontarea): Promise<registrotarea> {
    const tarea = await this.prisma.assignment.create({
      data: {
        ...datos,
        type: datos.type as unknown as PrismaAssignmentType,
        status: PrismaAssignmentStatus.PENDIENTE,
      },
      include: {
        course: true,
        subject: true,
        teacher: true,
        submissions: {
          select: {
            id: true,
            studentId: true,
            score: true,
            feedback: true,
            status: true,
            gradedAt: true,
          },
        },
      },
    });
    return mapaasignacion(tarea);
  }

  async buscarporidentificador(
    id: string,
  ): Promise<Pick<registrotarea, 'id' | 'teacherId'> | null> {
    return this.prisma.assignment.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, teacherId: true },
    });
  }

  async actualizar(id: string, datos: datosactualizaciontarea): Promise<registrotarea> {
    const tarea = await this.prisma.assignment.update({
      where: { id },
      data: {
        ...datos,
        ...(datos.type ? { type: datos.type as unknown as PrismaAssignmentType } : {}),
        ...(datos.status ? { status: datos.status as unknown as PrismaAssignmentStatus } : {}),
      },
      include: {
        course: true,
        subject: true,
        teacher: true,
        submissions: {
          select: {
            id: true,
            studentId: true,
            score: true,
            feedback: true,
            status: true,
            gradedAt: true,
          },
        },
      },
    });
    return mapaasignacion(tarea);
  }

  async eliminarlogicamente(id: string, fechaeliminacion: Date): Promise<boolean> {
    const resultado = await this.prisma.assignment.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: fechaeliminacion, status: PrismaAssignmentStatus.CANCELADO },
    });
    return resultado.count === 1;
  }

  async obtenerplanillaestudiantes(
    idtarea: string,
  ): Promise<asignacionconestudiantesysubmissions | null> {
    const tarea = await this.prisma.assignment.findFirst({
      where: { id: idtarea, deletedAt: null },
      include: {
        course: true,
        subject: true,
        teacher: true,
        submissions: {
          where: { deletedAt: null },
          select: {
            id: true,
            studentId: true,
            score: true,
            feedback: true,
            status: true,
            gradedAt: true,
          },
        },
      },
    });

    if (!tarea) return null;

    // Obtener todos los alumnos inscritos y activos en el curso de la tarea
    const inscripciones = await this.prisma.enrollment.findMany({
      where: {
        courseId: tarea.courseId,
        status: 'ACTIVE',
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rude: true,
            ci: true,
          },
        },
      },
      orderBy: [
        { student: { lastName: 'asc' } },
        { student: { firstName: 'asc' } },
      ],
    });

    const submissionsMap = new Map(
      tarea.submissions.map((sub) => [sub.studentId, sub]),
    );

    const estudiantes = inscripciones.map(({ student: est }) => {
      const sub = submissionsMap.get(est.id);
      return {
        id: est.id,
        firstName: est.firstName,
        lastName: est.lastName,
        rude: est.rude,
        ci: est.ci,
        score: sub?.score ?? null,
        feedback: sub?.feedback ?? null,
        status: sub?.status ?? 'PENDIENTE',
        gradedAt: sub?.gradedAt ?? null,
      };
    });

    return {
      assignment: mapaasignacion(tarea),
      students: estudiantes,
    };
  }

  async guardarcalificacioneslote(
    idtarea: string,
    calificaciones: calificacionestudianteentrada[],
    iddocentequevalua?: string,
  ): Promise<void> {
    const ahora = new Date();

    await this.prisma.$transaction(async (tx) => {
      for (const item of calificaciones) {
        const tieneNota = item.score !== null && item.score !== undefined && !isNaN(Number(item.score));
        const scoreVal = tieneNota ? Number(item.score) : null;
        const statusVal = tieneNota ? 'CALIFICADO' : (item.status || 'PENDIENTE');

        await tx.assignmentSubmission.upsert({
          where: {
            assignmentId_studentId: {
              assignmentId: idtarea,
              studentId: item.studentId,
            },
          },
          update: {
            score: scoreVal,
            feedback: item.feedback?.trim() || null,
            status: statusVal,
            gradedAt: tieneNota ? ahora : undefined,
            gradedById: iddocentequevalua ?? undefined,
          },
          create: {
            assignmentId: idtarea,
            studentId: item.studentId,
            score: scoreVal,
            feedback: item.feedback?.trim() || null,
            status: statusVal,
            gradedAt: tieneNota ? ahora : null,
            gradedById: iddocentequevalua ?? null,
          },
        });
      }

      // Si todos los estudiantes inscritos ya tienen nota, actualizamos la tarea a FINALIZADO
      const tarea = await tx.assignment.findUnique({
        where: { id: idtarea },
        select: { courseId: true },
      });
      if (tarea?.courseId) {
        const totalAlumnos = await tx.enrollment.count({
          where: { courseId: tarea.courseId, status: 'ACTIVE' },
        });
        const totalCalificados = await tx.assignmentSubmission.count({
          where: { assignmentId: idtarea, score: { not: null } },
        });
        if (totalAlumnos > 0 && totalCalificados >= totalAlumnos) {
          await tx.assignment.update({
            where: { id: idtarea },
            data: { status: 'FINALIZADO' },
          });
        }
      }
    });
  }
}

function mapaasignacion(tarea: asignacionconrelations, studentId?: string): registrotarea {
  const matchingSubmission = studentId
    ? tarea.submissions.find((s) => s.studentId === studentId)
    : undefined;

  const gradedCount = tarea.submissions.filter((s) => s.score !== null).length;

  return {
    id: tarea.id,
    title: tarea.title,
    type: tarea.type as unknown as tipoasignacion,
    description: tarea.description,
    dueDate: tarea.dueDate,
    maxScore: tarea.maxScore,
    status: tarea.status as unknown as estadoasignacion,
    courseId: tarea.courseId,
    subjectId: tarea.subjectId,
    teacherId: tarea.teacherId,
    createdAt: tarea.createdAt,
    updatedAt: tarea.updatedAt,
    course: {
      id: tarea.course.id,
      name: tarea.course.name,
      gradeLevel: tarea.course.gradeLevel,
      section: tarea.course.section,
      shift: tarea.course.shift,
    },
    subject: {
      id: tarea.subject.id,
      name: tarea.subject.name,
      code: tarea.subject.code,
      area: tarea.subject.area,
    },
    teacher: {
      id: tarea.teacher.id,
      firstName: tarea.teacher.firstName,
      lastName: tarea.teacher.lastName,
      specialty: tarea.teacher.specialty,
    },
    submission: matchingSubmission
      ? {
          id: matchingSubmission.id,
          score: matchingSubmission.score,
          feedback: matchingSubmission.feedback,
          status: matchingSubmission.status,
          gradedAt: matchingSubmission.gradedAt,
        }
      : undefined,
    gradedCount,
  };
}
