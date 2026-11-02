import { estadoplanestudio } from '@academic/domain-kernel';

export interface registrotemacurricular {
  id: string;
  academicYearId: string;
  subjectId: string;
  courseId: string | null;
  gradeLevel: number;
  periodNumber: number;
  campo: string;
  unitTitle: string;
  title: string;
  description: string | null;
  progressPercent: number;
  status: estadoplanestudio;
  createdAt: Date;
  updatedAt: Date;
  subject: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    area: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  course: {
    id: string;
    academicYearId: string;
    name: string;
    gradeLevel: number;
    section: string;
    shift: string;
    maxCapacity: number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface filtrostemascurriculares {
  teacherUserId?: string;
  academicYearId?: string;
  courseId?: string;
  gradeLevel?: number;
  subjectId?: string;
  periodNumber?: number;
  status?: estadoplanestudio;
  search?: string;
}

export interface datoscreaciontemacurricular {
  academicYearId: string;
  subjectId: string;
  courseId?: string;
  gradeLevel: number;
  periodNumber: number;
  campo: string;
  unitTitle: string;
  title: string;
  description?: string;
}

export interface actualizacionavancecurricular {
  status?: estadoplanestudio;
  progressPercent?: number;
}

export interface repositoriocurriculo {
  buscaridanioacademicoactivo(): Promise<string | null>;
  buscartemas(filtros: filtrostemascurriculares): Promise<registrotemacurricular[]>;
  actualizarprogreso(
    id: string,
    datos: actualizacionavancecurricular,
  ): Promise<registrotemacurricular | null>;
  actualizarprogresodocente(
    id: string,
    datos: actualizacionavancecurricular,
    idusuario: string,
  ): Promise<registrotemacurricular | null>;
  creartema(datos: datoscreaciontemacurricular): Promise<registrotemacurricular>;
}

export const tokenrepositoriocurriculo = Symbol('CURRICULUM_REPOSITORY');
