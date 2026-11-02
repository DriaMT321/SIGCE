import { grade } from '../entities/grade.entity';
import {
  datosactualizacioncalificacion,
  datoscreacioncalificacion,
} from '../entities/datosregistrocalificacion';

export const tokenrepositoriocalificaciones = Symbol('GRADE_REPOSITORY');

export interface consultacontextoescrituracalificacion {
  periodId: string;
  subjectId: string;
  enrollmentIds: string[];
  courseId?: string;
  teacherUserId?: string;
}

export interface contextoescrituracalificacion {
  period: { academicYearId: string; isClosed: boolean } | null;
  subjectExists: boolean;
  enrollments: Array<{
    id: string;
    studentId: string;
    courseId: string;
    academicYearId: string;
    status: string;
  }>;
  teacherProfileExists: boolean;
  hasAssignment: boolean;
}

export interface instantaneaauditoriacalificacion {
  id: string;
  enrollmentId: string;
  studentId: string;
  value: number;
  remarks: string | null;
}

export interface contextoauditoriacalificacion {
  userId: string;
  ipAddress?: string;
  correlationId?: string;
  reason?: string;
}

export interface contextoauditoriacargamasivacalificaciones extends contextoauditoriacalificacion {
  courseId: string;
  subjectId: string;
  periodId: string;
  studentIds: string[];
}

export interface contextopermisoescrituracalificacion {
  teacherUserId?: string;
}

export interface datosalcancepublicacioncalificaciones {
  courseId: string;
  subjectId: string;
  periodId: string;
}

export interface resultadopublicacioncalificaciones {
  publishedCount: number;
  publishedAt: Date;
}

export interface repositoriocalificaciones {
  buscartodos(consulta: {
    search?: string;
    studentId?: string;
    subjectId?: string;
    enrollmentId?: string;
    courseId?: string;
    periodId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: grade[]; total: number }>;
  buscarporidentificador(id: string): Promise<grade | null>;
  obtenercontextoescritura(
    consulta: consultacontextoescrituracalificacion,
  ): Promise<contextoescrituracalificacion>;
  buscaranterioresporlote(
    idsestudiantes: string[],
    idmateria: string,
    idperiodo: string,
  ): Promise<instantaneaauditoriacalificacion[]>;
  crear(
    datos: datoscreacioncalificacion,
    auditoria: contextoauditoriacalificacion,
    permiso: contextopermisoescrituracalificacion,
  ): Promise<grade>;
  actualizar(
    id: string,
    datos: datosactualizacioncalificacion,
    auditoria: contextoauditoriacalificacion,
    permiso: contextopermisoescrituracalificacion,
  ): Promise<grade>;
  insertaroactualizarporlote(
    calificaciones: datoscreacioncalificacion[],
    auditoria: contextoauditoriacargamasivacalificaciones,
    permiso: contextopermisoescrituracalificacion,
  ): Promise<grade[]>;
  publicarporlote(
    alcance: datosalcancepublicacioncalificaciones,
    auditoria: contextoauditoriacalificacion,
    permiso: contextopermisoescrituracalificacion,
  ): Promise<resultadopublicacioncalificaciones>;
}
