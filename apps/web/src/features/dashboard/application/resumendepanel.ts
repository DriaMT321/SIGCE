export interface curriculoresumen {
  totalTopics: number;
  completed: number;
  inProgress: number;
  planned: number;
  averageProgress: number;
}

export interface cursostablero {
  id: string;
  name: string;
  gradeLevel: number;
  section?: string;
  shift: string;
  enrollmentCount: number;
  maxCapacity: number;
}

export interface tableroresumenpuerto {
  cantidadestudiantes(): Promise<number>;
  cantidadcursos(): Promise<number>;
  cantidaddocentes(): Promise<number>;
  cantidadasignaciones(): Promise<number>;
  obtenercurriculoresumen(): Promise<curriculoresumen>;
  obtenercursos(): Promise<cursostablero[]>;
}

export class tableroresumen {
  constructor(private readonly puerto: tableroresumenpuerto) {}

  cantidadestudiantes() {
    return this.puerto.cantidadestudiantes();
  }

  cantidadcursos() {
    return this.puerto.cantidadcursos();
  }

  cantidaddocentes() {
    return this.puerto.cantidaddocentes();
  }

  cantidadasignaciones() {
    return this.puerto.cantidadasignaciones();
  }

  obtenercurriculoresumen() {
    return this.puerto.obtenercurriculoresumen();
  }

  obtenercursos() {
    return this.puerto.obtenercursos();
  }
}
