export type tipoeventoacademico =
  | 'ACTIVIDAD'
  | 'REUNION'
  | 'ACTO_ESCOLAR'
  | 'SUSPENSION_CLASES'
  | 'OTRO';
export type estadoeventoacademico = 'PROGRAMADO' | 'CANCELADO' | 'REALIZADO';

export interface eventoacademico {
  id: string;
  title: string;
  description: string | null;
  type: tipoeventoacademico;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  location: string | null;
  status: estadoeventoacademico;
  targetCourseId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  targetCourse: { id: string; name: string; gradeLevel: number; section: string } | null;
  createdBy: { id: string; firstName: string; lastName: string };
}

export interface cursoeventoopcion {
  id: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
}

export interface crearentradaeventoacademico {
  title: string;
  description?: string;
  type: tipoeventoacademico;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  location?: string;
  targetCourseId?: string | null;
}

export type actualizacionentradaeventoacademico = Omit<
  Partial<crearentradaeventoacademico>,
  'description' | 'location'
> & {
  description?: string | null;
  location?: string | null;
  status?: estadoeventoacademico;
};

export interface puertogestioneventosacademicos {
  listar(desde: string, hasta: string): Promise<eventoacademico[]>;
  listarcursos(): Promise<cursoeventoopcion[]>;
  crear(datos: crearentradaeventoacademico): Promise<eventoacademico>;
  actualizar(id: string, datos: actualizacionentradaeventoacademico): Promise<eventoacademico>;
  cancelar(id: string): Promise<eventoacademico>;
}

export class gestioneventosacademicos {
  constructor(private readonly puerto: puertogestioneventosacademicos) {}

  listar(desde: string, hasta: string) {
    return this.puerto.listar(desde, hasta);
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  crear(datos: crearentradaeventoacademico) {
    return this.puerto.crear({
      ...datos,
      title: datos.title.trim(),
      description: datos.description?.trim() || undefined,
      location: datos.location?.trim() || undefined,
    });
  }

  actualizar(id: string, datos: actualizacionentradaeventoacademico) {
    return this.puerto.actualizar(id, {
      ...datos,
      ...(datos.title !== undefined ? { title: datos.title.trim() } : {}),
      ...(datos.description !== undefined
        ? { description: datos.description?.trim() || null }
        : {}),
      ...(datos.location !== undefined ? { location: datos.location?.trim() || null } : {}),
    });
  }

  cancelar(id: string) {
    return this.puerto.cancelar(id);
  }
}

