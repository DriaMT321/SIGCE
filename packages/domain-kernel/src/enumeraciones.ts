export enum rolusuario {
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SECRETARY = 'SECRETARY',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
}

export enum estadoinscripcion {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRANSFERRED = 'TRANSFERRED',
  GRADUATED = 'GRADUATED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum estadoasistencia {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  JUSTIFIED = 'JUSTIFIED',
}

export enum severidadalerta {
  INFO = 'INFO',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
}

export enum accionauditoria {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SYNC_SIE = 'SYNC_SIE',
  VERIFY_SIE = 'VERIFY_SIE',
}

export enum genero {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNSPECIFIED = 'UNSPECIFIED',
}

export enum turno {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export enum tiporelacion {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN',
  TUTOR = 'TUTOR',
  OTHER = 'OTHER',
}

export enum estadoplanestudio {
  PLANIFICADO = 'PLANIFICADO',
  EN_DESARROLLO = 'EN_DESARROLLO',
  COMPLETADO = 'COMPLETADO',
}

export enum tipoasignacion {
  TAREA = 'TAREA',
  EXAMEN = 'EXAMEN',
  TRABAJO_PRACTICO = 'TRABAJO_PRACTICO',
  PROYECTO = 'PROYECTO',
  CONTROL_LECTURA = 'CONTROL_LECTURA',
}

export enum estadoasignacion {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

export const urgenciaanuncio = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA',
} as const;
export type codigourgenciaanuncio = (typeof urgenciaanuncio)[keyof typeof urgenciaanuncio];

export const alcanceanuncio = {
  COURSE: 'COURSE',
  ALL_COURSES: 'ALL_COURSES',
  PARENT: 'PARENT',
  ALL_PARENTS: 'ALL_PARENTS',
  TEACHER: 'TEACHER',
  ALL_TEACHERS: 'ALL_TEACHERS',
  SPECIFIC_PARENTS: 'SPECIFIC_PARENTS',
  SPECIFIC_TEACHERS: 'SPECIFIC_TEACHERS',
  SPECIFIC_STUDENTS: 'SPECIFIC_STUDENTS',
} as const;
export type codigoalcanceanuncio = (typeof alcanceanuncio)[keyof typeof alcanceanuncio];

export const diadelasemana = {
  LUNES: 'LUNES',
  MARTES: 'MARTES',
  MIERCOLES: 'MIERCOLES',
  JUEVES: 'JUEVES',
  VIERNES: 'VIERNES',
  SABADO: 'SABADO',
} as const;
export type codigodiadelasemana = (typeof diadelasemana)[keyof typeof diadelasemana];
