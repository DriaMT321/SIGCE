import { entidadalerta } from '../entities/alerta.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import {
  actualizacionreglaalerta,
  clavereglaalerta,
  entidadreglaalerta,
  valorgravedadalerta,
} from '../entities/alertaregla.entity';

export const tokenrepositorioalertas = Symbol('ALERT_REPOSITORY');

export interface evaluacionalertapendiente {
  id: string;
  studentId: string;
  attempts: number;
}

export interface instantaneaadvertenciaestudiante {
  studentId: string;
  studentName: string;
  studentUserId: string | null;
  guardianUserIds: string[];
  administrativeUserIds?: string[];
  grades: Array<{
    id: string;
    value: number;
    subjectName: string;
    subjectId: string;
    periodId: string;
    periodName: string;
    courseId: string;
    courseName: string;
    teacherUserIds: string[];
  }>;
  absences: Array<{
    courseId: string;
    courseName: string;
    count: number;
    teacherUserIds: string[];
  }>;
  lateness?: Array<{
    courseId: string;
    courseName: string;
    count: number;
    teacherUserIds: string[];
  }>;
}

export interface entradaalertatemprana {
  userId: string;
  studentId: string;
  ruleKey: clavereglaalerta;
  deduplicationKey: string;
  title: string;
  message: string;
  severity: valorgravedadalerta;
  metadata: Record<string, string | number>;
}

export interface repositorioalertas {
  buscarporusuario(
    idusuario: string,
    limite: number,
    desplazamiento: number,
    estado?: string,
  ): Promise<{ items: entidadalerta[]; total: number }>;
  marcarleida(id: string, idusuario: string, auditoria: auditoriacontexto): Promise<entidadalerta>;
  actualizarestado(
    id: string,
    idusuario: string,
    estado: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
    auditoria: auditoriacontexto,
  ): Promise<entidadalerta>;
  listarreglas(): Promise<entidadreglaalerta[]>;
  actualizarregla(
    entrada: actualizacionreglaalerta,
    auditoria: auditoriacontexto,
  ): Promise<entidadreglaalerta>;
  obtenerinstantaneaadvertenciaestudiante(
    idestudiante: string,
    desde: Date,
    mediante: Date,
    desdeatrasos?: Date,
  ): Promise<instantaneaadvertenciaestudiante | null>;
  conciliaralertastempranas(
    idestudiante: string,
    claveregla: clavereglaalerta,
    activoalertas: entradaalertatemprana[],
  ): Promise<void>;
  listaridsestudiantesactivos(): Promise<string[]>;
  reclamarevaluacionespendientes(
    limite: number,
    ahora: Date,
    desactualizadobloqueoantes: Date,
  ): Promise<evaluacionalertapendiente[]>;
  completarevaluacionpendiente(id: string): Promise<void>;
  reintentarevaluacionpendiente(
    id: string,
    intentos: number,
    error: string,
    disponibledesde: Date,
  ): Promise<void>;
}
