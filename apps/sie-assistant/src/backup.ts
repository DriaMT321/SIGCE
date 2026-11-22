import type { GradePlan, SigceGrade } from './types';

export interface GradeBackup {
  id: string;
  createdAt: string;
  timestampFormatted: string;
  courseId: string;
  courseName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  periodNumber: number;
  periodName: string;
  fingerprint: string;
  totalStudents: number;
  isSeniorYear: boolean;
  userResponsible: string;
  grades: SigceGrade[];
  source: 'SIGCE_PLAN' | 'SIE_CAPTURED' | 'DEMO';
  status: 'SAVED' | 'IN_PROGRESS' | 'COMPLETED';
}

const STORAGE_KEY = 'sigceGradeBackups';
const MAX_STORED_BACKUPS = 30;

/**
 * Detecta si el curso corresponde a 6to de Secundaria (Bachillerato en Bolivia).
 * Ejemplos: "6º de Secundaria A", "6to de Secundaria B", "Secundaria - Sexto A", "6° Secundaria".
 * No coincide con "6º de Primaria" ni con otros grados.
 */
export function is6toSecundaria(courseName: string): boolean {
  if (!courseName) return false;
  const norm = courseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const isSecundaria = norm.includes('secundaria') || norm.includes('sec');
  const isSexto =
    norm.includes('sexto') ||
    norm.includes('6to') ||
    norm.includes('6 to') ||
    norm.includes('6º') ||
    norm.includes('6°') ||
    /\b6\s*(?:to|º|°|ero|ta)?\b/i.test(norm) ||
    norm.includes('bachiller');

  return isSecundaria && isSexto;
}

/**
 * Genera una copia de seguridad estructurada a partir de un lote de calificaciones (GradePlan).
 */
