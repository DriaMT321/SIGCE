import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole, AuditAction } from '@academic/shared-types';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { PrismaService } from '../../../../common/database/prisma.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly prisma: PrismaService,
    private readonly audit: CreateAuditLogUseCase,
  ) {}

  async execute(dto: CreateUserDto, currentUserId?: string, ipAddress?: string) {
    // 1. RESTRICCIÓN OBLIGATORIA: No se permite crear el rol ADMINISTRADOR
    if (dto.role === UserRole.ADMIN || (dto.role as string) === 'ADMIN') {
      throw new BadRequestException('Por políticas de seguridad, no está permitido crear usuarios con rol ADMINISTRADOR');
    }

    // 2. Verificar duplicidad de email
    const existingEmail = await this.userRepo.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException(`El correo electrónico '${dto.email}' ya se encuentra registrado en el sistema`);
    }

    // 3. Verificar duplicidad de CI si aplica
    if (dto.ci?.trim()) {
      const cleanCi = dto.ci.trim();
      if (dto.role === UserRole.TEACHER) {
        const existingTeacher = await this.prisma.teacher.findFirst({
          where: { ci: cleanCi, deletedAt: null },
        });
        if (existingTeacher) {
          throw new ConflictException(`Ya existe un docente registrado con el C.I. '${cleanCi}'`);
        }
      } else if (dto.role === UserRole.PARENT) {
        const existingParent = await this.prisma.parent.findFirst({
          where: { ci: cleanCi, deletedAt: null },
        });
        if (existingParent) {
          throw new ConflictException(`Ya existe un familiar/tutor registrado con el C.I. '${cleanCi}'`);
        }
      }
    }

    // 4. Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 5. Crear usuario y perfil asociado
    const createdUser = await this.userRepo.create({
      ...dto,
      passwordHash,
    });

    // 6. Registro de Auditoría
    if (currentUserId) {
      await this.audit.execute({
        userId: currentUserId,
        action: AuditAction.CREATE,
        entity: 'User',
        entityId: createdUser.id,
        newValue: {
          email: createdUser.email,
          role: createdUser.role,
          name: createdUser.fullName,
        },
        ipAddress,
      });
    }

    return createdUser;
  }
}
