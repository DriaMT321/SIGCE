import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { PrismaService } from '../../common/database/prisma.service';
import { AnnouncementScope, AnnouncementUrgency, AlertSeverity, AlertStatus } from '@prisma/client';

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  urgency: AnnouncementUrgency;
  scope: AnnouncementScope;
  targetCourseId?: string;
  targetParentId?: string;
  targetTeacherId?: string;
  targetUserIds?: string[];
}

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser) {
    const isManagement = [UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY].includes(user.role as UserRole);

    if (isManagement) {
      return this.prisma.announcement.findMany({
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, role: true, email: true },
          },
          targetCourse: { select: { id: true, name: true } },
          targetParent: { select: { id: true, firstName: true, lastName: true, ci: true, phone: true } },
          targetTeacher: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (user.role === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id },
        include: { teacherSubjects: true },
      });
      const teacherCourseIds = teacher ? teacher.teacherSubjects.map((ts) => ts.courseId) : [];

      return this.prisma.announcement.findMany({
        where: {
          OR: [
            { scope: AnnouncementScope.ALL_COURSES },
            { scope: AnnouncementScope.ALL_TEACHERS },
            { scope: AnnouncementScope.TEACHER, targetTeacherId: teacher?.id },
            { scope: AnnouncementScope.COURSE, targetCourseId: { in: teacherCourseIds } },
            ...(teacher?.id
              ? [{ scope: AnnouncementScope.SPECIFIC_TEACHERS, targetUserIds: { has: teacher.id } }]
              : []),
            { scope: AnnouncementScope.SPECIFIC_TEACHERS, targetUserIds: { has: user.id } },
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

    if (user.role === UserRole.PARENT) {
      const parent = await this.prisma.parent.findUnique({
        where: { userId: user.id },
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

      const childrenCourseIds: string[] = [];
      const childrenIds: string[] = [];
      if (parent) {
        parent.studentParents.forEach((sp) => {
          childrenIds.push(sp.student.id);
          sp.student.enrollments.forEach((e) => {
            childrenCourseIds.push(e.courseId);
          });
        });
      }

      return this.prisma.announcement.findMany({
        where: {
          OR: [
            { scope: AnnouncementScope.ALL_COURSES },
            { scope: AnnouncementScope.ALL_PARENTS },
            { scope: AnnouncementScope.PARENT, targetParentId: parent?.id },
            { scope: AnnouncementScope.COURSE, targetCourseId: { in: childrenCourseIds } },
            ...(parent?.id
              ? [{ scope: AnnouncementScope.SPECIFIC_PARENTS, targetUserIds: { has: parent.id } }]
              : []),
            { scope: AnnouncementScope.SPECIFIC_PARENTS, targetUserIds: { has: user.id } },
            ...childrenIds.map((cId) => ({
              scope: AnnouncementScope.SPECIFIC_STUDENTS,
              targetUserIds: { has: cId },
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

    return this.prisma.announcement.findMany({
      where: { scope: AnnouncementScope.ALL_COURSES },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: AuthenticatedUser, data: CreateAnnouncementInput) {
    const targetUserIdsInput = data.targetUserIds || [];

    const announcement = await this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        urgency: data.urgency,
        scope: data.scope,
        targetCourseId: data.targetCourseId || null,
        targetParentId: data.targetParentId || null,
        targetTeacherId: data.targetTeacherId || null,
        targetUserIds: targetUserIdsInput,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        targetCourse: { select: { id: true, name: true } },
        targetParent: { select: { id: true, firstName: true, lastName: true } },
        targetTeacher: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Despachar alertas inmediatas a los destinatarios según urgencia
    const severityMap: Record<AnnouncementUrgency, AlertSeverity> = {
      [AnnouncementUrgency.CRITICA]: AlertSeverity.DANGER,
      [AnnouncementUrgency.ALTA]: AlertSeverity.WARNING,
      [AnnouncementUrgency.MEDIA]: AlertSeverity.INFO,
      [AnnouncementUrgency.BAJA]: AlertSeverity.INFO,
    };
    const alertSeverity = severityMap[data.urgency] || AlertSeverity.INFO;

    let targetAlertUserIds: string[] = [];

    if (data.scope === AnnouncementScope.ALL_PARENTS) {
      const parents = await this.prisma.parent.findMany({ select: { userId: true } });
      targetAlertUserIds = parents.map((p) => p.userId);
    } else if (data.scope === AnnouncementScope.ALL_TEACHERS) {
      const teachers = await this.prisma.teacher.findMany({ select: { userId: true } });
      targetAlertUserIds = teachers.map((t) => t.userId);
    } else if (data.scope === AnnouncementScope.PARENT && data.targetParentId) {
      const parent = await this.prisma.parent.findUnique({
        where: { id: data.targetParentId },
        select: { userId: true },
      });
      if (parent) targetAlertUserIds = [parent.userId];
    } else if (data.scope === AnnouncementScope.TEACHER && data.targetTeacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: data.targetTeacherId },
        select: { userId: true },
      });
      if (teacher) targetAlertUserIds = [teacher.userId];
    } else if (data.scope === AnnouncementScope.SPECIFIC_PARENTS && targetUserIdsInput.length > 0) {
      const parents = await this.prisma.parent.findMany({
        where: { id: { in: targetUserIdsInput } },
        select: { userId: true },
      });
      const resolved = parents.map((p) => p.userId);
      targetAlertUserIds = resolved.length > 0 ? resolved : targetUserIdsInput;
    } else if (data.scope === AnnouncementScope.SPECIFIC_TEACHERS && targetUserIdsInput.length > 0) {
      const teachers = await this.prisma.teacher.findMany({
        where: { id: { in: targetUserIdsInput } },
        select: { userId: true },
      });
      const resolved = teachers.map((t) => t.userId);
      targetAlertUserIds = resolved.length > 0 ? resolved : targetUserIdsInput;
    } else if (data.scope === AnnouncementScope.SPECIFIC_STUDENTS && targetUserIdsInput.length > 0) {
      const students = await this.prisma.student.findMany({
        where: { id: { in: targetUserIdsInput } },
        include: { studentParents: { include: { parent: true } } },
      });
      const studentUserIds = students.map((s) => s.userId).filter(Boolean) as string[];
      const studentParentUserIds = students.flatMap((s) =>
        s.studentParents.map((sp) => sp.parent.userId)
      );
      targetAlertUserIds = Array.from(new Set([...studentUserIds, ...studentParentUserIds]));
    } else if (data.scope === AnnouncementScope.COURSE && data.targetCourseId) {
      const [enrollments, teacherSubjects] = await Promise.all([
        this.prisma.enrollment.findMany({
          where: { courseId: data.targetCourseId, status: 'ACTIVE' },
          include: { student: { include: { studentParents: { include: { parent: true } } } } },
        }),
        this.prisma.teacherSubject.findMany({
          where: { courseId: data.targetCourseId },
          include: { teacher: true },
        }),
      ]);

      const parentUserIds = enrollments.flatMap((e) =>
        e.student.studentParents.map((sp) => sp.parent.userId)
      );
      const teacherUserIds = teacherSubjects.map((ts) => ts.teacher.userId);
      targetAlertUserIds = Array.from(new Set([...parentUserIds, ...teacherUserIds]));
    } else if (data.scope === AnnouncementScope.ALL_COURSES) {
      const allUsers = await this.prisma.user.findMany({
        where: { role: { in: [UserRole.PARENT, UserRole.TEACHER] } },
        select: { id: true },
      });
      targetAlertUserIds = allUsers.map((u) => u.id);
    }

    if (targetAlertUserIds.length > 0) {
      const BATCH_SIZE = 100;
      for (let i = 0; i < targetAlertUserIds.length; i += BATCH_SIZE) {
        const batch = targetAlertUserIds.slice(i, i + BATCH_SIZE);
        await this.prisma.alert.createMany({
          data: batch.map((uId) => ({
            userId: uId,
            title: `[Comunicado ${data.urgency}] ${data.title}`,
            message: data.content.length > 180 ? `${data.content.slice(0, 180)}...` : data.content,
            severity: alertSeverity,
            status: AlertStatus.OPEN,
            link: '/dashboard/announcements',
            metadata: { announcementId: announcement.id, urgency: data.urgency, scope: data.scope },
          })),
          skipDuplicates: true,
        });
      }
    }

    return announcement;
  }

  async delete(id: string) {
    const existing = await this.prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comunicado no encontrado');
    return this.prisma.announcement.delete({ where: { id } });
  }
}
