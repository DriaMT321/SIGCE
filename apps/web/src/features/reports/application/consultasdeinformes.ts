import { cargartodospaginas } from './datosdeinformes';

export interface informecurso {
  id: string;
  name: string;
  academicYearId: string;
  gradeLevel: number;
  section: string;
  shift: string;
  academicYear: { id: string; name: string };
}

export interface informeestudiante {
  id: string;
  rude: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  enrollments: Array<{
    id: string;
    status: string;
    course: { id: string };
    academicYear: { id: string };
  }>;
}

export interface informeperiodo {
  id: string;
  name: string;
  academicYearId: string;
  number: number;
}

export interface informemateria {
  id: string;
  name: string;
  code: string;
  area?: string | null;
}

export interface informecalificacionregistro {
  enrollmentId: string;
  periodId: string;
  subjectId: string;
  value: number;
  subject: { name: string; area?: string | null };
  period: { name: string; number: number };
}

export interface informeasistenciaregistro {
  courseId: string;
  studentId: string;
  status: string;
}

export interface informeconsultaspuerto {
  listarcursos(desplazamiento: number): Promise<{ data: informecurso[]; total: number }>;
  listarestudiantes(desplazamiento: number): Promise<{ data: informeestudiante[]; total: number }>;
  listarperiodos(): Promise<informeperiodo[]>;
  listarmaterias(): Promise<informemateria[]>;
  listarcalificaciones(entrada: {
    offset: number;
    courseId?: string;
    enrollmentId?: string;
    periodId?: string;
    studentId?: string;
  }): Promise<{ data: informecalificacionregistro[]; total: number }>;
  listarasistencia(entrada: {
    courseId: string;
    offset: number;
  }): Promise<{ data: informeasistenciaregistro[]; total: number }>;
}

export class informeconsultas {
  constructor(private readonly puerto: informeconsultaspuerto) {}

  listarcursos() {
    return cargartodospaginas((desplazamiento) => this.puerto.listarcursos(desplazamiento));
  }

  listarestudiantes() {
    return cargartodospaginas((desplazamiento) => this.puerto.listarestudiantes(desplazamiento));
  }

  listarperiodos() {
    return this.puerto.listarperiodos();
  }

  listarmaterias() {
    return this.puerto.listarmaterias();
  }

  listarcalificaciones(entrada: {
    courseId?: string;
    enrollmentId?: string;
    periodId?: string;
    studentId?: string;
  }) {
    return cargartodospaginas((desplazamiento) =>
      this.puerto.listarcalificaciones({ ...entrada, offset: desplazamiento }),
    );
  }

  listarasistencia(cursoid: string) {
    const normalizadocursoid = cursoid.trim();
    if (!normalizadocursoid) throw new Error('Selecciona un curso para consultar la asistencia.');
    return cargartodospaginas((desplazamiento) =>
      this.puerto.listarasistencia({ courseId: normalizadocursoid, offset: desplazamiento }),
    );
  }
}
