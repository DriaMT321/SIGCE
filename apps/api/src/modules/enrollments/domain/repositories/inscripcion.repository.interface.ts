import { entidadinscripcion } from '../entities/inscripcion.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export const tokenrepositorioinscripciones = Symbol('ENROLLMENT_REPOSITORY');

export interface datoscreacioninscripcion {
  studentId: string;
  courseId: string;
  academicYearId: string;
  enrollmentDate?: Date;
  remarks?: string;
}

export interface repositorioinscripciones {
  buscartodos(consulta: {
    academicYearId?: string;
    courseId?: string;
    studentId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidadinscripcion[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidadinscripcion | null>;
  crear(datos: datoscreacioninscripcion, auditoria: auditoriacontexto): Promise<entidadinscripcion>;
  actualizarestado(
    id: string,
    estado: string,
    observaciones: string | undefined,
    auditoria: auditoriacontexto,
  ): Promise<entidadinscripcion>;
  actualizarestadomasivo(
    ids: string[],
    estado: string,
    auditoria: auditoriacontexto,
  ): Promise<{ updatedCount: number; unchangedCount: number }>;
}
