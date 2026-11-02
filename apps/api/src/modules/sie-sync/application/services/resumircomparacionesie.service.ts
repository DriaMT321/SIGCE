import type {
  resultadocomparacionestudiante,
  resumenauditoria,
} from '../modelos/modeloauditoriasie';

export function resumircomparacionesie(
  estudiantes: resultadocomparacionestudiante[],
  cursosauditados: number,
  auditadoen: string,
): resumenauditoria {
  const totalestudiantes = estudiantes.length;
  const totalcoincidenciasexactas = estudiantes.filter(
    (estudiante) => estudiante.overallMatch,
  ).length;
  const totalcondiscrepancias = estudiantes.filter(
    (estudiante) => estudiante.totalDiscrepancies > 0,
  ).length;
  const coincidenciaporcentaje =
    totalestudiantes > 0 ? Math.round((totalcoincidenciasexactas / totalestudiantes) * 100) : 0;
  const promediosie = estudiantes.filter((estudiante) => estudiante.sieAverage > 0);
  const promediosigce = estudiantes.filter((estudiante) => estudiante.sigceAverage > 0);
  const promedioglobalsie =
    promediosie.length > 0
      ? Math.round(
          (promediosie.reduce((total, estudiante) => total + estudiante.sieAverage, 0) /
            promediosie.length) *
            10,
        ) / 10
      : 0;
  const promedioglobalsigce =
    promediosigce.length > 0
      ? Math.round(
          (promediosigce.reduce((total, estudiante) => total + estudiante.sigceAverage, 0) /
            promediosigce.length) *
            10,
        ) / 10
      : 0;

  return {
    totalStudents: totalestudiantes,
    totalExactMatches: totalcoincidenciasexactas,
    totalWithDiscrepancies: totalcondiscrepancias,
    matchPercentage: coincidenciaporcentaje,
    sieAverage: promedioglobalsie,
    sigceAverage: promedioglobalsigce,
    auditedCoursesCount: cursosauditados,
    auditedAt: auditadoen,
  };
}
