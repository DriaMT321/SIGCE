import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './common/database/prisma.module';
import { QueueModule } from './common/queue/queue.module';
import { WebsocketModule } from './common/websocket/websocket.module';

// Módulos funcionales
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { SieSyncModule } from './modules/sie-sync/sie-sync.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ParentsModule } from './modules/parents/parents.module';
import { AcademicYearsModule } from './modules/academic-years/academic-years.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { GradesModule } from './modules/grades/grades.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Infraestructura transversal
    PrismaModule,
    QueueModule,
    WebsocketModule,

    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    AuditModule,
    SieSyncModule,
    StudentsModule,
    TeachersModule,
    ParentsModule,
    AcademicYearsModule,
    PeriodsModule,
    SubjectsModule,
    CoursesModule,
    EnrollmentsModule,
    GradesModule,
    AttendanceModule,
    AlertsModule,
    ReportsModule,
    SchedulesModule,
    CurriculumModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
