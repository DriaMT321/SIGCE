import { z } from 'zod';

export const notaspreparadasesquema = z.object({
  data: z.object({
    course: z.object({ id: z.string(), name: z.string() }),
    subject: z.object({ id: z.string(), name: z.string(), code: z.string() }),
    period: z.object({ number: z.number(), name: z.string() }),
    fingerprint: z.string(),
    grades: z.array(
      z.object({
        gradeId: z.string(),
        studentId: z.string(),
        rude: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        value: z.number(),
      }),
    ),
  }),
});

export type notaspreparadas = z.infer<typeof notaspreparadasesquema>['data'];

export interface opciongestionasistentesie {
  id: string;
  name: string;
  isActive?: boolean;
}

export interface opcioncursoasistentesie {
  id: string;
  name: string;
  academicYearId: string;
}

export interface opcionmateriaasistentesie {
  id: string;
  name: string;
}

export interface opcionperiodoasistentesie {
  id: string;
  name: string;
  number: number;
  isClosed: boolean;
}

export interface gestionasistentesie {
  listargestiones(): Promise<opciongestionasistentesie[]>;
  listarperiodos(gestionId: string): Promise<opcionperiodoasistentesie[]>;
  listarcursos(): Promise<opcioncursoasistentesie[]>;
  listarmaterias(cursoId: string): Promise<opcionmateriaasistentesie[]>;
  prepararnotas(parametros: {
    academicYearId: string;
    courseId: string;
    subjectId: string;
    periodNumber: number;
  }): Promise<notaspreparadas>;
}
