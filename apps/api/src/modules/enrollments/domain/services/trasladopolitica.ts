import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { tipotraslado, causaltraslado, fasetraslado } from '@academic/domain-kernel';

export interface HechosCrearTraslado {
  studentActive: boolean;
  academicYearOpen: boolean;
  transferType: tipotraslado;
  causal: causaltraslado;
  causalDetails?: string;
  originSchool: string;
  destinationSchool: string;
  antiCoercionCertified: boolean;
  currentTrimester?: number;
}

export class politicatraslado {
  /**
   * Valida las condiciones normativas según R.M. 0001 / Ley 070 para iniciar un traslado
   */
  static afirmarpuedecreartraslado(hechos: HechosCrearTraslado): void {
    if (!hechos.studentActive) {
      throw new incumplimientoregladominio('NOT_FOUND', 'Estudiante activo no encontrado para el traslado');
    }

    if (!hechos.academicYearOpen) {
      throw new incumplimientoregladominio('VALIDATION', 'La gestión académica está cerrada; no se permiten traslados');
    }

    // Regla de Protección del Estudiante (R.M. 0001): Prohibido condicionar o forzar traslado por notas o disciplina
    if (!hechos.antiCoercionCertified) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'La R.M. 0001 prohíbe terminantemente obligar o condicionar traslados por bajo rendimiento escolar o medidas disciplinarias.',
      );
    }

    const textoCausal = (hechos.causalDetails || '').toLowerCase();
    const patronesCoaccion = [
      'mala conducta',
      'indisciplina escolar',
      'bajo rendimiento académico',
      'condicionado por notas',
      'reprobación forzada',
      'expulsión encubierta',
    ];

    if (patronesCoaccion.some((p) => textoCausal.includes(p))) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'Causal inválida por vulneración de la R.M. 0001: No se puede tramitar traslados condicionados por rendimiento o indisciplina.',
      );
    }

    // Validación de Unidad Educativa Origen vs Destino
    if (!hechos.originSchool?.trim() || !hechos.destinationSchool?.trim()) {
      throw new incumplimientoregladominio('VALIDATION', 'Debe especificar tanto la Unidad Educativa de origen como la de destino');
    }

    if (hechos.originSchool.trim().toLowerCase() === hechos.destinationSchool.trim().toLowerCase()) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'La Unidad Educativa de destino no puede ser la misma de origen para un trámite de traslado.',
      );
    }

    // Validación de Traslados Excepcionales (a mitad de trimestre o después del inicio del 2do trimestre)
    if (hechos.transferType === tipotraslado.EXCEPTIONAL) {
      const causalesValidas = [
        causaltraslado.DOMICILIO,
        causaltraslado.LABORAL,
        causaltraslado.SALUD,
        causaltraslado.ECONOMICA,
        causaltraslado.VIOLENCIA,
        causaltraslado.CAMBIO_GESTION,
        causaltraslado.OTRO,
      ];

      if (!causalesValidas.includes(hechos.causal)) {
        throw new incumplimientoregladominio(
          'VALIDATION',
          'Los traslados excepcionales requieren una causal justificada (domicilio, laboral, salud, económica o protección ante violencia).',
        );
      }

      if (!hechos.causalDetails?.trim() || hechos.causalDetails.trim().length < 5) {
        throw new incumplimientoregladominio(
          'VALIDATION',
          'Para traslados excepcionales debe incluirse el detalle circunstanciado de la justificación documental.',
        );
      }
    }
  }

  /**
   * Calcula el plazo legal de 5 días hábiles conforme a la R.M. 0001 (excluyendo sábados y domingos)
   */
  static calcularPlazoCincoDiasHabiles(fechaInicio: Date = new Date()): Date {
    const fecha = new Date(fechaInicio);
    let diasHabilesSumados = 0;

    while (diasHabilesSumados < 5) {
      fecha.setDate(fecha.getDate() + 1);
      const diaSemana = fecha.getDay(); // 0: domingo, 6: sábado
      if (diaSemana !== 0 && diaSemana !== 6) {
        diasHabilesSumados++;
      }
    }

    fecha.setHours(23, 59, 59, 999);
    return fecha;
  }

  /**
   * Calcula los días hábiles restantes hasta la fecha límite
   */
  static calcularDiasHabilesRestantes(fechaLimite: Date, fechaActual: Date = new Date()): number {
    const inicio = new Date(fechaActual);
    const fin = new Date(fechaLimite);

    if (inicio > fin) {
      let diasHabilesAtraso = 0;
      const cursor = new Date(fin);
      while (cursor < inicio) {
        cursor.setDate(cursor.getDate() + 1);
        const dia = cursor.getDay();
        if (dia !== 0 && dia !== 6) {
          diasHabilesAtraso++;
        }
      }
      return -diasHabilesAtraso;
    }

    let diasHabilesRestantes = 0;
    const cursor = new Date(inicio);
    while (cursor < fin) {
      cursor.setDate(cursor.getDate() + 1);
      const dia = cursor.getDay();
      if (dia !== 0 && dia !== 6) {
        diasHabilesRestantes++;
      }
    }

    return diasHabilesRestantes;
  }

  /**
   * Valida la transición de fases del proceso de traslado (4 fases oficiales)
   */
  static afirmarpuedeavanzarfase(faseActual: fasetraslado, siguienteFase: fasetraslado, datos?: { distritalResolution?: string }): void {
    if (siguienteFase === fasetraslado.REGISTRO_SIE || siguienteFase === fasetraslado.COMPLETADO) {
      if (!datos?.distritalResolution?.trim()) {
        throw new incumplimientoregladominio(
          'VALIDATION',
          'Para formalizar la inscripción y registro en SIE se requiere el número de Autorización de la Dirección Distrital de Educación.',
        );
      }
    }
  }
}
