import type { sieauditoriarespuestadatos } from './esquemasincronizacionsie';
import type {
  siesincronizacionlistarfiltros,
  siesincronizacionvistaprevia,
  siesincronizacionestadoevento,
  siesincronizacion,
  siesincronizacionelemento,
} from './esquemasincronizacionsie';

export interface sieacademicogestionopcion {
  id: string;
  year: number;
  name: string;
  isActive: boolean;
}

export interface sieperiodoopcion {
  id: string;
  name: string;
  number: number;
  isClosed: boolean;
}

export interface siecursoopcion {
  id: string;
  name: string;
  academicYearId: string;
}

export interface siemateriaopcion {
  id: string;
  code: string;
  name: string;
}

export interface sieauditoriaentrada {
  courseFilter: string;
  maxCourses: number;
  visualMode: boolean;
  username: string;
  password: string;
}

export interface sielanzamientofiltros {
  academicYearId: string;
  periodNumber: number;
  courseId?: string;
  subjectId?: string;
}

export interface puertogestionsiesincronizacion {
  comprobaracceso(credenciales: { username: string; password: string }): Promise<{
    active: boolean;
    loginSuccess: boolean;
    message: string;
    checkedAt: string;
  }>;
  comprobarreplicalocal(html?: string): Promise<{
    active: boolean;
    localReplica: boolean;
    structureRecognized: boolean;
    message: string;
    checkedAt: string;
    portalTitle: string;
  }>;
  obtenerultimoauditoria(): Promise<sieauditoriarespuestadatos>;
  ejecutarauditoria(entrada: sieauditoriaentrada): Promise<void>;
  listarsincronizaciones(filtros: siesincronizacionlistarfiltros): Promise<siesincronizacion[]>;
  resolverdiscrepancia(entrada: {
    groupId?: string;
    itemId?: string;
    decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
    reason: string;
  }): Promise<void>;
  reintentarelemento(elementoid: string, motivo: string): Promise<{ synchronizationId: string }>;
  reanudarsincronizacion(id: string, motivo: string): Promise<{ synchronizationId: string }>;
  suscribirseaestado(manejador: (evento: siesincronizacionestadoevento) => void): () => void;
  listaracademicogestiones(): Promise<sieacademicogestionopcion[]>;
  listarperiodos(idgestionacademica?: string): Promise<sieperiodoopcion[]>;
  listarcursos(): Promise<siecursoopcion[]>;
  listarmaterias(): Promise<siemateriaopcion[]>;
  vistaprevia(filtros: sielanzamientofiltros): Promise<siesincronizacionvistaprevia>;
  encolar(
    entrada: sielanzamientofiltros & {
      confirmSend: true;
      expectedFingerprint: string;
      expectedGradeCount: number;
      idempotencyKey: string;
    },
  ): Promise<{ synchronizationId: string }>;
}

export class gestionsiesincronizacion {
  constructor(private readonly puerto: puertogestionsiesincronizacion) {}

  comprobaracceso(credenciales: { username: string; password: string }) {
    return this.puerto.comprobaracceso(credenciales);
  }

  comprobarreplicalocal(html?: string) {
    return this.puerto.comprobarreplicalocal(html);
  }

  obtenerultimoauditoria() {
    return this.puerto.obtenerultimoauditoria();
  }

  ejecutarauditoria(entrada: sieauditoriaentrada) {
    return this.puerto.ejecutarauditoria(entrada);
  }

  listarsincronizaciones(filtros: siesincronizacionlistarfiltros) {
    return this.puerto.listarsincronizaciones(filtros);
  }

  resolverdiscrepancia(entrada: {
    groupId?: string;
    itemId?: string;
    decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
    reason: string;
  }) {
    const objetivoid = entrada.groupId?.trim() || entrada.itemId?.trim();
    if (!objetivoid) throw new Error('Seleccione una discrepancia.');
    const motivo = entrada.reason.trim();
    if (motivo.length < 8) throw new Error('El motivo debe tener al menos 8 caracteres.');
    return this.puerto.resolverdiscrepancia({ ...entrada, reason: motivo });
  }

  reintentarelemento(elemento: siesincronizacionelemento | null, motivo: string) {
    if (!elemento) throw new Error('Seleccione un ítem fallido.');
    const normalizadomotivo = motivo.trim();
    if (normalizadomotivo.length < 8)
      throw new Error('El motivo debe tener al menos 8 caracteres.');
    return this.puerto.reintentarelemento(elemento.id, normalizadomotivo);
  }

  reanudarsincronizacion(id: string | null, motivo: string) {
    if (!id?.trim()) throw new Error('Seleccione un lote pausado.');
    const normalizadomotivo = motivo.trim();
    if (normalizadomotivo.length < 8)
      throw new Error('El motivo debe tener al menos 8 caracteres.');
    return this.puerto.reanudarsincronizacion(id.trim(), normalizadomotivo);
  }

  suscribirseaestado(manejador: (evento: siesincronizacionestadoevento) => void) {
    return this.puerto.suscribirseaestado(manejador);
  }

  listaracademicogestiones() {
    return this.puerto.listaracademicogestiones();
  }

  listarperiodos(idgestionacademica?: string) {
    return this.puerto.listarperiodos(idgestionacademica);
  }

  listarcursos() {
    return this.puerto.listarcursos();
  }

  listarmaterias() {
    return this.puerto.listarmaterias();
  }

  vistaprevia(filtros: sielanzamientofiltros) {
    return this.puerto.vistaprevia(filtros);
  }

  encolar(
    entrada: sielanzamientofiltros & {
      confirmSend: true;
      expectedFingerprint: string;
      expectedGradeCount: number;
      idempotencyKey: string;
    },
  ) {
    if (!entrada.confirmSend || !entrada.expectedFingerprint.trim()) {
      throw new Error('Se requiere confirmar el resumen antes de encolar.');
    }
    return this.puerto.encolar(entrada);
  }
}
