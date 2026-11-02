export interface registroanioacademico {
  id: string;
  year: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface registroperiodoacademico {
  id: string;
  academicYearId: string;
  name: string;
  number: number;
  startDate: Date;
  endDate: Date;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface periodoacademicoconanio extends registroperiodoacademico {
  academicYear: registroanioacademico;
}

export interface actualizacionperiodoacademico {
  name?: string;
  isClosed?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface creacionperiodoacademico {
  academicYearId: string;
  name: string;
  number: number;
  startDate: Date;
  endDate: Date;
}

export interface vistapreviacierreperiodo {
  id: string;
  name: string;
  isClosed: boolean;
  gradeCount: number;
  studentCount: number;
}

export interface contextoauditoriaperiodoacademico {
  userId: string;
  ipAddress?: string;
  correlationId?: string;
  expectedGradeCount?: number;
}

export interface repositorioperiodosacademicos {
  buscartodos(idanioacademico?: string): Promise<periodoacademicoconanio[]>;
  buscarporidentificador(id: string): Promise<registroperiodoacademico | null>;
  obtenervistapreviacierre(id: string): Promise<vistapreviacierreperiodo | null>;
  crear(
    datos: creacionperiodoacademico,
    auditoria: contextoauditoriaperiodoacademico,
  ): Promise<periodoacademicoconanio>;
  actualizar(
    id: string,
    cambios: actualizacionperiodoacademico,
    auditoria: contextoauditoriaperiodoacademico,
  ): Promise<periodoacademicoconanio | null>;
}

export const tokenrepositorioperiodosacademicos = Symbol('ACADEMIC_PERIOD_REPOSITORY');
