import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';

@Injectable()
export class ListSubjectsUseCase {
  constructor(private readonly prisma: PrismaService) {}
  execute(search?: string) {
    return this.prisma.subject.findMany({ where: search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }] } : undefined, orderBy: { name: 'asc' } });
  }
}
