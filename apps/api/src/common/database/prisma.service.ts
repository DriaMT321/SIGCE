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
        await this.$executeRawUnsafe(`
          ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "rda_number" TEXT;
          ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "escalafon_category" TEXT;
          ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "years_of_service" INTEGER;
          ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "photo_url" TEXT;
          ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "documents" JSONB;
          CREATE INDEX IF NOT EXISTS "teachers_rda_number_idx" ON "teachers"("rda_number");
        `);
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
