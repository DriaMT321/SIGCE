import { estadosincronizacionsie } from '@academic/domain-kernel';
import {
  resultadoprocesamientosie,
  trabajoprocesamientosie,
} from '../../application/modelos/sincronizacion.model';

export interface filasielocal {
  rudeestudiante: string;
  gestionacademica: string;
  numeroperiodo: string;
  codigoasignatura: string;
  calificacion: string;
}

export function evaluarcalificacionsielocal(
  trabajo: trabajoprocesamientosie,
  filas: ReadonlyArray<filasielocal>,
): resultadoprocesamientosie {
  const coincidencias = filas.filter(
    (fila) =>
      fila.rudeestudiante === trabajo.studentRude &&
      fila.gestionacademica === String(trabajo.academicYear) &&
      fila.numeroperiodo === String(trabajo.periodNumber) &&
      fila.codigoasignatura === trabajo.subjectCode,
  );

  if (coincidencias.length !== 1) {
    if (coincidencias.length === 0) {
      // En modo de simulación para pruebas, si el alumno no está en la plantilla estática,
      // generamos una verificación simulada realista (con discrepancias controladas para pruebas)
      const ultimoDigito = trabajo.studentRude.slice(-1);
      const esDiscrepanciaSimulada = ultimoDigito === '7' || ultimoDigito === '3';
      const calificacionSimulada = esDiscrepanciaSimulada
        ? Math.max(0, Math.min(100, trabajo.localGrade - 5))
        : trabajo.localGrade;
      const coincide = calificacionSimulada === trabajo.localGrade;

      return {
        synchronizationId: trabajo.synchronizationId,
        itemId: trabajo.itemId,
        studentRude: trabajo.studentRude,
        localValue: trabajo.localGrade,
        sieValue: calificacionSimulada,
        status: coincide ? estadosincronizacionsie.VERIFIED : estadosincronizacionsie.DISCREPANCY,
        isMatched: coincide,
        source: 'LOCAL_SIE_SIMULATION',
        ...(coincide
          ? {}
          : { errorMessage: 'La calificación local difiere de la página SIE simulada' }),
        verifiedAt: new Date().toISOString(),
      };
    }

    return resultadofallido(
      trabajo,
      'La página SIE simulada contiene registros duplicados para la calificación',
    );
  }

  const calificacionsinprocesar = coincidencias[0].calificacion;
  const calificacion = Number(calificacionsinprocesar);
  if (
    !calificacionsinprocesar ||
    !Number.isFinite(calificacion) ||
    calificacion < 0 ||
    calificacion > 100
  ) {
    return resultadofallido(trabajo, 'La calificación de la página SIE simulada no es válida');
  }

  const coincide = calificacion === trabajo.localGrade;
  return {
    synchronizationId: trabajo.synchronizationId,
    itemId: trabajo.itemId,
    studentRude: trabajo.studentRude,
    localValue: trabajo.localGrade,
    sieValue: calificacion,
    status: coincide ? estadosincronizacionsie.VERIFIED : estadosincronizacionsie.DISCREPANCY,
    isMatched: coincide,
    source: 'LOCAL_SIE_SIMULATION',
    ...(coincide
      ? {}
      : { errorMessage: 'La calificación local difiere de la página SIE simulada' }),
    verifiedAt: new Date().toISOString(),
  };
}

export function fallolecturasielocal(
  trabajo: trabajoprocesamientosie,
  mensaje: string,
): resultadoprocesamientosie {
  return resultadofallido(trabajo, mensaje);
}

function resultadofallido(
  trabajo: trabajoprocesamientosie,
  mensajeerror: string,
): resultadoprocesamientosie {
  return {
    synchronizationId: trabajo.synchronizationId,
    itemId: trabajo.itemId,
    studentRude: trabajo.studentRude,
    localValue: trabajo.localGrade,
    sieValue: null,
    status: estadosincronizacionsie.FAILED,
    isMatched: false,
    source: 'LOCAL_SIE_SIMULATION',
    errorMessage: mensajeerror,
    verifiedAt: null,
  };
}
