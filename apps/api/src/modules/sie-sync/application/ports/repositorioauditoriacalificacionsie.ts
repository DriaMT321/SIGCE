export interface materiaauditoriasie {
  id: string;
  name: string;
}

export interface calificacionauditoriasie {
  subjectId: string;
  value: number;
  subject: { name: string };
}

export interface estudianteauditoriasie {
  id: string;
  rude: string;
  firstName: string;
  lastName: string;
  grades: calificacionauditoriasie[];
}

export interface repositorioauditoriacalificacionessie {
  obtenerdatosreferenciaauditoria(): Promise<{
    academicYearId: string | null;
    subjects: materiaauditoriasie[];
  }>;
  buscarcalificacionesestudiantes(
    rudes: string[],
    idgestionacademica: string,
    numeroperiodo: number,
  ): Promise<estudianteauditoriasie[]>;
}

export const tokenrepositorioauditoriacalificacionessie = Symbol('SIE_GRADE_AUDIT_REPOSITORY');
