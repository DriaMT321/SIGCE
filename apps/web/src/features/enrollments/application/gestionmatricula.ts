export type inscripcionestado = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED' | 'WITHDRAWN';

export interface inscripcionregistro {
  id: string;
  status: string;
  enrollmentDate: string;
  remarks: string | null;
  student: { id: string; rude: string; firstName: string; lastName: string };
  course: { id: string; name: string; gradeLevel: number; section: string };
  academicYear: { id: string; year: number; name: string };
}

export interface inscripcionestudianteopcion {
  id: string;
  firstName: string;
  lastName: string;
  rude?: string;
}

export interface inscripcioncursoopcion {
  id: string;
  name: string;
  gradeLevel?: number;
  section?: string;
}

export interface inscripcionacademicogestionopcion {
  id: string;
  name: string;
  year: number;
}

export interface crearinscripcionentrada {
  studentId: string;
  courseId: string;
  academicYearId: string;
  remarks?: string;
}

export interface puertogestioninscripcion {
  listarinscripciones(): Promise<inscripcionregistro[]>;
  listarestudiantes(): Promise<inscripcionestudianteopcion[]>;
  listarcursos(): Promise<inscripcioncursoopcion[]>;
  listaracademicogestiones(): Promise<inscripcionacademicogestionopcion[]>;
  crearinscripcion(entrada: crearinscripcionentrada): Promise<void>;
  actualizarestado(inscripcionid: string, estado: inscripcionestado): Promise<void>;
  actualizarestadomultiple(
    inscripcionids: string[],
    estado: inscripcionestado,
  ): Promise<{ updatedCount: number; unchangedCount: number }>;
}

export class gestioninscripcion {
  constructor(private readonly puerto: puertogestioninscripcion) {}

  listarinscripciones() {
    return this.puerto.listarinscripciones();
  }

  listarestudiantes() {
    return this.puerto.listarestudiantes();
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listaracademicogestiones() {
    return this.puerto.listaracademicogestiones();
  }

  crearinscripcion(entrada: crearinscripcionentrada) {
    const idestudiante = entrada.studentId.trim();
    const cursoid = entrada.courseId.trim();
    const idgestionacademica = entrada.academicYearId.trim();
    if (!idestudiante || !cursoid || !idgestionacademica) {
      throw new Error('Selecciona estudiante, curso y gestión académica.');
    }
    return this.puerto.crearinscripcion({
      ...entrada,
      studentId: idestudiante,
      courseId: cursoid,
      academicYearId: idgestionacademica,
      remarks: entrada.remarks?.trim() || undefined,
    });
  }

  actualizarestado(inscripcionid: string, estado: inscripcionestado) {
    const normalizadoid = inscripcionid.trim();
    if (!normalizadoid) throw new Error('Se requiere el identificador de la matrícula.');
    return this.puerto.actualizarestado(normalizadoid, estado);
  }

  actualizarestadomultiple(inscripcionids: string[], estado: inscripcionestado) {
    const ids = [...new Set(inscripcionids.map((id) => id.trim()).filter(Boolean))];
    if (ids.length === 0) throw new Error('Selecciona al menos una matrícula.');
    return this.puerto.actualizarestadomultiple(ids, estado);
  }
}
