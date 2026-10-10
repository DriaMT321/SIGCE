import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { PARENT_REPOSITORY, ParentRepository } from '../../domain/repositories/parent.repository.interface';
import { CreateParentDto, UpdateParentDto } from '../dto/parent.dto';

@Injectable()
export class ListParentsUseCase {
  constructor(@Inject(PARENT_REPOSITORY) private readonly repository: ParentRepository) {}
  execute(query: { search?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class CreateParentUseCase {
  constructor(@Inject(PARENT_REPOSITORY) private readonly repository: ParentRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(dto: CreateParentDto, userId: string, ipAddress?: string) {
    const parent = await this.repository.create(dto);
    await this.audit.execute({ userId, action: AuditAction.CREATE, entity: 'Parent', entityId: parent.id, newValue: parent as unknown as Record<string, unknown>, ipAddress });
    return parent;
  }
}

@Injectable()
export class UpdateParentUseCase {
  constructor(@Inject(PARENT_REPOSITORY) private readonly repository: ParentRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, dto: UpdateParentDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Familiar no encontrado');
    const parent = await this.repository.update(id, dto);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Parent', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: parent as unknown as Record<string, unknown>, ipAddress });
    return parent;
  }
}

@Injectable()
export class DeleteParentUseCase {
  constructor(@Inject(PARENT_REPOSITORY) private readonly repository: ParentRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Familiar no encontrado');
    await this.repository.softDelete(id);
    await this.audit.execute({ userId, action: AuditAction.DELETE, entity: 'Parent', entityId: id, previousValue: previous as unknown as Record<string, unknown>, ipAddress });
  }
}
