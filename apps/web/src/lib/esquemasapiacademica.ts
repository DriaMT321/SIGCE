import { z } from 'zod';
import { estadoasistencia } from '@academic/shared-types';

export const estudianteesquema = z.object({
  id: z.string(),
  rude: z.string(),
  ci: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string(),
  gender: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  enrollments: z.array(
    z.object({
      id: z.string(),
      status: z.string(),
      course: z.object({
        id: z.string(),
        name: z.string(),
        gradeLevel: z.number(),
        section: z.string(),
      }),
      academicYear: z.object({ id: z.string(), year: z.number(), name: z.string() }),
    }),
  ),
  parents: z
    .array(
      z.object({
        id: z.string(),
        relationship: z.string(),
        isPrimary: z.boolean().optional(),
        canPickup: z.boolean().optional(),
        parent: z.object({
          id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
        }),
      }),
    )
    .optional(),
});
export const estudiantedocumentoreferenciaesquema = z.object({
  id: z.string(),
  studentId: z.string(),
  documentType: z.enum(['BIRTH_CERTIFICATE', 'IDENTITY_DOCUMENT', 'RUDE_FORM', 'OTHER']),
  reference: z.string(),
  notes: z.string().nullable(),
  createdById: z.string(),
  createdAt: z.string(),
  createdBy: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }),
});

export const cursoesquema = z.object({
  id: z.string(),
  academicYearId: z.string(),
  name: z.string(),
  gradeLevel: z.number(),
  section: z.string(),
  shift: z.string(),
  maxCapacity: z.number(),
  academicYear: z.object({ id: z.string(), year: z.number(), name: z.string() }),
  enrollmentCount: z.number(),
});

export const inscripcionesquema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  academicYearId: z.string(),
  enrollmentDate: z.string(),
  status: z.string(),
  remarks: z.string().nullable(),
  student: z.object({
    id: z.string(),
    rude: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  course: z.object({
    id: z.string(),
    name: z.string(),
    gradeLevel: z.number(),
    section: z.string(),
  }),
  academicYear: z.object({ id: z.string(), year: z.number(), name: z.string() }),
});

