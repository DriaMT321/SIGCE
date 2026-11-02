import { estadoasignacion, tipoasignacion } from '@academic/domain-kernel';

export interface ordencreartarea {
  title: string;
  type?: tipoasignacion;
  description?: string;
  dueDate: string;
  maxScore?: number;
  courseId: string;
  subjectId: string;
  teacherId?: string;
}

export interface ordenactualizartarea {
  title?: string;
  type?: tipoasignacion;
  description?: string;
  dueDate?: string;
  maxScore?: number;
  status?: estadoasignacion;
}
