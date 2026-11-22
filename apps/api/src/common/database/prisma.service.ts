import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class servicioprisma extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly registrador = new Logger(servicioprisma.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.registrador.log(' Conectado exitosamente a PostgreSQL mediante Prisma');
      try {
        await this.$executeRawUnsafe('ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "rda_number" TEXT');
        await this.$executeRawUnsafe('ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "escalafon_category" TEXT');
        await this.$executeRawUnsafe('ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "years_of_service" INTEGER');
        await this.$executeRawUnsafe('ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "photo_url" TEXT');
        await this.$executeRawUnsafe('ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "documents" JSONB');
        await this.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "teachers_rda_number_idx" ON "teachers"("rda_number")');

        await this.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "student_transfers" (
            "id" TEXT PRIMARY KEY,
            "enrollment_id" TEXT,
            "student_id" TEXT NOT NULL,
            "academic_year_id" TEXT NOT NULL,
            "direction" TEXT NOT NULL DEFAULT 'SALIENTE',
            "transfer_type" TEXT NOT NULL DEFAULT 'REGULAR',
            "causal" TEXT NOT NULL,
            "causal_details" TEXT,
            "origin_school" TEXT NOT NULL,
            "origin_sie_code" TEXT,
            "destination_school" TEXT NOT NULL,
            "destination_sie_code" TEXT,
            "destination_district" TEXT,
            "destination_department" TEXT,
            "target_grade_course" TEXT,
            "current_trimester" INTEGER NOT NULL DEFAULT 1,
            "grades_snapshot" JSONB,
            "phase" TEXT NOT NULL DEFAULT 'SOLICITAR_RETIRO',
            "status" TEXT NOT NULL DEFAULT 'EN_TRAMITE',
            "distrital_resolution" TEXT,
            "distrital_approval_date" TIMESTAMP(3),
            "sie_sync_deadline" TIMESTAMP(3),
            "sie_sync_completed_at" TIMESTAMP(3),
            "sie_folio_number" TEXT,
            "documents_checklist" JSONB,
            "anti_coercion_certified" BOOLEAN NOT NULL DEFAULT true,
            "solicitante_nombre" TEXT,
            "solicitante_ci" TEXT,
            "solicitante_parentesco" TEXT,
            "solicitante_telefono" TEXT,
            "observations" TEXT,
            "created_by_user_id" TEXT,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await this.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "student_transfers_student_id_idx" ON "student_transfers"("student_id")');
        await this.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "student_transfers_academic_year_id_idx" ON "student_transfers"("academic_year_id")');
        await this.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "student_transfers_status_idx" ON "student_transfers"("status")');
        await this.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "student_transfers_phase_idx" ON "student_transfers"("phase")');
      } catch (errDb) {
        this.registrador.warn('Aviso al comprobar esquema de docentes (RDA) o traslados:', errDb);
      }
    } catch (error) {
      this.registrador.error(' Error conectando a PostgreSQL:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.registrador.log('Desconectado de PostgreSQL');
  }
}
