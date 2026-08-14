import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { ISieSynchronizationRepository } from '../../domain/repositories/sie-synchronization.repository.interface';

@Injectable()
export class PrismaSieSynchronizationRepository implements ISieSynchronizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.sieSynchronization.findUnique({
      where: { id },
      include: { items: true },
    });
  }
}
