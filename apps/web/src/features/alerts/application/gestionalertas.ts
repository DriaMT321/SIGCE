export type alertaseveridad = 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';
export type alertaestado = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type alertareglaclave = 'LOW_GRADE' | 'REPEATED_ABSENCE' | 'REPEATED_LATENESS';

export interface alertaregistro {
  id: string;
  title: string;
  message: string;
  severity: string;
  status?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

export interface alertaregla {
  key: alertareglaclave;
  enabled: boolean;
  severity: alertaseveridad;
  gradeThreshold: number | null;
  absenceThreshold: number | null;
  absenceWindowDays: number | null;
  updatedAt: string;
}

export interface alertareglaentrada {
  enabled: boolean;
  severity: alertaseveridad;
  gradeThreshold?: number;
  absenceThreshold?: number;
  absenceWindowDays?: number;
}

export interface puertogestionalertas {
  listaralertas(): Promise<alertaregistro[]>;
  marcaralertaleer(alertaid: string): Promise<unknown>;
  actualizaralertaestado(alertaid: string, estado: alertaestado): Promise<unknown>;
  listarreglas(): Promise<alertaregla[]>;
  actualizarregla(clave: alertareglaclave, entrada: alertareglaentrada): Promise<alertaregla>;
  evaluarexistentealertas(): Promise<{ evaluated: number; failed: number }>;
}

export class gestionalertas {
  constructor(private readonly puerto: puertogestionalertas) {}

  listaralertas() {
    return this.puerto.listaralertas();
  }

  marcaralertaleer(alertaid: string) {
    return this.puerto.marcaralertaleer(this.requeriridentificador(alertaid));
  }

  actualizaralertaestado(alertaid: string, estado: alertaestado) {
    return this.puerto.actualizaralertaestado(this.requeriridentificador(alertaid), estado);
  }

  listarreglas() {
    return this.puerto.listarreglas();
  }

  actualizarregla(clave: alertareglaclave, entrada: alertareglaentrada) {
    if (clave === 'LOW_GRADE') {
      if (entrada.gradeThreshold === undefined) {
        throw new Error('El umbral de calificación debe estar entre 0 y 100.');
      }
      this.requerirrango(entrada.gradeThreshold, 0, 100, false);
    } else {
      if (entrada.absenceThreshold === undefined || entrada.absenceWindowDays === undefined) {
        throw new Error(
          'La regla de inasistencia requiere entre 1 y 30 faltas y una ventana de 1 a 365 días.',
        );
      }
      this.requerirrango(entrada.absenceThreshold, 1, 30, true);
      this.requerirrango(entrada.absenceWindowDays, 1, 365, true);
    }
    return this.puerto.actualizarregla(clave, entrada);
  }

  evaluarexistentealertas() {
    return this.puerto.evaluarexistentealertas();
  }

  private requeriridentificador(valor: string): string {
    const normalizado = valor.trim();
    if (!normalizado) throw new Error('Se requiere el identificador de la alerta.');
    return normalizado;
  }

  private requerirrango(valor: number, minimo: number, maximo: number, entero: boolean): void {
    if (
      !Number.isFinite(valor) ||
      (entero && !Number.isInteger(valor)) ||
      valor < minimo ||
      valor > maximo
    ) {
      throw new Error('El valor está fuera del rango permitido para la regla.');
    }
  }
}
