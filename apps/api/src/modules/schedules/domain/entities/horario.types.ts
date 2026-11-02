import { type turnoacademico } from '@academic/academic-domain';
import { codigodiadelasemana } from '@academic/domain-kernel';

export interface cursohorario {
  id: string;
  academicYearId: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: turnoacademico;
  maxCapacity: number;
}

export interface materiahorario {
  id: string;
  name: string;
  code: string;
  area?: string | null;
}

export interface docentehorario {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  user?: { firstName: string; lastName: string; email?: string };
}

export interface registrohorario {
  id: string;
  courseId: string;
  subjectId: string;
  teacherId: string;
  academicYearId: string;
  dayOfWeek: codigodiadelasemana;
  startTime: string;
  endTime: string;
  periodIndex: number;
  classroom: string | null;
  course?: cursohorario;
  subject?: materiahorario;
  teacher?: docentehorario;
}

export interface registromateriadocente {
  id: string;
  teacherId: string;
  subjectId: string;
  courseId: string;
  academicYearId: string;
  subject: materiahorario;
  teacher: docentehorario;
  course?: cursohorario;
  weeklyPeriods: number | null;
}

export interface estudiantehorario {
  id: string;
  firstName: string;
  lastName: string;
  rude: string;
  ci: string;
}

export interface familiarhorario {
  id: string;
  firstName: string;
  lastName: string;
  ci: string;
}

export interface perfilhorarioestudiante {
  student: estudiantehorario;
  activeCourseId: string | null;
}

export interface perfilhorariofamiliar {
  parent: familiarhorario;
  children: Array<{
    student: estudiantehorario;
    relationship: string;
    activeCourseId: string | null;
  }>;
}

export interface resultadohorariocurso {
  course: cursohorario;
  schedules: registrohorario[];
  teacherSubjects: registromateriadocente[];
}

export interface resultadohorariodocente {
  teacher: docentehorario;
  schedules: registrohorario[];
  assignments: registromateriadocente[];
}

export interface resultadomihorario {
  type: 'student' | 'parent' | 'teacher' | 'administrative';
  student?: estudiantehorario;
  parent?: familiarhorario;
  children?: Array<{
    student: estudiantehorario;
    relationship: string;
    course: cursohorario | null;
    schedules: registrohorario[];
    teacherSubjects: registromateriadocente[];
  }>;
  course: cursohorario | null;
  schedules: registrohorario[];
  teacherSubjects: registromateriadocente[];
  teacher?: docentehorario;
  assignments?: registromateriadocente[];
  message?: string;
}
