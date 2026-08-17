import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseCreateData, CourseRepository, CourseUpdateData } from '../../domain/repositories/course.repository.interface';

@Injectable()
export class PrismaCourseRepository implements CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { academicYearId?: string; search?: string; limit: number; offset: number }) {
    const where = {
      ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' as const } } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: query.offset,
        take: query.limit,
        orderBy: [{ gradeLevel: 'asc' }, { section: 'asc' }],
        include: { academicYear: true, _count: { select: { enrollments: true } } },
      }),
      this.prisma.course.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string) {
    const item = await this.prisma.course.findUnique({
      where: { id },
      include: { academicYear: true, _count: { select: { enrollments: true } } },
    });
    return item ? this.map(item) : null;
  }

  async create(data: CourseCreateData) {
    const item = await this.prisma.course.create({
      data: { ...data, shift: data.shift as 'MORNING' | 'AFTERNOON' | 'EVENING' },
      include: { academicYear: true, _count: { select: { enrollments: true } } },
    });
    return this.map(item);
  }

  async update(id: string, data: CourseUpdateData) {
    try {
      const { shift, ...fields } = data;
      const item = await this.prisma.course.update({
        where: { id },
        data: { ...fields, ...(shift ? { shift: shift as 'MORNING' | 'AFTERNOON' | 'EVENING' } : {}) },
        include: { academicYear: true, _count: { select: { enrollments: true } } },
      });
      return this.map(item);
    } catch {
      throw new NotFoundException('Curso no encontrado');
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.course.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Curso no encontrado');
    }
  }

  private map(item: Awaited<ReturnType<PrismaService['course']['findUnique']>> & { _count?: { enrollments: number } }): CourseEntity {
    const value = item as NonNullable<Awaited<ReturnType<PrismaService['course']['findUnique']>>> & {
      academicYear: { id: string; year: number; name: string };
      _count?: { enrollments: number };
    };
    return {
      id: value.id,
      academicYearId: value.academicYearId,
      name: value.name,
      gradeLevel: value.gradeLevel,
      section: value.section,
      shift: value.shift,
      maxCapacity: value.maxCapacity,
      academicYear: value.academicYear,
      enrollmentCount: value._count?.enrollments ?? 0,
    };
  }
}
