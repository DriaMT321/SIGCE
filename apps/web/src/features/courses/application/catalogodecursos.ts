export interface cursoregistro {
  id: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
  maxCapacity: number;
  enrollmentCount: number;
}

export interface academicogestionopcion {
  id: string;
  year: number;
  name: string;
}

export interface cursoregistroentrada {
  academicYearId: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: 'MORNING' | 'AFTERNOON' | 'EVENING';
  maxCapacity: number;
}

export interface cursocatalogopuerto {
  listarcursos(buscar: string): Promise<{ data: cursoregistro[]; total: number }>;
  listaracademicogestiones(): Promise<academicogestionopcion[]>;
  crearcurso(entrada: cursoregistroentrada): Promise<cursoregistro>;
  crearacademicogestion(entrada: {
    year: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
  }): Promise<academicogestionopcion>;
}

export class cursocatalogo {
  constructor(private readonly puerto: cursocatalogopuerto) {}

  listarcursos(buscar: string) {
    return this.puerto.listarcursos(buscar.trim());
  }

  listaracademicogestiones() {
    return this.puerto.listaracademicogestiones();
  }

  crearacademicogestion(entrada: {
    year: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
  }) {
    return this.puerto.crearacademicogestion({
      ...entrada,
      name: entrada.name.trim(),
    });
  }

  registrarcurso(entrada: cursoregistroentrada) {
    return this.puerto.crearcurso({
      ...entrada,
      name: entrada.name.trim(),
      section: entrada.section.trim(),
    });
  }
}
