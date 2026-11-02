import type { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export interface resumenanioacademico {
  id: string;
  year: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: { courses: number; enrollments: number; periods: number };
}

export interface datoscreacionanioacademico {
  year: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export type datosactualizacionanioacademico = Partial<
  Omit<datoscreacionanioacademico, 'year'>
> & {
  year?: number;
  isClosed?: boolean;
};

export interface repositorioanioacademico {
  buscartodos(): Promise<resumenanioacademico[]>;
  buscarporidentificador(id: string): Promise<resumenanioacademico | null>;
  crear(
    datos: datoscreacionanioacademico,
    auditoria: auditoriacontexto,
  ): Promise<resumenanioacademico>;
  actualizar(
    id: string,
    datos: datosactualizacionanioacademico,
    auditoria: auditoriacontexto,
  ): Promise<resumenanioacademico | null>;
  eliminar(id: string, auditoria: auditoriacontexto): Promise<void>;
}

export const tokenrepositorioanioacademico = Symbol('ACADEMIC_YEAR_REPOSITORY');
