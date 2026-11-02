import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class servicioprisma extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly registrador = new Logger(servicioprisma.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.registrador.log(' Conectado exitosamente a PostgreSQL mediante Prisma');
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
