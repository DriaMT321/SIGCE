export type anunciourgencia = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type anuncioalcance =
  | 'COURSE'
  | 'ALL_COURSES'
  | 'PARENT'
  | 'ALL_PARENTS'
  | 'TEACHER'
  | 'ALL_TEACHERS'
  | 'SPECIFIC_PARENTS'
  | 'SPECIFIC_TEACHERS'
  | 'SPECIFIC_STUDENTS';

export interface anuncioregistro {
  id: string;
  title: string;
  content: string;
  urgency: anunciourgencia;
  scope: anuncioalcance;
  targetUserIds?: string[];
  createdAt: string;
  createdBy?: { firstName: string; lastName: string; role: string };
  targetCourse?: { id: string; name: string } | null;
  targetParent?: { firstName: string; lastName: string } | null;
  targetTeacher?: { firstName: string; lastName: string } | null;
}

export interface anunciocursoopcion {
  id: string;
  name: string;
}

export interface anunciodocenteopcion {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  itemNumber: string | null;
}

export interface anunciofamiliaropcion {
  id: string;
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  students: Array<{ firstName: string; lastName: string }>;
}

export interface anuncioestudianteopcion {
  id: string;
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  enrollments: Array<{ course: { name: string } }>;
}

export interface crearanuncioentrada {
  title: string;
  content: string;
  urgency: anunciourgencia;
  scope: anuncioalcance;
  targetCourseId?: string;
  targetParentId?: string;
  targetTeacherId?: string;
  targetUserIds?: string[];
}

export interface puertogestionanuncio {
  listaranuncios(): Promise<anuncioregistro[]>;
  listarcursos(): Promise<anunciocursoopcion[]>;
  listardocentes(): Promise<anunciodocenteopcion[]>;
  listarfamiliares(): Promise<anunciofamiliaropcion[]>;
  listarestudiantes(): Promise<anuncioestudianteopcion[]>;
  crearanuncio(entrada: crearanuncioentrada): Promise<void>;
  eliminaranuncio(anuncioid: string): Promise<void>;
}

export class gestionanuncio {
  constructor(private readonly puerto: puertogestionanuncio) {}

  listaranuncios() {
    return this.puerto.listaranuncios();
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listardocentes() {
    return this.puerto.listardocentes();
  }

  listarfamiliares() {
    return this.puerto.listarfamiliares();
  }

  listarestudiantes() {
    return this.puerto.listarestudiantes();
  }

  crearanuncio(entrada: crearanuncioentrada) {
    return this.puerto.crearanuncio({
      ...entrada,
      title: entrada.title.trim(),
      content: entrada.content.trim(),
      targetCourseId: this.opcionaltexto(entrada.targetCourseId),
      targetParentId: this.opcionaltexto(entrada.targetParentId),
      targetTeacherId: this.opcionaltexto(entrada.targetTeacherId),
      targetUserIds: entrada.targetUserIds?.map((id) => id.trim()).filter(Boolean),
    });
  }

  eliminaranuncio(anuncioid: string) {
    const normalizadoid = anuncioid.trim();
    if (!normalizadoid) throw new Error('Se requiere el identificador del comunicado.');
    return this.puerto.eliminaranuncio(normalizadoid);
  }

  private opcionaltexto(valor: string | undefined): string | undefined {
    const normalizado = valor?.trim();
    return normalizado || undefined;
  }
}
