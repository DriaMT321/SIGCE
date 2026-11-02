import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { casousoiniciarsesion } from './application/use-cases/acceso.use-case';
import { casousorenovartoken } from './application/use-cases/renovaciontoken.use-case';
import { casousorevocartokenrenovacion } from './application/use-cases/revocarrenovaciontoken.use-case';
import { casousoiniciarsesionporrol } from './application/use-cases/rolacceso.use-case';
import { tokenemisortokenautenticacion } from './application/ports/tokenemisor.port';
import { adaptadoremisiontokensjwt } from './infrastructure/security/jwttokenemisor.adapter';
import { estrategiajwt } from './infrastructure/strategies/jwt.strategy';
import { tokenlimitadorintentosautenticacion } from './application/ports/limitadorintentosautenticacion.port';
import { limitadorintentosautenticacion } from './infrastructure/security/limitadortasaintentosautenticacion.adapter';
import { tokenrepositorioautenticacion } from './domain/repositories/autenticacion.repository.interface';
import { repositorioautenticacionprisma } from './infrastructure/persistence/prismaautenticacion.repository';
import { casousoactivarcuentaestudiante } from './application/use-cases/activarcuentaestudiante.use-case';
import { tokenseguridadcredenciales } from './application/ports/seguridadcredencial.port';
import { seguridadcredencialesbcrypt } from './infrastructure/security/seguridadcredencialbcrypt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    proveedoraplicacion(casousoiniciarsesion),
    { provide: tokenrepositorioautenticacion, useClass: repositorioautenticacionprisma },
    proveedoraplicacion(casousoiniciarsesionporrol),
    proveedoraplicacion(casousoactivarcuentaestudiante),
    { provide: tokenseguridadcredenciales, useClass: seguridadcredencialesbcrypt },
    proveedoraplicacion(casousorenovartoken),
    proveedoraplicacion(casousorevocartokenrenovacion),
    { provide: tokenemisortokenautenticacion, useClass: adaptadoremisiontokensjwt },
    estrategiajwt,
    { provide: tokenlimitadorintentosautenticacion, useClass: limitadorintentosautenticacion },
  ],
  exports: [
    casousoiniciarsesion,
    estrategiajwt,
    PassportModule,
    JwtModule,
    tokenseguridadcredenciales,
  ],
})
export class moduloautenticacion {}
