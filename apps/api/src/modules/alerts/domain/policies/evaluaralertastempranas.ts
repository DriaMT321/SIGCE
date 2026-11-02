import {
  entradaalertatemprana,
  instantaneaadvertenciaestudiante,
} from '../repositories/alerta.repository.interface';
import { entidadreglaalerta } from '../entities/alertaregla.entity';

export function obtenerventanaalertadias(reglas: entidadreglaalerta[]): number {
  return (
    reglas.find((regla) => regla.key === 'REPEATED_ABSENCE' && regla.enabled)?.absenceWindowDays ??
    1
  );
}

export function obtenerventanaatrasosdias(reglas: entidadreglaalerta[]): number {
  return reglas.find((regla) => regla.key === 'REPEATED_LATENESS' && regla.enabled)?.absenceWindowDays ?? 1;
}

export function generaralertastempranas(
  instantanea: instantaneaadvertenciaestudiante,
  reglas: entidadreglaalerta[],
): { calificaciones: entradaalertatemprana[]; inasistencias: entradaalertatemprana[]; atrasos: entradaalertatemprana[] } {
  const calificacionregla = reglas.find((regla) => regla.key === 'LOW_GRADE' && regla.enabled);
  const ausenciaregla = reglas.find((regla) => regla.key === 'REPEATED_ABSENCE' && regla.enabled);
  const atrasoregla = reglas.find((regla) => regla.key === 'REPEATED_LATENESS' && regla.enabled);
  const destinatariosbase = [
    ...new Set([
      ...instantanea.guardianUserIds,
      ...(instantanea.administrativeUserIds ?? []),
      ...(instantanea.studentUserId ? [instantanea.studentUserId] : []),
    ]),
  ];
  const calificaciones: entradaalertatemprana[] = [];
  const inasistencias: entradaalertatemprana[] = [];
  const atrasos: entradaalertatemprana[] = [];

  if (
    calificacionregla?.gradeThreshold !== null &&
    calificacionregla?.gradeThreshold !== undefined
  ) {
    for (const calificacion of instantanea.grades) {
      if (calificacion.value >= calificacionregla.gradeThreshold) continue;
      const destinatarios = [...new Set([...destinatariosbase, ...calificacion.teacherUserIds])];
      for (const idusuario of destinatarios) {
        calificaciones.push({
          userId: idusuario,
          studentId: instantanea.studentId,
          ruleKey: 'LOW_GRADE',
          deduplicationKey: `LOW_GRADE:${calificacion.id}`,
          title: 'Calificación por debajo del mínimo',
          message: `${instantanea.studentName} obtuvo ${calificacion.value}/100 en ${calificacion.subjectName} (${calificacion.periodName}). El umbral configurado es ${calificacionregla.gradeThreshold}.`,
          severity: calificacionregla.severity,
          metadata: {
            studentId: instantanea.studentId,
            gradeId: calificacion.id,
            subjectId: calificacion.subjectId,
            periodId: calificacion.periodId,
            courseId: calificacion.courseId,
          },
        });
      }
    }
  }

  if (ausenciaregla?.absenceThreshold !== null && ausenciaregla?.absenceThreshold !== undefined) {
    const diasventana = ausenciaregla.absenceWindowDays ?? 1;
    for (const ausencia of instantanea.absences) {
      if (ausencia.count < ausenciaregla.absenceThreshold) continue;
      const destinatarios = [...new Set([...destinatariosbase, ...ausencia.teacherUserIds])];
      for (const idusuario of destinatarios) {
        inasistencias.push({
          userId: idusuario,
          studentId: instantanea.studentId,
          ruleKey: 'REPEATED_ABSENCE',
          deduplicationKey: `REPEATED_ABSENCE:${instantanea.studentId}:${ausencia.courseId}:${diasventana}`,
          title: 'Inasistencias reiteradas',
          message: `${instantanea.studentName} registra ${ausencia.count} inasistencias en ${ausencia.courseName} durante los últimos ${diasventana} días.`,
          severity: ausenciaregla.severity,
          metadata: {
            studentId: instantanea.studentId,
            courseId: ausencia.courseId,
            absenceCount: ausencia.count,
          },
        });
      }
    }
  }

  if (atrasoregla?.absenceThreshold != null) {
    const diasventana = atrasoregla.absenceWindowDays ?? 1;
    for (const atraso of instantanea.lateness ?? []) {
      if (atraso.count < atrasoregla.absenceThreshold) continue;
      const destinatarios = [...new Set([...destinatariosbase, ...atraso.teacherUserIds])];
      for (const idusuario of destinatarios) {
        atrasos.push({
          userId: idusuario,
          studentId: instantanea.studentId,
          ruleKey: 'REPEATED_LATENESS',
          deduplicationKey: `REPEATED_LATENESS:${instantanea.studentId}:${atraso.courseId}:${diasventana}`,
          title: 'Atrasos reiterados',
          message: `${instantanea.studentName} registra ${atraso.count} atrasos en ${atraso.courseName} durante los últimos ${diasventana} días.`,
          severity: atrasoregla.severity,
          metadata: { studentId: instantanea.studentId, courseId: atraso.courseId, lateCount: atraso.count },
        });
      }
    }
  }

  return { calificaciones, inasistencias, atrasos };
}
