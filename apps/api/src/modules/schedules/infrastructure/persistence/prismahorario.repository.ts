import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { type turnoacademico } from '@academic/academic-domain';
import { DayOfWeek as PrismaDayOfWeek, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { errorconflictoaplicacion } from '../../../../core/application/aplicacionerror';
import {
  resultadohorariocurso,
  registrohorario,
  perfilhorarioestudiante,
  perfilhorariofamiliar,
  resultadohorariodocente,
} from '../../domain/entities/horario.types';
import {
  filtroshorario,
  repositoriohorarios,
  datosescriturahorario,
  datosgeneracionhorario,
  comandoguardarhorariogenerado,
} from '../../domain/repositories/horario.repository.interface';

async function validarcursoyasignacionhorario(
  transaccion: Prisma.TransactionClient,
  datos: datosescriturahorario,
  idgestionacademica: string,
): Promise<void> {
  const cursos = await transaccion.$queryRaw<Array<{ id: string; academicYearId: string }>>`
    SELECT "id", "academic_year_id" AS "academicYearId"
    FROM "courses"
    WHERE "id" = ${datos.courseId}
    FOR UPDATE
  `;
  const curso = cursos[0];
  if (!curso) throw new NotFoundException('Curso no encontrado');
  if (curso.academicYearId !== idgestionacademica) {
    throw new ConflictException('El horario debe usar la gestión académica del curso.');
  }

  const asignaciones = await transaccion.$queryRaw<Array<{ id: string }>>`
    SELECT ts."id"
    FROM "teacher_subjects" AS ts
    INNER JOIN "teachers" AS t ON t."id" = ts."teacher_id"
    WHERE ts."course_id" = ${datos.courseId}
      AND ts."academic_year_id" = ${idgestionacademica}
      AND ts."teacher_id" = ${datos.teacherId}
      AND ts."subject_id" = ${datos.subjectId}
      AND t."deleted_at" IS NULL
    FOR UPDATE OF ts, t
  `;
  if (asignaciones.length === 0) {
    throw new ConflictException('El docente no tiene asignación para esa materia y curso.');
  }
}

@Injectable()
export class repositoriohorarioprisma implements repositoriohorarios {
  constructor(private readonly prisma: servicioprisma) {}

  async asignarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
    weeklyPeriods?: number | null;
  }): Promise<number> {
    const [curso, docente, materias] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: datos.courseId },
        select: { academicYearId: true },
      }),
      this.prisma.teacher.findFirst({
        where: { id: datos.teacherId, deletedAt: null, user: { isActive: true } },
        select: { id: true },
      }),
      this.prisma.subject.findMany({
        where: { id: { in: datos.subjectIds } },
        select: { id: true },
      }),
    ]);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    if (!docente) throw new NotFoundException('Docente activo no encontrado');
    if (materias.length !== datos.subjectIds.length) {
      throw new NotFoundException('Una o más materias no existen');
    }
    return this.prisma.$transaction(async (transaction) => {
      let creadas = 0;
      for (const subjectId of datos.subjectIds) {
        const llave = {
          teacherId: datos.teacherId,
          subjectId,
          courseId: datos.courseId,
          academicYearId: curso.academicYearId,
        };
        const existente = await transaction.teacherSubject.findUnique({
          where: { teacherId_subjectId_courseId_academicYearId: llave },
          select: { id: true },
        });
        await transaction.teacherSubject.upsert({
          where: { teacherId_subjectId_courseId_academicYearId: llave },
          update: datos.weeklyPeriods === undefined ? {} : { weeklyPeriods: datos.weeklyPeriods },
          create: {
            ...llave,
            weeklyPeriods: datos.weeklyPeriods ?? null,
          },
        });
        if (!existente) creadas += 1;
      }
      return creadas;
    });
  }

  async reemplazarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
  }): Promise<{
    added: number;
    removed: number;
    assignments: Array<{
      id: string;
      courseId: string;
      subjectId: string;
      weeklyPeriods: number | null;
      course: { id: string; name: string; gradeLevel: number; section: string };
      subject: { id: string; code: string; name: string };
      academicYear: { year: number };
    }>;
  }> {
    const [curso, docente, materias] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: datos.courseId },
        select: { academicYearId: true, academicYear: { select: { isActive: true } } },
      }),
      this.prisma.teacher.findFirst({
        where: { id: datos.teacherId, deletedAt: null, user: { isActive: true } },
        select: { id: true },
      }),
      this.prisma.subject.findMany({
        where: { id: { in: datos.subjectIds } },
        select: { id: true },
      }),
    ]);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    if (!curso.academicYear.isActive) {
      throw new ConflictException('Solo se pueden modificar asignaciones de la gestión activa.');
    }
    if (!docente) throw new NotFoundException('Docente activo no encontrado');
    if (materias.length !== datos.subjectIds.length) {
      throw new NotFoundException('Una o más materias no existen');
    }

    return this.prisma.$transaction(async (transaction) => {
      const existentes = await transaction.teacherSubject.findMany({
        where: {
          courseId: datos.courseId,
          teacherId: datos.teacherId,
          academicYearId: curso.academicYearId,
        },
        select: { id: true, subjectId: true },
      });
      const removidas = existentes.filter((item) => !datos.subjectIds.includes(item.subjectId));
      const quitarmaterias = removidas.map((item) => item.subjectId);

      if (quitarmaterias.length > 0) {
        const horarioexistente = await transaction.classSchedule.findFirst({
          where: {
            courseId: datos.courseId,
            teacherId: datos.teacherId,
            academicYearId: curso.academicYearId,
            subjectId: { in: quitarmaterias },
          },
          select: { id: true },
        });
        if (horarioexistente) {
          throw new ConflictException(
            'No se puede quitar una materia que ya figura en el horario. Reasigna o elimina primero ese bloque.',
          );
        }
        await transaction.teacherSubject.deleteMany({
          where: { id: { in: removidas.map((item) => item.id) } },
        });
      }

      for (const subjectId of datos.subjectIds) {
        await transaction.teacherSubject.upsert({
          where: {
            teacherId_subjectId_courseId_academicYearId: {
              teacherId: datos.teacherId,
              subjectId,
              courseId: datos.courseId,
              academicYearId: curso.academicYearId,
            },
          },
          update: {},
          create: {
            teacherId: datos.teacherId,
            subjectId,
            courseId: datos.courseId,
            academicYearId: curso.academicYearId,
            weeklyPeriods: null,
          },
        });
      }

      const asignaciones = await transaction.teacherSubject.findMany({
        where: {
          courseId: datos.courseId,
          teacherId: datos.teacherId,
          academicYearId: curso.academicYearId,
        },
        include: {
          course: { select: { id: true, name: true, gradeLevel: true, section: true } },
          subject: { select: { id: true, code: true, name: true } },
          academicYear: { select: { year: true } },
        },
        orderBy: { subject: { name: 'asc' } },
      });

      return {
        added: datos.subjectIds.filter(
          (subjectId) => !existentes.some((item) => item.subjectId === subjectId),
        ).length,
        removed: removidas.length,
        assignments: asignaciones,
      };
    });
  }

  async listar(filtros: filtroshorario): Promise<registrohorario[]> {
    // If no academicYearId provided, use active year
    let gestionid = filtros.academicYearId;
    if (!gestionid) {
      const activogestion = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      gestionid = activogestion?.id;
    }

    const where: Prisma.ClassScheduleWhereInput = {};
    if (gestionid) where.academicYearId = gestionid;
    if (filtros.soloGestionActiva) where.academicYear = { isActive: true };
    if (filtros.courseId) where.courseId = filtros.courseId;
    if (filtros.teacherId) where.teacherId = filtros.teacherId;
    if (filtros.dayOfWeek) where.dayOfWeek = filtros.dayOfWeek as unknown as PrismaDayOfWeek;

    return this.prisma.classSchedule.findMany({
      where,
      include: {
        course: true,
        subject: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodIndex: 'asc' }],
    });
  }

  async obtenerhorariocurso(idcurso: string): Promise<resultadohorariocurso> {
    const curso = await this.prisma.course.findUnique({
      where: { id: idcurso },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const horarios = await this.prisma.classSchedule.findMany({
      where: { courseId: idcurso },
      include: {
        subject: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodIndex: 'asc' }],
    });

    const docentematerias = await this.prisma.teacherSubject.findMany({
      where: { courseId: idcurso },
      include: {
        subject: true,
        teacher: {
          select: { id: true, firstName: true, lastName: true, specialty: true },
        },
      },
      orderBy: { subject: { name: 'asc' } },
    });

    return {
      course: curso,
      schedules: horarios,
      teacherSubjects: docentematerias,
    };
  }

  async obtenerhorariodocente(
    iddocente: string,
    soloGestionActiva = false,
  ): Promise<resultadohorariodocente> {
    const docente = await this.prisma.teacher.findUnique({
      where: { id: iddocente },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialty: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });
    if (!docente) throw new NotFoundException('Docente no encontrado');

    const horarios = await this.prisma.classSchedule.findMany({
      where: {
        teacherId: iddocente,
        ...(soloGestionActiva ? { academicYear: { is: { isActive: true } } } : {}),
      },
      include: {
        subject: true,
        course: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodIndex: 'asc' }],
    });

    const asignaciones = await this.prisma.teacherSubject.findMany({
      where: {
        teacherId: iddocente,
        ...(soloGestionActiva ? { academicYear: { is: { isActive: true } } } : {}),
      },
      include: {
        course: true,
        subject: true,
        teacher: {
          select: { id: true, firstName: true, lastName: true, specialty: true },
        },
      },
      orderBy: [{ course: { gradeLevel: 'asc' } }, { subject: { name: 'asc' } }],
    });

    return {
      teacher: docente,
      schedules: horarios,
      assignments: asignaciones,
    };
  }

  async buscariddocenteporusuario(idusuario: string): Promise<string | null> {
    const docente = await this.prisma.teacher.findUnique({
      where: { userId: idusuario },
      select: { id: true },
    });
    return docente?.id ?? null;
  }

  async buscarperfilhorarioestudiante(idusuario: string): Promise<perfilhorarioestudiante | null> {
    const estudiante = await this.prisma.student.findUnique({
      where: { userId: idusuario },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rude: true,
        ci: true,
        enrollments: {
          where: { status: 'ACTIVE', academicYear: { is: { isActive: true } } },
          select: { courseId: true },
          take: 1,
          orderBy: { enrollmentDate: 'desc' },
        },
      },
    });
    if (!estudiante) return null;
    return {
      student: {
        id: estudiante.id,
        firstName: estudiante.firstName,
        lastName: estudiante.lastName,
        rude: estudiante.rude,
        ci: estudiante.ci,
      },
      activeCourseId: estudiante.enrollments[0]?.courseId ?? null,
    };
  }

  async buscarperfilhorariofamiliar(idusuario: string): Promise<perfilhorariofamiliar | null> {
    const familiar = await this.prisma.parent.findUnique({
      where: { userId: idusuario },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        ci: true,
        studentParents: {
          select: {
            relationship: true,
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                rude: true,
                ci: true,
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
    if (!familiar) return null;
    return {
      parent: {
        id: familiar.id,
        firstName: familiar.firstName,
        lastName: familiar.lastName,
        ci: familiar.ci,
      },
      children: familiar.studentParents.map((elemento) => ({
        student: {
          id: elemento.student.id,
          firstName: elemento.student.firstName,
          lastName: elemento.student.lastName,
          rude: elemento.student.rude,
          ci: elemento.student.ci,
        },
        relationship: elemento.relationship,
        activeCourseId: elemento.student.enrollments[0]?.courseId ?? null,
      })),
    };
  }

  async insertaroactualizar(datos: datosescriturahorario): Promise<registrohorario> {
    try {
      let gestionid = datos.academicYearId;
      if (!gestionid) {
        const activogestion = await this.prisma.academicYear.findFirst({
          where: { isActive: true },
        });
        if (!activogestion) throw new NotFoundException('No hay una gestión académica activa');
        gestionid = activogestion.id;
      }

      return await this.prisma.$transaction(async (transaccion) => {
        await validarcursoyasignacionhorario(transaccion, datos, gestionid);
        const existente = await transaccion.classSchedule.findFirst({
          where: {
            courseId: datos.courseId,
            academicYearId: gestionid,
            dayOfWeek: datos.dayOfWeek,
            periodIndex: datos.periodIndex,
          },
        });

        if (existente) {
          return transaccion.classSchedule.update({
            where: { id: existente.id },
            data: {
              subjectId: datos.subjectId,
              teacherId: datos.teacherId,
              startTime: datos.startTime,
              endTime: datos.endTime,
              classroom: datos.classroom,
            },
            include: {
              course: true,
              subject: true,
              teacher: true,
            },
          });
        }

        return transaccion.classSchedule.create({
          data: {
            ...datos,
            academicYearId: gestionid,
            dayOfWeek: datos.dayOfWeek as unknown as PrismaDayOfWeek,
          },
          include: {
            course: true,
            subject: true,
            teacher: true,
          },
        });
      });
    } catch (error) {
      this.traducirconflictodebloquedocente(error);
    }
  }

  async cargardatosgeneracion(idcurso: string): Promise<datosgeneracionhorario | null> {
    const curso = await this.prisma.course.findUnique({ where: { id: idcurso } });
    if (!curso) return null;

    const asignaciones = await this.prisma.teacherSubject.findMany({
      where: { courseId: idcurso, academicYearId: curso.academicYearId },
      include: { subject: true, teacher: true },
      orderBy: [{ subject: { name: 'asc' } }, { teacher: { lastName: 'asc' } }],
    });
    const otherhorarios = await this.prisma.classSchedule.findMany({
      where: {
        academicYearId: curso.academicYearId,
        courseId: { not: idcurso },
      },
      select: { teacherId: true, dayOfWeek: true, periodIndex: true },
    });

    return {
      curso: {
        id: curso.id,
        nombre: curso.name,
        nivel: curso.gradeLevel,
        idGestionAcademica: curso.academicYearId,
        turno: curso.shift as turnoacademico,
      },
      asignaciones: asignaciones.map((tarea) => ({
        subject: {
          id: tarea.subject.id,
          name: tarea.subject.name,
          code: tarea.subject.code,
        },
        teacher: {
          id: tarea.teacher.id,
          firstName: tarea.teacher.firstName,
          lastName: tarea.teacher.lastName,
        },
        periodsPerWeek: tarea.weeklyPeriods,
      })),
      bloquesOcupados: otherhorarios.map((horario) => ({
        teacherId: horario.teacherId,
        dayOfWeek: horario.dayOfWeek,
        periodIndex: horario.periodIndex,
      })),
    };
  }

  async guardarhorariogenerado(comando: comandoguardarhorariogenerado): Promise<void> {
    const horariofilas = comando.bloques.map((bloque) => ({
      ...bloque,
      courseId: comando.idCurso,
      academicYearId: comando.idGestionAcademica,
      classroom: comando.aula,
      dayOfWeek: bloque.dayOfWeek as PrismaDayOfWeek,
    }));

    try {
      await this.prisma.$transaction(async (transaction) => {
        // The course lock serializes new teacher-subject rows through their course foreign key.
        const cursos = await transaction.$queryRaw<
          Array<{ academicYearId: string; name: string; gradeLevel: number; shift: string }>
        >`
          SELECT
            "academic_year_id" AS "academicYearId",
            "name",
            "grade_level" AS "gradeLevel",
            "shift"
          FROM "courses"
          WHERE "id" = ${comando.idCurso}
          FOR UPDATE
        `;
        if (
          !cursos[0] ||
          cursos[0].academicYearId !== comando.idGestionAcademica ||
          cursos[0].name !== comando.nombreCursoEsperado ||
          cursos[0].gradeLevel !== comando.nivelEsperado ||
          cursos[0].shift !== comando.turnoEsperado
        ) {
          throw new errorconflictoaplicacion(
            'El curso o su configuración académica cambió durante la generación del horario.',
          );
        }

        const asignaciones = await transaction.$queryRaw<
          Array<{ teacherId: string; subjectId: string }>
        >`
          SELECT "teacher_id" AS "teacherId", "subject_id" AS "subjectId"
          FROM "teacher_subjects"
          WHERE "course_id" = ${comando.idCurso}
            AND "academic_year_id" = ${comando.idGestionAcademica}
          FOR KEY SHARE
        `;
        const actualasignaciones = new Set(
          asignaciones.map((asignacion) => `${asignacion.teacherId}:${asignacion.subjectId}`),
        );
        const esperadoasignaciones = new Set(
          comando.asignacionesEsperadas.map(
            (asignacion) => `${asignacion.teacherId}:${asignacion.subjectId}`,
          ),
        );
        const instantaneacoincidencias =
          actualasignaciones.size === esperadoasignaciones.size &&
          [...esperadoasignaciones].every((asignacion) => actualasignaciones.has(asignacion));
        if (!instantaneacoincidencias) {
          throw new errorconflictoaplicacion(
            'Las asignaciones docentes cambiaron durante la generación del horario. Vuelve a intentarlo.',
          );
        }
        if (
          horariofilas.some(
            (bloque) => !actualasignaciones.has(`${bloque.teacherId}:${bloque.subjectId}`),
          )
        ) {
          throw new errorconflictoaplicacion(
            'Las asignaciones docentes cambiaron durante la generación del horario. Vuelve a intentarlo.',
          );
        }

        await transaction.classSchedule.deleteMany({
          where: { courseId: comando.idCurso, academicYearId: comando.idGestionAcademica },
        });
        await transaction.classSchedule.createMany({ data: horariofilas });
      });
    } catch (error) {
      this.traducirconflictodebloquedocente(error);
    }
  }

  async crear(datos: datosescriturahorario): Promise<registrohorario> {
    let gestionid = datos.academicYearId;
    if (!gestionid) {
      const activogestion = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      if (!activogestion) throw new NotFoundException('No hay una gestión académica activa');
      gestionid = activogestion.id;
    }

    try {
      return await this.prisma.$transaction(async (transaccion) => {
        await validarcursoyasignacionhorario(transaccion, datos, gestionid);
        return transaccion.classSchedule.create({
          data: {
            ...datos,
            academicYearId: gestionid,
            dayOfWeek: datos.dayOfWeek as unknown as PrismaDayOfWeek,
          },
          include: {
            course: true,
            subject: true,
            teacher: true,
          },
        });
      });
    } catch (error) {
      this.traducirconflictodebloquedocente(error);
    }
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.classSchedule.delete({
      where: { id },
    });
  }

  private traducirconflictodebloquedocente(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new errorconflictoaplicacion(
        'El docente ya tiene una sesión asignada en ese bloque de la gestión académica.',
      );
    }
    throw error;
  }
}
