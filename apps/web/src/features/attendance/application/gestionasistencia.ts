import type { estadoasistencia as estadoasistencia } from '@academic/shared-types';

export type asistenciaestado = `${estadoasistencia}`;

export interface asistenciaregistro {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: asistenciaestado;
  justification: string | null;
  student: { id?: string; rude?: string; firstName: string; lastName: string };
  course: { id: string; name: string };
}

export interface asistenciaestudianteopcion {
  id: string;
  firstName: string;
  lastName: string;
  rude?: string;
}

export interface asistenciacursoopcion {
  id: string;
  name: string;
}

export interface registroasistenciaentrada {
  studentId: string;
  courseId: string;
  date: string;
  status: asistenciaestado;
  justification?: string;
}

export interface asistenciamateriaopcion {
  id: string;
  name: string;
  code?: string;
}

export interface asistenciajustificacion {
  id: string;
  studentId: string;
  studentName: string;
  studentRude?: string;
  studentCi?: string;
  courseId: string;
  courseName: string;
  date: string;
  status: asistenciaestado;
  subjectName: string;
  parentReason: string | null;
  attachmentName: string | null;
  attachmentUrl: string | null;
  justificationStatus: 'PENDING_SUBMISSION' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface asistenciaclaseentrada {
  courseId: string;
  subjectId?: string;
  subjectName?: string;
  date: string;
  attendances: Array<{
    studentId: string;
    status: asistenciaestado;
    justification?: string;
  }>;
}

export interface puertogestionasistencia {
  listarasistencia(filtros?: {
    studentId?: string;
    courseId?: string;
    from?: string;
    to?: string;
    offset?: number;
  }): Promise<{ data: asistenciaregistro[]; total: number }>;
  listarestudiantes(courseId?: string): Promise<asistenciaestudianteopcion[]>;
  listarcursos(): Promise<asistenciacursoopcion[]>;
  listarmaterias?(courseId?: string): Promise<asistenciamateriaopcion[]>;
  registroasistencia(entrada: registroasistenciaentrada): Promise<void>;
  registrarasistenciaclase?(entrada: asistenciaclaseentrada): Promise<unknown>;
  listadjustificaciones?(): Promise<{ data: asistenciajustificacion[]; total: number }>;
  enviarjustificacion?(
    id: string,
    entrada: {
      reason: string;
      attachmentName?: string;
      attachmentUrl?: string;
      subjectName?: string;
    },
  ): Promise<void>;
  resolverjustificacion?(
    id: string,
    entrada: { decision: 'APPROVE' | 'REJECT'; reviewNotes?: string },
  ): Promise<void>;
}

export class gestionasistencia {
  constructor(private readonly puerto: puertogestionasistencia) {}

  listarasistencia(filtros?: {
    studentId?: string;
    courseId?: string;
    from?: string;
    to?: string;
    offset?: number;
  }) {
    return this.puerto.listarasistencia(filtros);
  }

  listarestudiantes(courseId?: string) {
    return this.puerto.listarestudiantes(courseId);
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listarmaterias(courseId?: string) {
    if (this.puerto.listarmaterias) return this.puerto.listarmaterias(courseId);
    return Promise.resolve([]);
  }

  registrarasistenciaclase(entrada: asistenciaclaseentrada) {
    if (this.puerto.registrarasistenciaclase) {
      return this.puerto.registrarasistenciaclase(entrada);
    }
    return Promise.resolve({ totalRegistrados: 0, totalAusencias: 0 });
  }

  listadjustificaciones() {
    if (this.puerto.listadjustificaciones) return this.puerto.listadjustificaciones();
    return Promise.resolve({ data: [], total: 0 });
  }

  enviarjustificacion(
    id: string,
    entrada: {
      reason: string;
      attachmentName?: string;
      attachmentUrl?: string;
      subjectName?: string;
    },
  ) {
    if (this.puerto.enviarjustificacion) return this.puerto.enviarjustificacion(id, entrada);
    return Promise.resolve();
  }

  resolverjustificacion(
    id: string,
    entrada: { decision: 'APPROVE' | 'REJECT'; reviewNotes?: string },
  ) {
    if (this.puerto.resolverjustificacion) return this.puerto.resolverjustificacion(id, entrada);
    return Promise.resolve();
  }

  async listarasistenciacursofecha(courseId: string, date: string): Promise<asistenciaregistro[]> {
    const registros: asistenciaregistro[] = [];
    let total = 0;
    do {
      const pagina = await this.puerto.listarasistencia({
        courseId,
        from: date,
        to: date,
        offset: registros.length,
      });
      total = Math.max(total, pagina.total);
      if (pagina.data.length === 0 && registros.length < total) {
        throw new Error('No se pudo cargar toda la asistencia del curso. Vuelve a intentarlo.');
      }
      registros.push(...pagina.data);
      if (new Set(registros.map((registro) => registro.id)).size !== registros.length) {
        throw new Error('La asistencia cambió mientras se cargaba. Vuelve a intentarlo.');
      }
    } while (registros.length < total);
    return registros.filter((registro) => registro.courseId === courseId);
  }

  async listartodaasistencia(filtros?: {
    courseId?: string;
    studentId?: string;
    from?: string;
    to?: string;
  }): Promise<asistenciaregistro[]> {
    const registros: asistenciaregistro[] = [];
    let offset = 0;
    while (true) {
      const pagina = await this.puerto.listarasistencia({
        ...filtros,
        offset,
      });
      registros.push(...pagina.data);
      if (pagina.data.length === 0 || registros.length >= pagina.total) break;
      offset += pagina.data.length;
    }
    return registros;
  }

  private normalizarregistro(entrada: registroasistenciaentrada): registroasistenciaentrada {
    const idestudiante = entrada.studentId.trim();
    const cursoid = entrada.courseId.trim();
    const fecha = entrada.date.trim();
    const justificacion = entrada.justification?.trim() || undefined;
    if (!idestudiante || !cursoid) throw new Error('Selecciona estudiante y curso.');
    if (!fecha) throw new Error('Selecciona la fecha de asistencia.');
    if (entrada.status === 'JUSTIFIED' && !justificacion) {
      throw new Error('Una asistencia justificada requiere indicar el motivo.');
    }
    return {
      ...entrada,
      studentId: idestudiante,
      courseId: cursoid,
      date: fecha,
      justification: justificacion,
    };
  }

  registroasistencia(entrada: registroasistenciaentrada) {
    return this.puerto.registroasistencia(this.normalizarregistro(entrada));
  }

  async registrarasistenciascurso(entradas: registroasistenciaentrada[]) {
    if (!entradas.length) throw new Error('No hay estudiantes pendientes para registrar.');
    const normalizadas = entradas.map((entrada) => this.normalizarregistro(entrada));
    if (new Set(normalizadas.map((entrada) => entrada.studentId)).size !== normalizadas.length) {
      throw new Error('La lista contiene estudiantes duplicados.');
    }
    if (
      normalizadas.some(
        (entrada) =>
          entrada.courseId !== normalizadas[0].courseId || entrada.date !== normalizadas[0].date,
      )
    ) {
      throw new Error('Todos los registros deben corresponder al mismo curso y fecha.');
    }
    const guardados: string[] = [];
    const fallidos: Array<{ studentId: string; message: string }> = [];
    for (const entrada of normalizadas) {
      try {
        await this.puerto.registroasistencia(entrada);
        guardados.push(entrada.studentId);
      } catch (error) {
        fallidos.push({
          studentId: entrada.studentId,
          message: error instanceof Error ? error.message : 'No se pudo guardar el registro.',
        });
      }
    }
    return { guardados, fallidos };
  }
}
