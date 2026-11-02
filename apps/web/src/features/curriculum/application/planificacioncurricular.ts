export type curriculotemaestado = 'PLANIFICADO' | 'EN_DESARROLLO' | 'COMPLETADO';

export interface curriculocursoopcion {
  id: string;
  name: string;
}

export interface curriculotema {
  id: string;
  periodNumber: number;
  gradeLevel: number;
  campo: string;
  unitTitle: string;
  title: string;
  description?: string | null;
  progressPercent: number;
  status: curriculotemaestado;
  subject?: { id: string; code: string; name: string; area?: string | null };
  course?: { id: string; name: string } | null;
}

export interface curriculoestadisticas {
  totalTopics: number;
  completed: number;
  inProgress: number;
  planned: number;
  averageProgress: number;
  byLevel: Record<
    'inicial' | 'primaria' | 'secundaria',
    {
      total: number;
      completed: number;
      avgProgress: number;
    }
  >;
}

export interface curriculoplanificacionpuerto {
  listarcursos(): Promise<curriculocursoopcion[]>;
  obtenerestadisticas(): Promise<curriculoestadisticas>;
  listarmaterias(): Promise<Array<{ id: string; code: string; name: string; area?: string | null }>>;
  crearmateria(entrada: {
    name: string;
    code: string;
    area?: string;
    description?: string;
  }): Promise<{ id: string; code: string; name: string }>;
  listartemas(filtros: {
    periodNumber?: number;
    courseId?: string;
    search?: string;
  }): Promise<curriculotema[]>;
  actualizaravance(
    temaid: string,
    entrada: { status: curriculotemaestado; progressPercent: number },
  ): Promise<void>;
}

export class curriculoplanificacion {
  constructor(private readonly puerto: curriculoplanificacionpuerto) {}

  listarcursos() {
    return this.puerto.listarcursos();
  }

  obtenerestadisticas() {
    return this.puerto.obtenerestadisticas();
  }

  listarmaterias() {
    return this.puerto.listarmaterias();
  }

  crearmateria(entrada: {
    name: string;
    code: string;
    area?: string;
    description?: string;
  }) {
    return this.puerto.crearmateria({
      ...entrada,
      name: entrada.name.trim(),
      code: entrada.code.trim().toUpperCase(),
      area: entrada.area?.trim() || undefined,
    });
  }

  listartemas(filtros: { periodNumber?: number; courseId?: string; search?: string }) {
    return this.puerto.listartemas({
      ...filtros,
      courseId: filtros.courseId?.trim() || undefined,
      search: filtros.search?.trim() || undefined,
    });
  }

  avanzaravance(tema: curriculotema, incremento: number) {
    if (!Number.isFinite(incremento)) {
      throw new Error('El cambio de avance debe ser un número finito.');
    }
    const porcentajeavance = Math.min(100, Math.max(0, tema.progressPercent + incremento));
    const estado: curriculotemaestado =
      porcentajeavance === 100
        ? 'COMPLETADO'
        : porcentajeavance > 0
          ? 'EN_DESARROLLO'
          : 'PLANIFICADO';
    return this.puerto.actualizaravance(tema.id, {
      progressPercent: porcentajeavance,
      status: estado,
    });
  }
}
