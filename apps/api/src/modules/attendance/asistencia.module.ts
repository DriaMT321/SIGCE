import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioasistencias } from './domain/repositories/asistencia.repository.interface';
import { repositorioasistenciaprisma } from './infrastructure/persistence/prismaasistencia.repository';
import {
  casousocrearasistencia,
  casousolistarasistencias,
  casousoactualizarasistencia,
} from './application/use-cases/asistencia.use-cases';

@Module({
  controllers: [AttendanceController],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioasistencias, useClass: repositorioasistenciaprisma },
    proveedoraplicacion(casousolistarasistencias),
    proveedoraplicacion(casousocrearasistencia),
    proveedoraplicacion(casousoactualizarasistencia),
  ],
})
export class moduloasistencias {}
