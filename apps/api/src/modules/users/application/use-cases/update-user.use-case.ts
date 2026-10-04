import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuditAction } from '@academic/shared-types';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../dto/create-user.dto';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly audit: CreateAuditLogUseCase,
  ) {}

  async execute(id: string, dto: UpdateUserDto, currentUserId?: string, ipAddress?: string) {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let passwordHash: string | undefined;
    if (dto.password?.trim()) {
      passwordHash = await bcrypt.hash(dto.password.trim(), 10);
    }

    const updated = await this.userRepo.update(id, {
      ...dto,
      passwordHash,
    });

    if (currentUserId) {
      await this.audit.execute({
        userId: currentUserId,
        action: AuditAction.UPDATE,
        entity: 'User',
        entityId: id,
        previousValue: { isActive: existing.isActive, name: existing.fullName },
        newValue: { isActive: updated.isActive, name: updated.fullName },
        ipAddress,
      });
    }

    return updated;
  }
}
