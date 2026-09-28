import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { StudentEntity } from '../../domain/entities/student.entity';
import { StudentCreateData, StudentRepository, StudentUpdateData } from '../../domain/repositories/student.repository.interface';

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { search?: string; parentUserId?: string; limit: number; offset: number }) {
    const where = {
      deletedAt: null,
      ...(query.parentUserId
        ? {
            OR: [
              { studentParents: { some: { parent: { userId: query.parentUserId } } } },
              { userId: query.parentUserId },
            ],
          }
        : {}),
      ...(query.search
        ? {
            AND: [
              {
                OR: [
                  { firstName: { contains: query.search, mode: 'insensitive' as const } },
                  { lastName: { contains: query.search, mode: 'insensitive' as const } },
                  { rude: { contains: query.search, mode: 'insensitive' as const } },
                  { ci: { contains: query.search, mode: 'insensitive' as const } },
                ],
              },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: query.offset,
        take: query.limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: {
          enrollments: {
            where: { status: 'ACTIVE' },
            include: { course: true, academicYear: true },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async findById(id: string, parentUserId?: string) {
    const where = {
      id,
      deletedAt: null,
      ...(parentUserId
        ? {
            OR: [
              { studentParents: { some: { parent: { userId: parentUserId } } } },
              { userId: parentUserId },
            ],
          }
        : {}),
    };
    const student = await this.prisma.student.findFirst({
      where,
      include: {
        enrollments: { include: { course: true, academicYear: true } },
      },
    });
    return student ? this.map(student) : null;
  }

  async create(data: StudentCreateData) {
    const student = await this.prisma.student.create({
      data: {
        ...data,
        gender: data.gender as 'MALE' | 'FEMALE',
      },
      include: { enrollments: { include: { course: true, academicYear: true } } },
    });
    return this.map(student);
  }

  async update(id: string, data: StudentUpdateData) {
    try {
      const { gender, ...fields } = data;
      const student = await this.prisma.student.update({
        where: { id },
        data: {
          ...fields,
          ...(gender ? { gender: gender as 'MALE' | 'FEMALE' } : {}),
        },
        include: { enrollments: { include: { course: true, academicYear: true } } },
      });
      return this.map(student);
    } catch {
      throw new NotFoundException('Estudiante no encontrado');
    }
  }

  async softDelete(id: string) {
    try {
      await this.prisma.student.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    } catch {
      throw new NotFoundException('Estudiante no encontrado');
    }
  }

  private map(student: Awaited<ReturnType<PrismaService['student']['findFirst']>> & { enrollments?: unknown }): StudentEntity {
    const value = student as NonNullable<Awaited<ReturnType<PrismaService['student']['findFirst']>>> & {
      enrollments?: Array<{
        id: string;
        status: string;
        course: { id: string; name: string; gradeLevel: number; section: string };
        academicYear: { id: string; year: number; name: string };
      }>;
    };
    return {
      id: value.id,
      rude: value.rude,
      ci: value.ci,
      firstName: value.firstName,
      lastName: value.lastName,
      birthDate: value.birthDate,
      gender: value.gender,
      address: value.address,
      phone: value.phone,
      isActive: value.isActive,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      enrollments: value.enrollments ?? [],
    };
  }
}
