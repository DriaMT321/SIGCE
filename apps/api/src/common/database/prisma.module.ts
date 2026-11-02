import { Global, Module } from '@nestjs/common';
import { servicioprisma } from './prisma.service';

@Global()
@Module({
  providers: [servicioprisma],
  exports: [servicioprisma],
})
export class moduloprisma {}