export const calificacionesquema = z.object({
  id: z.string(),
  enrollmentId: z.string(),
  studentId: z.string(),
  subjectId: z.string(),
  periodId: z.string(),
  value: z.number(),
  remarks: z.string().nullable(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable().optional(),
  publishedById: z.string().nullable().optional(),
  student: z.object({
    id: z.string(),
    rude: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  subject: z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    area: z.string().nullable().optional(),
  }),
  period: z.object({ id: z.string(), name: z.string(), number: z.number() }),
});

export const calificacioncorreccionesquema = z.object({
  id: z.string(),
  gradeId: z.string(),
  requestedById: z.string(),
  decidedById: z.string().nullable(),
  previousValue: z.number(),
  proposedValue: z.number(),
  reason: z.string(),
  evidenceReference: z.string(),
  decisionReason: z.string().nullable(),
  status: z.enum(['PENDING', 'EXECUTED', 'REJECTED']),
  createdAt: z.string(),
  decidedAt: z.string().nullable(),
  executedAt: z.string().nullable(),
  grade: z.object({
    id: z.string(),
    value: z.number(),
    studentId: z.string(),
    subjectId: z.string(),
    periodId: z.string(),
    student: z.object({ firstName: z.string(), lastName: z.string(), rude: z.string() }),
    subject: z.object({ name: z.string(), code: z.string() }),
    period: z.object({ name: z.string(), number: z.number(), isClosed: z.boolean() }),
  }),
  requestedBy: z.object({ firstName: z.string(), lastName: z.string() }),
  decidedBy: z.object({ firstName: z.string(), lastName: z.string() }).nullable(),
});

export type calificacioncorreccion = z.infer<typeof calificacioncorreccionesquema>;

export const asistenciaesquema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  registeredById: z.string(),
  date: z.string(),
  status: z.nativeEnum(estadoasistencia),
  justification: z.string().nullable(),
  student: z.object({
    id: z.string(),
    rude: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  course: z.object({
    id: z.string(),
    name: z.string(),
    gradeLevel: z.number(),
    section: z.string(),
  }),
});

export const alertareglaesquema = z.object({
  key: z.enum(['LOW_GRADE', 'REPEATED_ABSENCE', 'REPEATED_LATENESS']),
  enabled: z.boolean(),
  severity: z.enum(['INFO', 'WARNING', 'DANGER', 'SUCCESS']),
  gradeThreshold: z.number().nullable(),
  absenceThreshold: z.number().nullable(),
  absenceWindowDays: z.number().nullable(),
  updatedAt: z.string(),
});
export type alertaregla = z.infer<typeof alertareglaesquema>;

export const docenteesquema = z.object({
  id: z.string(),
  userId: z.string(),
  ci: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  specialty: z.string(),
  teacherAssignments: z.array(z.object({
    id: z.string(),
    courseId: z.string(),
    subjectId: z.string(),
    weeklyPeriods: z.number().nullable(),
    courseName: z.string(),
    courseGradeLevel: z.number(),
    courseSection: z.string(),
    gradeLevel: z.number(),
    section: z.string(),
    subjectCode: z.string(),
    subjectName: z.string(),
    academicYear: z.number(),
  })).optional().default([]),
  phone: z.string().nullable(),
  itemNumber: z.string().nullable(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const familiaresquema = z.object({
  id: z.string(),
  userId: z.string(),
  ci: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  occupation: z.string().nullable(),
  students: z.array(
    z.object({
      id: z.string(),
      rude: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      relationship: z.string(),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const listarrespuesta = <T extends z.ZodTypeAny>(elementoesquema: T) =>
  z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(elementoesquema),
    total: z.number(),
  });
export const datosrespuesta = <T extends z.ZodTypeAny>(elementoesquema: T) =>
  z.object({ statusCode: z.number(), message: z.string(), data: elementoesquema });

export const asignacionesquema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['TAREA', 'EXAMEN', 'TRABAJO_PRACTICO', 'PROYECTO', 'CONTROL_LECTURA']),
  description: z.string().nullable().optional(),
  dueDate: z.string(),
  maxScore: z.number().nullable().optional(),
  status: z.enum(['PENDIENTE', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO']),
  courseId: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  course: z
    .object({ id: z.string(), name: z.string(), gradeLevel: z.number(), section: z.string() })
    .optional(),
  subject: z.object({ id: z.string(), code: z.string(), name: z.string() }).optional(),
  teacher: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }).optional(),
  student: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }).optional(),
  createdAt: z.string().optional(),
});

export type estudiante = z.infer<typeof estudianteesquema>;
export type estudiantedocumentoreferencia = z.infer<typeof estudiantedocumentoreferenciaesquema>;
export type curso = z.infer<typeof cursoesquema>;
export type inscripcion = z.infer<typeof inscripcionesquema>;
export type calificacion = z.infer<typeof calificacionesquema>;
export type asistencia = z.infer<typeof asistenciaesquema>;
export type docente = z.infer<typeof docenteesquema>;
export type familiar = z.infer<typeof familiaresquema>;
export type asignacion = z.infer<typeof asignacionesquema>;
export type academicogestion = {
  id: string;
  year: number;
  name: string;
  isActive: boolean;
  isClosed: boolean;
};
export type periodo = {
  id: string;
  name: string;
  number: number;
  academicYearId: string;
  isClosed: boolean;
};
export type periodocierrevistaprevia = {
  id: string;
  name: string;
  isClosed: boolean;
  gradeCount: number;
  studentCount: number;
};
export type materia = { id: string; code: string; name: string };

export const academicogestionesquema = z.object({
  id: z.string(),
  year: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  isClosed: z.boolean(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});
export const periodoesquema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.number(),
  academicYearId: z.string(),
  isClosed: z.boolean(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});
export const materiaesquema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  area: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export interface clasehorarioelemento {
  id: string;
  courseId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';
  startTime: string;
  endTime: string;
  periodIndex: number;
  classroom?: string | null;
  course?: { id: string; name: string; gradeLevel: number; section: string };
  subject?: { id: string; code: string; name: string; area?: string | null };
  teacher?: { id: string; firstName: string; lastName: string; specialty: string };
}

export interface curriculotemaelemento {
  id: string;
  subjectId: string;
  courseId?: string | null;
  periodNumber: number;
  gradeLevel: number;
  campo: string;
  unitTitle: string;
  title: string;
  description?: string | null;
  progressPercent: number;
  status: 'PLANIFICADO' | 'EN_DESARROLLO' | 'COMPLETADO';
  subject?: { id: string; code: string; name: string; area?: string | null };
  course?: { id: string; name: string } | null;
}

export interface myhorariohijoelemento {
  student: { id: string; firstName: string; lastName: string; rude: string; ci: string };
  relationship?: string;
  course: curso | null;
  schedules: clasehorarioelemento[];
  teacherSubjects: Record<string, unknown>[];
}

export interface myhorariodatos {
  type: 'student' | 'parent' | 'teacher' | 'administrative';
  student?: { id: string; firstName: string; lastName: string; rude: string; ci: string };
  parent?: { id: string; firstName: string; lastName: string; ci: string };
  children?: myhorariohijoelemento[];
  course?: curso | null;
  schedules: clasehorarioelemento[];
  teacherSubjects?: Record<string, unknown>[];
  teacher?: docente;
  assignments?: Record<string, unknown>[];
  message?: string;
}
