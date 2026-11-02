export type estudianterelacion = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'TUTOR' | 'OTHER';

export interface estudianteregistroentrada {
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'UNSPECIFIED';
  phone?: string;
  parentId?: string;
  relationship?: estudianterelacion;
}

export interface estudianteregistro {
  id: string;
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  gender: string;
  isActive: boolean;
  enrollments: Array<{ course: { name: string } }>;
  parents?: Array<{
    relationship: string;
    parent: { id: string; firstName: string; lastName: string };
  }>;
}

export interface estudiantecoincidencia {
  id: string;
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  deletedAt: string | null;
}

export interface familiaropcion {
  id: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface estudiantedocumentoreferencia {
  id: string;
  documentType: 'BIRTH_CERTIFICATE' | 'IDENTITY_DOCUMENT' | 'RUDE_FORM' | 'OTHER';
  reference: string;
  notes: string | null;
  createdAt: string;
  createdBy: { firstName: string; lastName: string };
}

export interface estudiantedocumentoreferenciaentrada {
  documentType: estudiantedocumentoreferencia['documentType'];
  reference: string;
  notes?: string;
}

export interface estudiantehistorialregistro {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string | null;
  createdAt: string;
}

export interface estudianteregistroresultado {
  student: Pick<estudianteregistro, 'firstName' | 'lastName'>;
  activationToken: string;
  activationExpiresAt: string;
}

export interface estudianteactivacionresultado {
  activationToken: string;
  activationExpiresAt: string;
}

export interface puertogestionestudiante {
  buscarcoincidencias(entrada: { rude?: string; ci?: string }): Promise<estudiantecoincidencia[]>;
  listarcursos(): Promise<Array<{ id: string; name: string; section: string; gradeLevel: number }>>;
  listarestudiantes(entrada: {
    search: string;
    courseId?: string;
    limit: number;
    offset: number;
  }): Promise<{ data: estudianteregistro[]; total: number }>;
  listarfamiliares(limite: number): Promise<{ data: familiaropcion[] }>;
  listarestudiantedocumentoreferencias(
    idestudiante: string,
  ): Promise<estudiantedocumentoreferencia[]>;
  listarestudiantehistorial(
    idestudiante: string,
  ): Promise<estudiantehistorialregistro[]>;
  crearestudiante(entrada: estudianteregistroentrada): Promise<estudianteregistroresultado>;
  actualizarci(idestudiante: string, ci: string): Promise<void>;
  reemisionestudianteactivacion(idestudiante: string): Promise<estudianteactivacionresultado>;
  crearestudiantedocumentoreferencia(
    idestudiante: string,
    entrada: estudiantedocumentoreferenciaentrada,
  ): Promise<estudiantedocumentoreferencia>;
  eliminarestudiante(idestudiante: string): Promise<void>;
}

export class gestionestudiante {
  constructor(private readonly puerto: puertogestionestudiante) {}

  listarcursos() {
    return this.puerto.listarcursos();
  }

  buscarcoincidencias(entrada: { rude?: string; ci?: string }) {
    const rude = this.opcionaltexto(entrada.rude);
    const ci = this.opcionaltexto(entrada.ci);
    if (!rude && !ci) return Promise.resolve([]);
    return this.puerto.buscarcoincidencias({ rude, ci });
  }

  listarestudiantes(entrada: { search: string; courseId?: string; limit: number; offset: number }) {
    return this.puerto.listarestudiantes({
      search: entrada.search.trim(),
      courseId: entrada.courseId,
      limit: Math.max(1, Math.trunc(entrada.limit)),
      offset: Math.max(0, Math.trunc(entrada.offset)),
    });
  }

  listarfamiliares(limite: number) {
    return this.puerto.listarfamiliares(Math.max(1, Math.trunc(limite)));
  }

  listarestudiantedocumentoreferencias(idestudiante: string) {
    return this.puerto.listarestudiantedocumentoreferencias(
      this.requeriridentificador(idestudiante),
    );
  }

  listarestudiantehistorial(idestudiante: string) {
    return this.puerto.listarestudiantehistorial(
      this.requeriridentificador(idestudiante),
    );
  }

  registrarestudiante(entrada: estudianteregistroentrada) {
    const familiarid = this.opcionaltexto(entrada.parentId);
    return this.puerto.crearestudiante({
      rude: entrada.rude.trim(),
      ci: entrada.ci.trim(),
      firstName: entrada.firstName.trim(),
      lastName: entrada.lastName.trim(),
      birthDate: entrada.birthDate,
      gender: entrada.gender,
      phone: this.opcionaltexto(entrada.phone),
      parentId: familiarid,
      relationship: familiarid ? (entrada.relationship ?? 'TUTOR') : undefined,
    });
  }

  actualizarci(idestudiante: string, ci: string) {
    const identificador = this.requeriridentificador(idestudiante);
    const ciNormalizado = ci.trim();
    if (!/^\d{7}$/.test(ciNormalizado)) {
      throw new Error('La cédula de identidad debe tener 7 dígitos.');
    }
    return this.puerto.actualizarci(identificador, ciNormalizado);
  }

  reemisionestudianteactivacion(idestudiante: string) {
    return this.puerto.reemisionestudianteactivacion(this.requeriridentificador(idestudiante));
  }

  crearestudiantedocumentoreferencia(
    idestudiante: string,
    entrada: estudiantedocumentoreferenciaentrada,
  ) {
    const referencia = entrada.reference.trim();
    if (referencia.length < 2) {
      throw new Error('La referencia documental debe tener al menos dos caracteres.');
    }
    return this.puerto.crearestudiantedocumentoreferencia(
      this.requeriridentificador(idestudiante),
      {
        documentType: entrada.documentType,
        reference: referencia,
        notes: this.opcionaltexto(entrada.notes),
      },
    );
  }

  eliminarestudiante(idestudiante: string) {
    return this.puerto.eliminarestudiante(this.requeriridentificador(idestudiante));
  }

  private opcionaltexto(valor: string | undefined): string | undefined {
    const normalizado = valor?.trim();
    return normalizado || undefined;
  }

  private requeriridentificador(valor: string): string {
    const normalizado = valor.trim();
    if (!normalizado) throw new Error('Se requiere el identificador del estudiante.');
    return normalizado;
  }
}
