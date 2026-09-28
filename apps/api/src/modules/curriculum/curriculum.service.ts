import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CurriculumStatus } from '@prisma/client';

export interface UpdateCurriculumProgressInput {
  status?: CurriculumStatus;
  progressPercent?: number;
}

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: {
    courseId?: string;
    gradeLevel?: number;
    subjectId?: string;
    periodNumber?: number;
    status?: CurriculumStatus;
    search?: string;
    academicYearId?: string;
  }) {
    let yearId = filters.academicYearId;
    if (!yearId) {
      const activeYear = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      yearId = activeYear?.id;
    }

    const where: any = {};
    if (yearId) where.academicYearId = yearId;
    if (filters.courseId) where.courseId = filters.courseId;
    if (filters.gradeLevel) where.gradeLevel = Number(filters.gradeLevel);
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.periodNumber) where.periodNumber = Number(filters.periodNumber);
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { unitTitle: { contains: filters.search, mode: 'insensitive' } },
        { campo: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.curriculumTopic.findMany({
      where,
      include: {
        subject: true,
        course: true,
      },
      orderBy: [
        { gradeLevel: 'asc' },
        { periodNumber: 'asc' },
        { unitTitle: 'asc' },
      ],
    });
  }

  async getStats(academicYearId?: string) {
    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      yearId = activeYear?.id;
    }

    const topics = await this.prisma.curriculumTopic.findMany({
      where: yearId ? { academicYearId: yearId } : {},
      include: {
        subject: true,
      },
    });

    const totalTopics = topics.length;
    const completed = topics.filter((t) => t.status === CurriculumStatus.COMPLETADO).length;
    const inProgress = topics.filter((t) => t.status === CurriculumStatus.EN_DESARROLLO).length;
    const planned = topics.filter((t) => t.status === CurriculumStatus.PLANIFICADO).length;

    // Agrupación por nivel educativo
    // Inicial: gradeLevel 1..4
    // Primaria: gradeLevel 5..10
    // Secundaria: gradeLevel 11..16
    const inicial = topics.filter((t) => (t.gradeLevel || 0) <= 4);
    const primaria = topics.filter((t) => (t.gradeLevel || 0) >= 5 && (t.gradeLevel || 0) <= 10);
    const secundaria = topics.filter((t) => (t.gradeLevel || 0) >= 11);

    const averageProgress = totalTopics > 0
      ? Math.round(topics.reduce((acc, curr) => acc + curr.progressPercent, 0) / totalTopics)
      : 0;

    return {
      totalTopics,
      completed,
      inProgress,
      planned,
      averageProgress,
      byLevel: {
        inicial: {
          total: inicial.length,
          completed: inicial.filter((t) => t.status === CurriculumStatus.COMPLETADO).length,
          avgProgress: inicial.length ? Math.round(inicial.reduce((acc, c) => acc + c.progressPercent, 0) / inicial.length) : 0,
        },
        primaria: {
          total: primaria.length,
          completed: primaria.filter((t) => t.status === CurriculumStatus.COMPLETADO).length,
          avgProgress: primaria.length ? Math.round(primaria.reduce((acc, c) => acc + c.progressPercent, 0) / primaria.length) : 0,
        },
        secundaria: {
          total: secundaria.length,
          completed: secundaria.filter((t) => t.status === CurriculumStatus.COMPLETADO).length,
          avgProgress: secundaria.length ? Math.round(secundaria.reduce((acc, c) => acc + c.progressPercent, 0) / secundaria.length) : 0,
        },
      },
    };
  }

  async updateProgress(id: string, data: UpdateCurriculumProgressInput) {
    const existing = await this.prisma.curriculumTopic.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Tema curricular no encontrado');

    return this.prisma.curriculumTopic.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.progressPercent !== undefined ? { progressPercent: data.progressPercent } : {}),
      },
      include: {
        subject: true,
        course: true,
      },
    });
  }

  async create(data: {
    academicYearId?: string;
    subjectId: string;
    courseId?: string;
    gradeLevel?: number;
    periodNumber: number;
    campo?: string;
    unitTitle: string;
    title: string;
    description?: string;
  }) {
    let yearId = data.academicYearId;
    if (!yearId) {
      const activeYear = await this.prisma.academicYear.findFirst({
        where: { isActive: true },
      });
      if (!activeYear) throw new NotFoundException('No hay una gestión académica activa');
      yearId = activeYear.id;
    }

    return this.prisma.curriculumTopic.create({
      data: {
        academicYearId: yearId,
        subjectId: data.subjectId,
        courseId: data.courseId,
        gradeLevel: data.gradeLevel ?? 1,
        periodNumber: data.periodNumber,
        campo: data.campo || 'Área Integrada',
        unitTitle: data.unitTitle,
        title: data.title,
        description: data.description,
        status: CurriculumStatus.PLANIFICADO,
        progressPercent: 0,
      },
      include: {
        subject: true,
        course: true,
      },
    });
  }
}
