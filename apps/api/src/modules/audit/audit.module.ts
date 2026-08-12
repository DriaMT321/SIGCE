import { Global, Module } from '@nestjs/common';
import { AUDIT_LOG_REPOSITORY } from './domain/repositories/audit-log.repository.interface';
import { PrismaAuditLogRepository } from './infrastructure/persistence/prisma-audit-log.repository';
import { CreateAuditLogUseCase } from './application/use-cases/create-audit-log.use-case';
import { GetAuditLogsUseCase } from './application/use-cases/get-audit-logs.use-case';
import { AuditController } from './presentation/controllers/audit.controller';

@Global()
@Module({
  controllers: [AuditController],
  providers: [
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: PrismaAuditLogRepository,
    },
    CreateAuditLogUseCase,
    GetAuditLogsUseCase,
  ],
  exports: [CreateAuditLogUseCase, GetAuditLogsUseCase, AUDIT_LOG_REPOSITORY],
})
export class AuditModule {}
