import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';

@Injectable()
export class ListPeriodsUseCase {
  constructor(private readonly prisma: PrismaService) {}
  execute(academicYearId?: string) {
    return this.prisma.academicPeriod.findMany({ where: academicYearId ? { academicYearId } : undefined, orderBy: { number: 'asc' }, include: { academicYear: true } });
  }
}
