import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AuditAction, UserRole } from '@academic/shared-types';
import { PrismaService } from '../../../../common/database/prisma.service';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { GRADE_REPOSITORY, GradeRepository } from '../../domain/repositories/grade.repository.interface';
import { CreateGradeDto, UpdateGradeDto, CreateBulkGradesDto } from '../dto/grade.dto';

@Injectable()
export class ListGradesUseCase {
  constructor(@Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository) {}
  execute(query: { studentId?: string; enrollmentId?: string; periodId?: string; parentUserId?: string; limit: number; offset: number }) {
    return this.repository.findAll(query);
  }
}

@Injectable()
export class CreateGradeUseCase {
  constructor(
    @Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository,
    private readonly audit: CreateAuditLogUseCase,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async execute(dto: CreateGradeDto, userId: string, ipAddress?: string, userRole?: UserRole) {
    if (this.prisma) {
      // 1. RN-07 & CA-05: Validar si el periodo de evaluación está cerrado
      const period = await this.prisma.academicPeriod.findUnique({ where: { id: dto.periodId } });
      if (period?.isClosed) {
        const isPrivileged = userRole === UserRole.ADMIN || userRole === UserRole.DIRECTOR;
        if (!isPrivileged) {
          throw new ForbiddenException('El período de evaluación se encuentra cerrado. Modificaciones ordinarias no permitidas.');
        }
        // RN-08 & CA-06: Corrección autorizada requiere motivo obligatorio
        const reason = dto.reason || dto.remarks;
        if (!reason || !reason.trim()) {
          throw new BadRequestException('Toda corrección sobre un período cerrado requiere registrar obligatoriamente el motivo de autorización.');
        }
      }

      // 2. RN-05 & CA-02 & CA-03: Validar asignación del docente
      if (userRole === UserRole.TEACHER) {
        const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
        const enrollment = await this.prisma.enrollment.findUnique({ where: { id: dto.enrollmentId } });
        if (teacher && enrollment) {
          const assignment = await this.prisma.teacherSubject.findFirst({
            where: {
              teacherId: teacher.id,
              subjectId: dto.subjectId,
              courseId: enrollment.courseId,
            },
          });
          if (!assignment) {
            throw new ForbiddenException('El docente no tiene asignación académica autorizada para esta materia y curso.');
          }
        }
      }
    }

    const grade = await this.repository.create(dto);
    await this.audit.execute({
      userId,
      action: AuditAction.CREATE,
      entity: 'Grade',
      entityId: grade.id,
      newValue: grade as unknown as Record<string, unknown>,
      ipAddress,
    });
    return grade;
  }
}

@Injectable()
export class UpdateGradeUseCase {
  constructor(
    @Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository,
    private readonly audit: CreateAuditLogUseCase,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateGradeDto, userId: string, ipAddress?: string, userRole?: UserRole) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Calificación no encontrada');

    if (this.prisma) {
      // 1. RN-07 & CA-05: Validar si el periodo de evaluación está cerrado
      const period = await this.prisma.academicPeriod.findUnique({ where: { id: previous.periodId } });
      if (period?.isClosed) {
        const isPrivileged = userRole === UserRole.ADMIN || userRole === UserRole.DIRECTOR;
        if (!isPrivileged) {
          throw new ForbiddenException('El período de evaluación se encuentra cerrado. Modificaciones ordinarias no permitidas.');
        }
        // RN-08 & CA-06: Corrección autorizada requiere motivo obligatorio
        const reason = dto.reason || dto.remarks;
        if (!reason || !reason.trim()) {
          throw new BadRequestException('Toda corrección sobre un período cerrado requiere registrar obligatoriamente el motivo de autorización.');
        }
      }

      // 2. RN-05: Validar asignación del docente
      if (userRole === UserRole.TEACHER) {
        const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
        const enrollment = await this.prisma.enrollment.findUnique({ where: { id: previous.enrollmentId } });
        if (teacher && enrollment) {
          const assignment = await this.prisma.teacherSubject.findFirst({
            where: {
              teacherId: teacher.id,
              subjectId: previous.subjectId,
              courseId: enrollment.courseId,
            },
          });
          if (!assignment) {
            throw new ForbiddenException('El docente no tiene asignación académica autorizada para esta materia y curso.');
          }
        }
      }
    }

    const grade = await this.repository.update(id, dto);
    await this.audit.execute({
      userId,
      action: AuditAction.UPDATE,
      entity: 'Grade',
      entityId: id,
      previousValue: previous as unknown as Record<string, unknown>,
      newValue: grade as unknown as Record<string, unknown>,
      ipAddress,
    });
    return grade;
  }
}

@Injectable()
export class CreateBulkGradesUseCase {
  constructor(
    @Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository,
    private readonly audit: CreateAuditLogUseCase,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async execute(dto: CreateBulkGradesDto, userId: string, ipAddress?: string, userRole?: UserRole) {
    if (this.prisma) {
      // 1. RN-07: Validar periodo cerrado
      const period = await this.prisma.academicPeriod.findUnique({ where: { id: dto.periodId } });
      if (period?.isClosed) {
        const isPrivileged = userRole === UserRole.ADMIN || userRole === UserRole.DIRECTOR;
        if (!isPrivileged) {
          throw new ForbiddenException('El período de evaluación se encuentra cerrado. Modificaciones ordinarias no permitidas.');
        }
        if (!dto.reason?.trim()) {
          throw new BadRequestException('Toda corrección sobre un período cerrado requiere registrar obligatoriamente el motivo de autorización.');
        }
      }

      // 2. RN-05: Validar asignación docente
      if (userRole === UserRole.TEACHER) {
        const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
        if (teacher) {
          const assignment = await this.prisma.teacherSubject.findFirst({
            where: {
              teacherId: teacher.id,
              subjectId: dto.subjectId,
              courseId: dto.courseId,
            },
          });
          if (!assignment) {
            throw new ForbiddenException('El docente no tiene asignación académica autorizada para esta materia y curso.');
          }
        }
      }
    }

    const payload = dto.grades.map((g) => ({
      enrollmentId: g.enrollmentId,
      studentId: g.studentId,
      subjectId: dto.subjectId,
      periodId: dto.periodId,
      value: g.value,
      remarks: g.remarks || dto.reason,
    }));

    const results = await this.repository.upsertBulk(payload);

    await this.audit.execute({
      userId,
      action: AuditAction.UPDATE,
      entity: 'GradeBulk',
      entityId: `${dto.courseId}_${dto.subjectId}_${dto.periodId}`,
      newValue: {
        courseId: dto.courseId,
        subjectId: dto.subjectId,
        periodId: dto.periodId,
        count: results.length,
        reason: dto.reason,
      },
      ipAddress,
    });

    return { count: results.length, items: results };
  }
}
