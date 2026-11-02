import { entidadestudiante } from '../entities/estudiante.entity';

export const tokenrepositorioestudiantes = Symbol('STUDENT_REPOSITORY');

export interface datoscreacionestudiante {
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  address?: string;
  phone?: string;
  parentId?: string;
  relationship?: string;
}

export interface datosconfiguracioncuentaestudiante {
  placeholderPasswordHash: string;
  activationTokenHash: string;
  activationExpiresAt: Date;
}

export interface contextoauditoriaestudiante {
  userId: string;
  ipAddress?: string;
  correlationId?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

export type datosactualizacionestudiante = Partial<datoscreacionestudiante>;

export interface repositorioestudiantes {
  buscarcoincidencias(consulta: { rude?: string; ci?: string }): Promise<Array<{
    id: string; rude: string; ci: string; firstName: string; lastName: string;
    isActive: boolean; deletedAt: Date | null;
  }>>;
  buscartodos(consulta: {
    search?: string;
    courseId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidadestudiante[]; total: number }>;
  buscarporidentificador(
    id: string,
    idusuariofamiliar?: string,
    idusuariodocente?: string,
  ): Promise<entidadestudiante | null>;
  crear(
    datos: datoscreacionestudiante,
    cuentaconfiguracion: datosconfiguracioncuentaestudiante,
    auditoria: contextoauditoriaestudiante,
  ): Promise<entidadestudiante>;
  reemitiractivacion(
    id: string,
    cuentaconfiguracion: datosconfiguracioncuentaestudiante,
    auditoria: contextoauditoriaestudiante,
  ): Promise<string | null>;
  actualizar(
    id: string,
    datos: datosactualizacionestudiante,
    auditoria: contextoauditoriaestudiante,
  ): Promise<entidadestudiante>;
  eliminarlogicamente(id: string, auditoria: contextoauditoriaestudiante): Promise<void>;
}
