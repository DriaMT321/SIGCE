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
      } catch (errDb) {
        this.registrador.warn('Aviso al comprobar esquema de docentes (RDA):', errDb);
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
