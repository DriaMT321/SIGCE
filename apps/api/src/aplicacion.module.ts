import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import configuracionAplicacion from './config/configuracion';
import { moduloprisma } from './common/database/prisma.module';
import { modulowebsocket } from './common/websocket/websocket.module';
import { moduloeventosaplicacion } from './core/infrastructure/nest/eventosaplicacion.module';
import { modulocontextocorrelacion } from './core/infrastructure/nest/contextocorrelacion.module';

// Módulos funcionales
import { moduloautenticacion } from './modules/auth/autenticacion.module';
import { modulousuarios } from './modules/users/usuarios.module';
import { moduloauditoria } from './modules/audit/auditoria.module';
import { modulosincronizacionsie } from './modules/sie-sync/siesincronizacion.module';
import { moduloestudiantes } from './modules/students/estudiantes.module';
import { modulodocentes } from './modules/teachers/docentes.module';
import { modulofamiliares } from './modules/parents/padres.module';
import { moduloaniosacademicos } from './modules/academic-years/aniosacademicos.module';
import { moduloperiodos } from './modules/periods/periodos.module';
import { modulomaterias } from './modules/subjects/asignaturas.module';
import { modulocursos } from './modules/courses/cursos.module';
import { moduloinscripciones } from './modules/enrollments/inscripciones.module';
import { modulocalificaciones } from './modules/grades/calificaciones.module';
import { moduloasistencias } from './modules/attendance/asistencia.module';
import { moduloalertas } from './modules/alerts/alertas.module';
import { moduloinformes } from './modules/reports/informes.module';
import { modulohorarios } from './modules/schedules/horarios.module';
import { modulocurriculo } from './modules/curriculum/curriculo.module';
import { modulotareas } from './modules/assignments/tareas.module';
import { moduloanuncios } from './modules/announcements/anuncios.module';
import { moduloeventosacademicos } from './modules/academic-events/eventosacademicos.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '../../..', '.env'),
      load: [configuracionAplicacion],
    }),

    // Infraestructura transversal
    moduloprisma,
    modulowebsocket,
    moduloeventosaplicacion,
    modulocontextocorrelacion,

    // Módulos de la aplicación
    moduloautenticacion,
    modulousuarios,
    moduloauditoria,
    modulosincronizacionsie,
    moduloestudiantes,
    modulodocentes,
    modulofamiliares,
    moduloaniosacademicos,
    moduloperiodos,
    modulomaterias,
    modulocursos,
    moduloinscripciones,
    modulocalificaciones,
    moduloasistencias,
    moduloalertas,
    moduloinformes,
    modulohorarios,
    modulocurriculo,
    modulotareas,
    moduloanuncios,
    moduloeventosacademicos,
  ],
})
export class moduloaplicacion {}
