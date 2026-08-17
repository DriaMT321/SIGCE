import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { AlertEntity } from '../../domain/entities/alert.entity';
import { AlertRepository } from '../../domain/repositories/alert.repository.interface';

@Injectable()
export class PrismaAlertRepository implements AlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string, limit: number, offset: number) {
    const where = { userId };
    const [items, total] = await Promise.all([
      this.prisma.alert.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
      this.prisma.alert.count({ where }),
    ]);
    return { items: items.map((item) => this.map(item)), total };
  }

  async markRead(id: string, userId: string) {
    try {
      const item = await this.prisma.alert.update({ where: { id, userId }, data: { isRead: true } });
      return this.map(item);
    } catch {
      throw new NotFoundException('Alerta no encontrada');
    }
  }

  private map(item: { id: string; userId: string; title: string; message: string; severity: string; isRead: boolean; link: string | null; metadata: unknown; createdAt: Date }): AlertEntity {
    return item;
  }
}
