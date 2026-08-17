import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';

@Injectable()
export class ListAcademicYearsUseCase {
  constructor(private readonly prisma: PrismaService) {}
  execute() {
    return this.prisma.academicYear.findMany({ orderBy: { year: 'desc' }, include: { _count: { select: { courses: true, enrollments: true } } } });
  }
}
