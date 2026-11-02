import { codigodiadelasemana } from '@academic/domain-kernel';
import {
  resultadohorariocurso,
  perfilhorariofamiliar,
  registrohorario,
  perfilhorarioestudiante,
  resultadohorariodocente,
} from '../entities/horario.types';
import type { turnoacademico } from '@academic/academic-domain';
import type {
  asignaciondocente,
  bloquehorariogenerado,
  bloqueocupadodocente,
} from '../services/generarhorariosemanal';

export interface filtroshorario {
  soloGestionActiva?: boolean;
  courseId?: string;
  teacherId?: string;
  dayOfWeek?: codigodiadelasemana;
  academicYearId?: string;
}

export interface datosescriturahorario {
  courseId: string;
  subjectId: string;
  teacherId: string;
  academicYearId?: string;
  dayOfWeek: codigodiadelasemana;
  startTime: string;
  endTime: string;
  periodIndex: number;
  classroom?: string;
}

export interface resumengeneracionhorario {
  message: string;
  totalSlots: number;
  distribution: Array<{
    subjectName: string;
    code: string;
    teacherName: string;
    periods: number;
  }>;
}

export interface datosgeneracionhorario {
  curso: {
    id: string;
    nombre: string;
    nivel: number;
    idGestionAcademica: string;
    turno: turnoacademico;
  };
  asignaciones: asignaciondocente[];
  bloquesOcupados: bloqueocupadodocente[];
}

export interface comandoguardarhorariogenerado {
  idCurso: string;
  idGestionAcademica: string;
  nombreCursoEsperado: string;
  nivelEsperado: number;
  turnoEsperado: turnoacademico;
  aula: string;
  asignacionesEsperadas: Array<{ teacherId: string; subjectId: string }>;
  bloques: bloquehorariogenerado[];
}

export interface repositoriohorarios {
  asignarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
    weeklyPeriods?: number | null;
  }): Promise<number>;
  reemplazarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
  }): Promise<{
    added: number;
    removed: number;
    assignments: Array<{
      id: string;
      courseId: string;
      subjectId: string;
      weeklyPeriods: number | null;
      course: { id: string; name: string; gradeLevel: number; section: string };
      subject: { id: string; code: string; name: string };
      academicYear: { year: number };
    }>;
  }>;
  listar(filtros: filtroshorario): Promise<registrohorario[]>;
  obtenerhorariocurso(idcurso: string): Promise<resultadohorariocurso>;
  obtenerhorariodocente(
    iddocente: string,
    soloGestionActiva?: boolean,
  ): Promise<resultadohorariodocente>;
  buscariddocenteporusuario(idusuario: string): Promise<string | null>;
  buscarperfilhorarioestudiante(idusuario: string): Promise<perfilhorarioestudiante | null>;
  buscarperfilhorariofamiliar(idusuario: string): Promise<perfilhorariofamiliar | null>;
  insertaroactualizar(datos: datosescriturahorario): Promise<registrohorario>;
  cargardatosgeneracion(idcurso: string): Promise<datosgeneracionhorario | null>;
  guardarhorariogenerado(comando: comandoguardarhorariogenerado): Promise<void>;
  crear(datos: datosescriturahorario): Promise<registrohorario>;
  eliminar(id: string): Promise<void>;
}

export const tokenrepositoriohorarios = Symbol('SCHEDULE_REPOSITORY');
