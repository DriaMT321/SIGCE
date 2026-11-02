export interface auditoriaregistroregistro {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string | null;
  reason?: string | null;
  correlationId?: string | null;
  previousValue: unknown | null;
  newValue: unknown | null;
  createdAt: string;
}

export interface auditoriaestudianteopcion {
  id: string;
  rude: string;
  firstName: string;
  lastName: string;
}

export interface auditoriaconsultaspuerto {
  listarauditoria(
    idestudiante?: string,
  ): Promise<{ data: auditoriaregistroregistro[]; total: number }>;
  listarestudianteopciones(): Promise<auditoriaestudianteopcion[]>;
}

export class consultasauditoria {
  constructor(private readonly puerto: auditoriaconsultaspuerto) {}

  listarauditoria(idestudiante?: string) {
    const normalizadoestudianteid = idestudiante?.trim();
    return this.puerto.listarauditoria(normalizadoestudianteid || undefined);
  }

  listarestudianteopciones() {
    return this.puerto.listarestudianteopciones();
  }
}
