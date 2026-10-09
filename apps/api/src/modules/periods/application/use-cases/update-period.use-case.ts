import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { PrismaService } from '../../../../common/database/prisma.service';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { UpdatePeriodDto } from '../dto/period.dto';

@Injectable()
export class UpdatePeriodUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: CreateAuditLogUseCase,
  ) {}

  async execute(id: string, dto: UpdatePeriodDto, userId: string, ipAddress?: string) {
    const previous = await this.prisma.academicPeriod.findUnique({ where: { id } });
    if (!previous) {
      throw new NotFoundException('Periodo académico no encontrado');
    }

    const updated = await this.prisma.academicPeriod.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.isClosed !== undefined ? { isClosed: dto.isClosed } : {}),
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
      },
      include: { academicYear: true },
    });

    await this.audit.execute({
      userId,
      action: AuditAction.UPDATE,
      entity: 'AcademicPeriod',
      entityId: id,
      previousValue: previous as unknown as Record<string, unknown>,
      newValue: updated as unknown as Record<string, unknown>,
      ipAddress,
    });

    return updated;
  }
}
