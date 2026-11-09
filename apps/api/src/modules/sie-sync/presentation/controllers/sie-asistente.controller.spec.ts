import 'reflect-metadata';
import { Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { modulosincronizacionsie } from '../../siesincronizacion.module';
import { servicioasistentesie } from '../../application/services/asistentesie.service';
import { SieAsistenteController } from './sie-asistente.controller';

@Global()
@Module({
  providers: [{ provide: servicioprisma, useValue: {} }],
  exports: [servicioprisma],
})
class mockprismamodule {}

describe('SieAsistenteController DI wiring', () => {
  it('compiles modulosincronizacionsie and injects servicioasistentesie', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockprismamodule, modulosincronizacionsie],
    }).compile();

    const controller = moduleRef.get(SieAsistenteController);
    const service = moduleRef.get(servicioasistentesie);

    expect(controller).toBeInstanceOf(SieAsistenteController);
    expect(service).toBeInstanceOf(servicioasistentesie);

    await moduleRef.close();
  });
});
