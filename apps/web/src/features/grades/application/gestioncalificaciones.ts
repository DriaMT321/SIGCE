export interface calificacionmateriaopcion {
  id: string;
  code: string;
  name: string;
}

export interface calificacionperiodoopcion {
  id: string;
  name: string;
  number: number;
  academicYearId: string;
  isClosed: boolean;
}

export interface calificacioncursoopcion {
  id: string;
  name: string;
  shift: string;
  gradeLevel: number;
}

export interface calificacionestudianteopcion {
  id: string;
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  enrollments: Array<{
    id: string;
    status: string;
    course: { id: string; name: string; gradeLevel: number };
    academicYear: { id: string; year: number };
  }>;
}

export interface calificacionregistro {
  id: string;
  enrollmentId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  remarks: string | null;
  updatedAt: string;
  publishedAt?: string | null;
  publishedById?: string | null;
  student: { id: string; rude: string; firstName: string; lastName: string };
  subject: calificacionmateriaopcion;
  period: { id: string; name: string; number: number };
}

export interface calificacioncorreccionregistro {
  id: string;
  previousValue: number;
  proposedValue: number;
  reason: string;
  evidenceReference: string;
  status: 'PENDING' | 'EXECUTED' | 'REJECTED';
  grade: {
    id: string;
    value: number;
    studentId: string;
    subjectId: string;
    periodId: string;
    student: { firstName: string; lastName: string; rude: string };
    subject: { name: string; code: string };
    period: { name: string; number: number; isClosed: boolean };
  };
  requestedBy: { firstName: string; lastName: string };
}

export interface calificacioncierrevistaprevia {
  id: string;
  name: string;
  isClosed: boolean;
  gradeCount: number;
  studentCount: number;
}

export interface crearcalificacionentrada {
  enrollmentId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  remarks?: string;
}

export interface masivocalificacionentrada {
  courseId: string;
  subjectId: string;
  periodId: string;
  grades: Array<{ studentId: string; enrollmentId: string; value: number; remarks?: string }>;
}

export interface puertogestioncalificacion {
  listarcalificaciones(): Promise<calificacionregistro[]>;
  buscarcalificaciones(filtros: {
    search?: string;
    courseId?: string;
    subjectId?: string;
    periodId?: string;
    offset: number;
  }): Promise<{ data: calificacionregistro[]; total: number }>;
  listarestudiantes(): Promise<calificacionestudianteopcion[]>;
  listarcursos(): Promise<calificacioncursoopcion[]>;
  listarmaterias(courseId?: string): Promise<calificacionmateriaopcion[]>;
  listarperiodos(): Promise<calificacionperiodoopcion[]>;
  crearcalificacion(entrada: crearcalificacionentrada): Promise<void>;
  crearmasivocalificaciones(
    entrada: masivocalificacionentrada,
  ): Promise<{ count: number; items: calificacionregistro[] }>;
  publicarcalificaciones(entrada: {
    courseId: string;
    subjectId: string;
    periodId: string;
    reason?: string;
  }): Promise<{ publishedCount: number; publishedAt: string }>;
  crearperiodo(entrada: {
    academicYearId: string;
    name: string;
    number: number;
    startDate: string;
    endDate: string;
  }): Promise<calificacionperiodoopcion>;
  actualizarperiodo(entrada: {
    id: string;
    isClosed: boolean;
    expectedGradeCount?: number;
  }): Promise<void>;
  obtenerperiodocierrevistaprevia(periodoid: string): Promise<calificacioncierrevistaprevia>;
  listarpendientecorrecciones(): Promise<calificacioncorreccionregistro[]>;
  enviarcorreccion(entrada: {
    gradeId: string;
    proposedValue: number;
    reason: string;
    evidenceReference: string;
  }): Promise<void>;
  decidircorreccion(entrada: {
    id: string;
    approve: boolean;
    decisionReason: string;
  }): Promise<void>;
}

export class gestioncalificacion {
  constructor(private readonly puerto: puertogestioncalificacion) {}

  listarcalificaciones() {
    return this.puerto.listarcalificaciones();
  }

  buscarcalificaciones(filtros: {
    search?: string;
    courseId?: string;
    subjectId?: string;
    periodId?: string;
    offset: number;
  }) {
    return this.puerto.buscarcalificaciones(filtros);
  }

  listarestudiantes() {
    return this.puerto.listarestudiantes();
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listarmaterias(courseId?: string) {
    return this.puerto.listarmaterias(courseId);
  }

  listarperiodos() {
    return this.puerto.listarperiodos();
  }

  crearcalificacion(entrada: crearcalificacionentrada) {
    return this.puerto.crearcalificacion({
      ...entrada,
      remarks: entrada.remarks?.trim() || undefined,
    });
  }

  crearmasivocalificaciones(entrada: masivocalificacionentrada) {
    return this.puerto.crearmasivocalificaciones({
      ...entrada,
      grades: entrada.grades.map((calificacion) => ({
        ...calificacion,
        remarks: calificacion.remarks?.trim() || undefined,
      })),
    });
  }

  publicarcalificaciones(entrada: {
    courseId: string;
    subjectId: string;
    periodId: string;
    reason?: string;
  }) {
    return this.puerto.publicarcalificaciones({
      ...entrada,
      reason: entrada.reason?.trim() || undefined,
    });
  }

  crearperiodo(entrada: {
    academicYearId: string;
    name: string;
    number: number;
    startDate: string;
    endDate: string;
  }) {
    return this.puerto.crearperiodo({
      ...entrada,
      name: entrada.name.trim(),
    });
  }

  actualizarperiodo(entrada: { id: string; isClosed: boolean; expectedGradeCount?: number }) {
    return this.puerto.actualizarperiodo(entrada);
  }

  obtenerperiodocierrevistaprevia(periodoid: string) {
    return this.puerto.obtenerperiodocierrevistaprevia(periodoid);
  }

  listarpendientecorrecciones() {
    return this.puerto.listarpendientecorrecciones();
  }

  enviarcorreccion(entrada: {
    gradeId: string;
    proposedValue: number;
    reason: string;
    evidenceReference: string;
  }) {
    return this.puerto.enviarcorreccion({
      ...entrada,
      reason: entrada.reason.trim(),
      evidenceReference: entrada.evidenceReference.trim(),
    });
  }

  decidircorreccion(entrada: { id: string; approve: boolean; decisionReason: string }) {
    return this.puerto.decidircorreccion({
      ...entrada,
      decisionReason: entrada.decisionReason.trim(),
    });
  }
}
