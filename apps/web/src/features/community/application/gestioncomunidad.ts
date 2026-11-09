export interface docenteasignacion {
  id: string;
  courseId: string;
  subjectId: string;
  weeklyPeriods: number | null;
  courseName: string;
  courseGradeLevel: number;
  courseSection: string;
  gradeLevel: number;
  section: string;
  subjectCode: string;
  subjectName: string;
  academicYear: number;
}

export interface docenteregistro {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  teacherAssignments: docenteasignacion[];
  phone: string | null;
  itemNumber: string | null;
}

export interface familiarregistro {
  id: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string | null;
  occupation: string | null;
  students: Array<{ id: string; rude: string; firstName: string; lastName: string; relationship: string }>;
}

export interface creardocenteentrada {
  email: string;
  password: string;
  ci: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone?: string;
  itemNumber?: string;
}

export interface crearfamiliarentrada {
  email: string;
  password: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  occupation?: string;
}

export interface docenteactualizarentrada {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  phone?: string;
  itemNumber?: string;
}

export interface familiaractualizarentrada {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  occupation?: string;
}

export interface puertogestioncomunidad {
  listardocentes(buscar: string): Promise<{ data: docenteregistro[]; total: number }>;
  listarfamiliares(
    buscar: string,
    limite: number,
  ): Promise<{ data: familiarregistro[]; total: number }>;
  creardocente(entrada: creardocenteentrada): Promise<void>;
  crearfamiliar(entrada: crearfamiliarentrada): Promise<familiarregistro>;
  actualizardocente(id: string, entrada: docenteactualizarentrada): Promise<void>;
  actualizarfamiliar(id: string, entrada: familiaractualizarentrada): Promise<void>;
  eliminardocente(id: string): Promise<void>;
  eliminarfamiliar(id: string): Promise<void>;
  listarmaterias(): Promise<Array<{ id: string; code: string; name: string; area?: string | null }>>;
  listarestudiantes(buscar?: string, limite?: number): Promise<Array<{ id: string; rude: string; firstName: string; lastName: string }>>;
  vincularestudiantefamiliar(studentId: string, payload: { parentId: string; relationship: string }): Promise<void>;
  actualizarvinculofamiliar(parentId: string, studentId: string, relationship: string): Promise<familiarregistro>;
  eliminarvinculofamiliar(parentId: string, studentId: string): Promise<familiarregistro>;
  listaracademicogestiones(): Promise<Array<{ id: string; year: number; name: string; isActive: boolean }>>;
  listarcursos(): Promise<Array<{ id: string; name: string; gradeLevel: number; section: string; shift?: string | null; academicYearId: string }>>;
  reemplazarmateriasdocente(payload: { courseId: string; teacherId: string; subjectIds: string[] }): Promise<{ added: number; removed: number; assignments: docenteasignacion[] }>;
  restablecercontrasena(userId: string, password: string): Promise<void>;
}

export class gestioncomunidad {
  constructor(private readonly puerto: puertogestioncomunidad) {}

  listardocentes(buscar: string) {
    return this.puerto.listardocentes(buscar.trim());
  }

  listarfamiliares(buscar: string, limite: number) {
    return this.puerto.listarfamiliares(buscar.trim(), Math.max(1, Math.trunc(limite)));
  }

  listarmaterias() {
    return this.puerto.listarmaterias();
  }

  listarestudiantes(buscar?: string, limite?: number) {
    return this.puerto.listarestudiantes(buscar, limite);
  }

  vincularestudiantefamiliar(studentId: string, payload: { parentId: string; relationship: string }) {
    return this.puerto.vincularestudiantefamiliar(studentId, payload);
  }

  actualizarvinculofamiliar(parentId: string, studentId: string, relationship: string) {
    return this.puerto.actualizarvinculofamiliar(parentId, studentId, relationship);
  }

  eliminarvinculofamiliar(parentId: string, studentId: string) {
    return this.puerto.eliminarvinculofamiliar(parentId, studentId);
  }

  listaracademicogestiones() {
    return this.puerto.listaracademicogestiones();
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  reemplazarmateriasdocente(payload: { courseId: string; teacherId: string; subjectIds: string[] }) {
    return this.puerto.reemplazarmateriasdocente(payload);
  }

  creardocente(entrada: creardocenteentrada) {
    return this.puerto.creardocente({
      ...entrada,
      ci: entrada.ci.trim(),
      firstName: entrada.firstName.trim(),
      lastName: entrada.lastName.trim(),
      specialty: entrada.specialty.trim(),
      phone: this.opcionaltexto(entrada.phone),
      itemNumber: this.opcionaltexto(entrada.itemNumber),
    });
  }

  crearfamiliar(entrada: crearfamiliarentrada) {
    return this.puerto.crearfamiliar({
      ...entrada,
      ci: entrada.ci.trim(),
      firstName: entrada.firstName.trim(),
      lastName: entrada.lastName.trim(),
      phone: entrada.phone.trim(),
      address: this.opcionaltexto(entrada.address),
      occupation: this.opcionaltexto(entrada.occupation),
    });
  }

  actualizardocente(id: string, entrada: docenteactualizarentrada) {
    return this.puerto.actualizardocente(
      this.requeriridentificador(id),
      this.normalizaropcionalcampos(entrada),
    );
  }

  actualizarfamiliar(id: string, entrada: familiaractualizarentrada) {
    return this.puerto.actualizarfamiliar(
      this.requeriridentificador(id),
      this.normalizaropcionalcampos(entrada),
    );
  }

  eliminardocente(id: string) {
    return this.puerto.eliminardocente(this.requeriridentificador(id));
  }

  eliminarfamiliar(id: string) {
    return this.puerto.eliminarfamiliar(this.requeriridentificador(id));
  }

  restablecercontrasena(userId: string, password: string) {
    return this.puerto.restablecercontrasena(this.requeriridentificador(userId), password);
  }

  private normalizaropcionalcampos<T extends object>(entrada: T): T {
    return Object.fromEntries(
      Object.entries(entrada).map(([clave, valor]) => [
        clave,
        this.opcionaltexto(typeof valor === 'string' ? valor : undefined),
      ]),
    ) as T;
  }

  private opcionaltexto(valor: string | undefined): string | undefined {
    const normalizado = valor?.trim();
    return normalizado || undefined;
  }

  private requeriridentificador(valor: string): string {
    const normalizado = valor.trim();
    if (!normalizado) throw new Error('Se requiere el identificador del registro.');
    return normalizado;
  }
}
