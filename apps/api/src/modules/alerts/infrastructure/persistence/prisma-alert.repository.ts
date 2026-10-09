import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertStatus } from '@prisma/client';
import { PrismaService } from '../../../../common/database/prisma.service';
import { AlertEntity } from '../../domain/entities/alert.entity';
import { AlertRepository } from '../../domain/repositories/alert.repository.interface';

@Injectable()
export class PrismaAlertRepository implements AlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string, limit: number, offset: number, status?: string) {
    const where: { userId: string; status?: AlertStatus } = { userId };
    if (status && ['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      where.status = status as AlertStatus;
    }
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

  async updateStatus(id: string, userId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') {
    try {
      const item = await this.prisma.alert.update({
        where: { id, userId },
        data: { status: status as AlertStatus },
      });
      return this.map(item);
    } catch {
      throw new NotFoundException('Alerta no encontrada');
    }
  }

  private map(item: {
    id: string;
    userId: string;
    title: string;
    message: string;
    severity: string;
    status: AlertStatus;
    isRead: boolean;
    link: string | null;
    metadata: unknown;
    createdAt: Date;
  }): AlertEntity {
    return {
      id: item.id,
      userId: item.userId,
      title: item.title,
      message: item.message,
      severity: item.severity,
      status: item.status,
      isRead: item.isRead,
      link: item.link,
      metadata: item.metadata,
      createdAt: item.createdAt,
    };
  }
}