export function createGradeBackupFromPlan(
  plan: GradePlan,
  userResponsible?: string,
  source: 'SIGCE_PLAN' | 'SIE_CAPTURED' | 'DEMO' = 'SIGCE_PLAN',
): GradeBackup {
  const now = new Date();
  const isSenior = is6toSecundaria(plan.course.name);
  const dateStr = now.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const timeStr = now.toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return {
    id: `backup_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now.toISOString(),
    timestampFormatted: `${dateStr} ${timeStr}`,
    courseId: plan.course.id,
    courseName: plan.course.name,
    subjectId: plan.subject.id,
    subjectName: plan.subject.name,
    subjectCode: plan.subject.code,
    periodNumber: plan.period.number,
    periodName: plan.period.name,
    fingerprint: plan.fingerprint,
    totalStudents: plan.grades.length,
    isSeniorYear: isSenior,
    userResponsible: userResponsible || 'Personal Administrativo / Secretaría',
    grades: plan.grades.map((g) => ({ ...g })),
    source,
    status: 'SAVED',
  };
}

/**
 * Guarda una copia de seguridad en chrome.storage.local con desduplicación.
 */
export async function saveGradeBackup(backup: GradeBackup): Promise<void> {
  try {
    const existing = await listGradeBackups();
    const filtered = existing.filter(
      (b) =>
        !(
          b.courseId === backup.courseId &&
          b.subjectId === backup.subjectId &&
          b.periodNumber === backup.periodNumber &&
          b.fingerprint === backup.fingerprint
        ),
    );
    const updated = [backup, ...filtered].slice(0, MAX_STORED_BACKUPS);
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      await chrome.storage.local.set({ [STORAGE_KEY]: updated });
    }
  } catch (err) {
    console.error('Error guardando copia de seguridad local:', err);
  }
}

/**
 * Obtiene todas las copias de seguridad locales guardadas en este navegador.
 */
export async function listGradeBackups(): Promise<GradeBackup[]> {
  try {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const list = result[STORAGE_KEY];
      if (Array.isArray(list)) return list as GradeBackup[];
    }
  } catch (err) {
    console.error('Error listando copias de seguridad locales:', err);
  }
  return [];
}

/**
 * Elimina una copia de seguridad local por su ID.
 */
export async function deleteGradeBackup(id: string): Promise<GradeBackup[]> {
  const current = await listGradeBackups();
  const updated = current.filter((b) => b.id !== id);
  if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
    await chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }
  return updated;
}

/**
 * Construye el contenido JSON formateado de la copia de seguridad.
 */
export function buildBackupJson(backup: GradeBackup): string {
  const exportData = {
    titulo: 'COPIA DE SEGURIDAD PREVENTIVA DE CALIFICACIONES - SIGCE',
    finalidad: 'Medida preventiva obligatoria antes de interactuar con el portal SIE',
    institucion: 'Unidad Educativa Comunidad Cristiana B',
    generadoEn: backup.createdAt,
    fechaFormateada: backup.timestampFormatted,
    gestion: 2026,
    curso: {
      id: backup.courseId,
      nombre: backup.courseName,
      es6toSecundariaBachillerato: backup.isSeniorYear,
    },
    materia: {
      id: backup.subjectId,
      nombre: backup.subjectName,
      codigo: backup.subjectCode,
    },
    periodo: {
      numero: backup.periodNumber,
      nombre: backup.periodName,
    },
    huellaIntegridadSIGCE: backup.fingerprint,
    responsable: backup.userResponsible,
    origen: backup.source,
    totalEstudiantes: backup.totalStudents,
    estudiantesCalificaciones: backup.grades.map((grade, idx) => ({
      nro: idx + 1,
      gradeId: grade.gradeId,
      studentId: grade.studentId,
      rude: grade.rude,
      apellidos: grade.lastName,
      nombres: grade.firstName,
      calificacion: grade.value,
      estado: grade.value >= 51 ? 'APROBADO' : 'EN DESARROLLO',
    })),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Construye el contenido CSV para Microsoft Excel con delimitador ';' y BOM UTF-8.
 */
export function buildBackupCsv(backup: GradeBackup): string {
  const lines: string[] = [];
  lines.push('COPIA DE SEGURIDAD PREVENTIVA DE CALIFICACIONES - SISTEMA SIGCE');
  lines.push('Medida Preventiva:;Resguardo automático de notas previo a actuar en el portal ministerial SIE');
  lines.push(`Institución:;Unidad Educativa Comunidad Cristiana B`);
  lines.push(`Curso:;${backup.courseName}${backup.isSeniorYear ? ' (6to de Secundaria - Bachillerato)' : ''}`);
  lines.push(`Materia:;${backup.subjectName} (${backup.subjectCode})`);
  lines.push(`Trimestre:;${backup.periodName}`);
  lines.push(`Fecha de Respaldo:;${backup.timestampFormatted}`);
  lines.push(`Huella de Integridad SIGCE:;${backup.fingerprint}`);
  lines.push(`Responsable:;${backup.userResponsible || 'Personal Administrativo'}`);
  lines.push(`Total de Estudiantes:;${backup.totalStudents}`);
  lines.push('');
  lines.push('Nro;Código RUDE;Apellidos;Nombres;Materia;Trimestre;Calificación;Estado;Huella SIGCE');

  backup.grades.forEach((g, idx) => {
    const estado = g.value >= 51 ? 'Aprobado' : 'En Desarrollo';
    const safeLast = `"${g.lastName.replace(/"/g, '""')}"`;
    const safeFirst = `"${g.firstName.replace(/"/g, '""')}"`;
    lines.push(
      `${idx + 1};${g.rude};${safeLast};${safeFirst};"${backup.subjectName}";${backup.periodNumber};${g.value};${estado};${backup.fingerprint}`,
    );
  });

  // Prefijo BOM UTF-8 para apertura correcta en Microsoft Excel
  return '\uFEFF' + lines.join('\r\n');
}

/**
 * Descarga la copia de seguridad en formato JSON.
 */
export function downloadBackupJson(backup: GradeBackup): void {
  const json = buildBackupJson(backup);
  const safeCourse = backup.courseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeSubject = backup.subjectCode || backup.subjectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `copia_seguridad_preventiva_${safeCourse}_${safeSubject}_T${backup.periodNumber}_${Date.now()}.json`;
  triggerFileDownload(json, filename, 'application/json;charset=utf-8');
}

/**
 * Descarga la copia de seguridad en formato CSV para Excel.
 */
export function downloadBackupCsv(backup: GradeBackup): void {
  const csv = buildBackupCsv(backup);
  const safeCourse = backup.courseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeSubject = backup.subjectCode || backup.subjectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `copia_seguridad_preventiva_${safeCourse}_${safeSubject}_T${backup.periodNumber}_${Date.now()}.csv`;
  triggerFileDownload(csv, filename, 'text/csv;charset=utf-8');
}

/**
 * Dispara la descarga del archivo en el navegador.
 */
function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Reconstruye un GradePlan activo a partir de una copia de seguridad para restaurarlo.
 */
export function restorePlanFromBackup(backup: GradeBackup): GradePlan {
  return {
    course: { id: backup.courseId, name: backup.courseName },
    subject: { id: backup.subjectId, name: backup.subjectName, code: backup.subjectCode },
    period: { number: backup.periodNumber, name: backup.periodName },
    grades: backup.grades.map((g) => ({ ...g })),
    fingerprint: backup.fingerprint,
  };
}
