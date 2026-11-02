export const tokenconfiguracionauditoriacalificacionessie = Symbol('SIE_GRADE_AUDIT_CONFIGURATION');
export const tokennavegadorauditoriacalificacionessie = Symbol('SIE_GRADE_AUDIT_BROWSER');
export const tokenalmaceninformeauditoriacalificacionessie = Symbol('SIE_GRADE_AUDIT_REPORT_STORE');

export interface configuracionauditoriacalificacionessie {
  urlbase(): string;
}

export interface calificacionexternaisie {
  materia: string;
  notaprimertrimestre?: number | null;
  notasegundotrimestre?: number | null;
  notatercertrimestre?: number | null;
  notacualitativa?: string | null;
}

export interface estudianteexternaisie {
  rude: string;
  nombre: string;
  nivel?: string;
  grado?: string;
  paralelo?: string;
  turno?: string;
  calificaciones: calificacionexternaisie[];
}

export interface advertenciaextraccionsie {
  rude: string;
  error: unknown;
}

export interface resultadoextraccionsie {
  cursosauditados: number;
  estudiantes: estudianteexternaisie[];
  advertencias: advertenciaextraccionsie[];
}

export interface navegadorauditoriacalificacionessie {
  obtenercalificaciones(opciones: {
    url: string;
    usuario: string;
    contrasena: string;
    modovisual: boolean;
    maximocursos: number;
    filtrocurso: string;
  }): Promise<resultadoextraccionsie>;
}

export interface rutasinformeauditoriasie {
  jsonPath: string;
  markdownPath: string;
  publishedMarkerPath: string;
  pendingJsonPath: string;
  pendingMarkdownPath: string;
}

export interface almaceninformeauditoriasie {
  obtenerdirectoriotemporal(): string;
  idproceso(): number;
  nuevoidentificador(): string;
  unirruta(...partes: string[]): string;
  nombrebase(rutaarchivo: string): string;
  listararchivos(directorio: string): string[];
  existe(rutaarchivo: string): boolean;
  leertexto(rutaarchivo: string): string;
  modificadoen(rutaarchivo: string): number;
  eliminararchivo(rutaarchivo: string): void;
  estaprocesoactivo(idproceso: number): boolean;
  asegurarmarcadorpublicado(rutaarchivo: string): void;
  escribirexclusivoysincronizar(rutaarchivo: string, contenido: string): void;
  publicarexclusivo(rutapendiente: string, rutapublicada: string): void;
}
