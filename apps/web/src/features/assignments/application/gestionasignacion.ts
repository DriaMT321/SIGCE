export type asignaciontipo =
  'TAREA' | 'EXAMEN' | 'TRABAJO_PRACTICO' | 'PROYECTO' | 'CONTROL_LECTURA';
export type asignacionestado = 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADO' | 'CANCELADO';

export interface asignacionregistro {
  id: string;
  title: string;
  type: asignaciontipo;
  description?: string | null;
  dueDate: string;
  maxScore?: number | null;
  status: asignacionestado;
  course?: { id: string; name: string; gradeLevel: number; section: string };
  subject?: { id: string; code: string; name: string };
  teacher?: { id: string; firstName: string; lastName: string };
  student?: { id: string; firstName: string; lastName: string };
}

export interface asignacioncursoopcion {
  id: string;
  name: string;
  shift: string;
  gradeLevel: number;
  section: string;
}

export interface asignacionmateriaopcion {
  id: string;
  code: string;
  name: string;
}

export interface crearasignacionentrada {
  title: string;
  type: asignaciontipo;
  courseId: string;
  subjectId: string;
  dueDate: string;
  maxScore: number;
  description?: string;
}

export interface puertogestionasignacion {
  listarasignaciones(): Promise<asignacionregistro[]>;
  listarcursos(): Promise<asignacioncursoopcion[]>;
  listarmaterias(): Promise<asignacionmateriaopcion[]>;
  crearasignacion(entrada: crearasignacionentrada): Promise<void>;
  actualizarestado(id: string, estado: 'FINALIZADO' | 'PENDIENTE'): Promise<void>;
  eliminarasignacion(id: string): Promise<void>;
}

export class gestionasignacion {
  constructor(private readonly puerto: puertogestionasignacion) {}

  listarasignaciones() {
    return this.puerto.listarasignaciones();
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listarmaterias() {
    return this.puerto.listarmaterias();
  }

  crearasignacion(entrada: crearasignacionentrada) {
    return this.puerto.crearasignacion({
      ...entrada,
      title: entrada.title.trim(),
      description: entrada.description?.trim() || undefined,
    });
  }

  actualizarestado(id: string, estado: 'FINALIZADO' | 'PENDIENTE') {
    return this.puerto.actualizarestado(this.requeriridentificador(id), estado);
  }

  eliminarasignacion(id: string) {
    return this.puerto.eliminarasignacion(this.requeriridentificador(id));
  }

  private requeriridentificador(valor: string): string {
    const normalizado = valor.trim();
    if (!normalizado) throw new Error('Se requiere el identificador de la actividad.');
    return normalizado;
  }
}
