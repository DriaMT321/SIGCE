import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const constantecolasincronizacionsie = 'sie-synchronization';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (servicioconfiguracion: ConfigService) => ({
        connection: {
          host: servicioconfiguracion.get<string>('redis.host', 'localhost'),
          port: servicioconfiguracion.get<number>('redis.port', 6379),
          password: servicioconfiguracion.get<string>('redis.password') || undefined,
          ...(servicioconfiguracion.get<boolean>('redis.usarTLS', false) ? { tls: {} } : {}),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: constantecolasincronizacionsie,
    }),
  ],
  exports: [BullModule],
})
export class modulocolas {}
