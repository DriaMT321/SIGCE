export interface horariocursoopcion {
  id: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
}

export interface horariodocenteopcion {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

export interface horariomateriaopcion {
  id: string;
  code: string;
  name: string;
}

export interface clasehorarioregistro {
  id: string;
  courseId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  periodIndex: number;
  classroom?: string | null;
  course?: { id: string; name: string; gradeLevel: number; section: string };
  subject?: { id: string; code: string; name: string; area?: string | null };
  teacher?: { id: string; firstName: string; lastName: string; specialty: string };
}

export interface myhorariohijo {
  student: { id: string; firstName: string; lastName: string; rude: string; ci: string };
  course: horariocursoopcion | null;
  schedules: clasehorarioregistro[];
}

export interface myhorario {
  type: 'student' | 'parent' | 'teacher' | 'administrative';
  student?: { id: string; firstName: string; lastName: string; rude: string; ci: string };
  children?: myhorariohijo[];
  course?: horariocursoopcion | null;
  schedules: clasehorarioregistro[];
}

export interface horariocuadricula {
  course?: horariocursoopcion;
  schedules: clasehorarioregistro[];
  teacherSubjects: Array<{
    id: string;
    teacherId: string;
    subjectId: string;
    weeklyPeriods: number | null;
    teacher: horariodocenteopcion;
    subject: horariomateriaopcion;
  }>;
}

export interface automaticohorarioresultado {
  totalSlots: number;
  distribution: Array<{ subjectName: string; code: string; teacherName: string; periods: number }>;
}

export interface actualizarocrearhorarioentrada {
  courseId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: string;
  periodIndex: number;
  startTime: string;
  endTime: string;
  classroom?: string;
}

export interface puertogestionhorario {
  obtenermyhorario(): Promise<myhorario>;
  listarcursos(): Promise<horariocursoopcion[]>;
  listardocentes(): Promise<horariodocenteopcion[]>;
  listarmaterias(): Promise<horariomateriaopcion[]>;
  obtenercursohorario(cursoid: string): Promise<horariocuadricula>;
  obtenerdocentehorario(docenteid: string): Promise<{ schedules: clasehorarioregistro[] }>;
  actualizarocrearhorario(entrada: actualizarocrearhorarioentrada): Promise<void>;
  eliminarhorario(horarioid: string): Promise<void>;
  generarautomaticohorario(cursoid: string): Promise<automaticohorarioresultado>;
  asignarmateriasdocente(entrada: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
    weeklyPeriods?: number | null;
  }): Promise<number>;
}

export class gestionhorario {
  constructor(private readonly puerto: puertogestionhorario) {}

  obtenermyhorario() {
    return this.puerto.obtenermyhorario();
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listardocentes() {
    return this.puerto.listardocentes();
  }

  listarmaterias() {
    return this.puerto.listarmaterias();
  }

  obtenercursohorario(cursoid: string) {
    return this.puerto.obtenercursohorario(cursoid);
  }

  obtenerdocentehorario(docenteid: string) {
    return this.puerto.obtenerdocentehorario(docenteid);
  }

  actualizarocrearhorario(entrada: actualizarocrearhorarioentrada) {
    return this.puerto.actualizarocrearhorario({
      ...entrada,
      classroom: entrada.classroom?.trim() || undefined,
    });
  }

  eliminarhorario(horarioid: string) {
    const normalizadoid = horarioid.trim();
    if (!normalizadoid) throw new Error('Se requiere el identificador del horario.');
    return this.puerto.eliminarhorario(normalizadoid);
  }

  generarautomaticohorario(cursoid: string) {
    const normalizadoid = cursoid.trim();
    if (!normalizadoid) throw new Error('Selecciona un curso para generar el horario.');
    return this.puerto.generarautomaticohorario(normalizadoid);
  }

  asignarmateriasdocente(entrada: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
    weeklyPeriods?: number | null;
  }) {
    if (!entrada.courseId || !entrada.teacherId || entrada.subjectIds.length === 0) {
      throw new Error('Selecciona un curso, un docente y al menos una materia.');
    }
    return this.puerto.asignarmateriasdocente(entrada);
  }
}
