export interface ScrapedSubjectGrade {
  subjectName: string;
  firstTrim?: number | null;
  secondTrim?: number | null;
  thirdTrim?: number | null;
  qualitativeNote?: string | null;
}

export interface ScrapedStudentModal {
  rude: string;
  studentName: string;
  courseName?: string;
  level?: string;
  grade?: string;
  parallel?: string;
  turn?: string;
  grades: ScrapedSubjectGrade[];
}

export interface SubjectGradeComparison {
  sieSubject: string;
  sigceSubject?: string;
  sieGrade1T?: number | null;
  sigceGrade1T?: number | null;
  sieGrade2T?: number | null;
  status: 'COINCIDE' | 'DISCREPANCIA' | 'SOLO_EN_SIE' | 'SOLO_EN_SIGCE';
  diff?: number;
}

export interface StudentComparisonResult {
  rude: string;
  studentName: string;
  courseName: string;
  level?: string;
  grade?: string;
  parallel?: string;
  turn?: string;
  comparisons: SubjectGradeComparison[];
  overallMatch: boolean;
  totalSubjectsMatched: number;
  totalDiscrepancies: number;
  sieAverage: number;
  sigceAverage: number;
}

export function parseStudentNotesModal(html: string): ScrapedStudentModal {
  const rudeMatch = html.match(/<th>Codigo Rude<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const rude = rudeMatch ? rudeMatch[1].trim() : '';

  const nameMatch = html.match(/<th>Estudiante<\/th>\s*<td[^>]*>(?:<b>)?([^<]+)(?:<\/b>)?<\/td>/i);
  const studentName = nameMatch ? nameMatch[1].trim() : '';

  const levelMatch = html.match(/<th>Nivel<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const level = levelMatch ? levelMatch[1].trim() : '';

  const gradeMatch = html.match(/<th>Grado<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const grade = gradeMatch ? gradeMatch[1].trim() : '';

  const parallelMatch = html.match(/<th>Paralelo<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const parallel = parallelMatch ? parallelMatch[1].trim() : '';

  const turnMatch = html.match(/<th>Turno<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const turn = turnMatch ? turnMatch[1].trim() : '';

  const grades: ScrapedSubjectGrade[] = [];

  // Notas cualitativas (Nivel Inicial)
  const qualMatch = html.match(/<textarea[^>]*disabled=["']disabled["'][^>]*>([\s\S]*?)<\/textarea>/i);
  if (qualMatch) {
    grades.push({
      subjectName: 'INICIAL EN FAMILIA COMUNITARIA',
      qualitativeNote: qualMatch[1].trim(),
    });
  }

  // Notas cuantitativas (Primaria y Secundaria)
  const rowMatches = html.matchAll(/<tr>\s*<td[^>]*data-title=["']Asignatura["'][^>]*>([\s\S]*?)<\/td>([\s\S]*?)<\/tr>/gi);

  for (const rm of rowMatches) {
    const rawSubj = rm[1].replace(/<[^>]+>/g, '').trim();
    const restTd = rm[2];

    const inputMatches = Array.from(restTd.matchAll(/<input[^>]*name=["']nota\[\]["'][^>]*value=["']?([^"'>]*)["']?[^>]*>/gi));

    const firstTrimVal = inputMatches[0] && inputMatches[0][1] !== '' ? parseInt(inputMatches[0][1], 10) : null;
    const secondTrimVal = inputMatches[1] && inputMatches[1][1] !== '' ? parseInt(inputMatches[1][1], 10) : null;
    const thirdTrimVal = inputMatches[2] && inputMatches[2][2] !== '' ? parseInt(inputMatches[2][1], 10) : null;

    if (rawSubj.length > 0) {
      grades.push({
        subjectName: rawSubj,
        firstTrim: isNaN(firstTrimVal as number) ? null : firstTrimVal,
        secondTrim: isNaN(secondTrimVal as number) ? null : secondTrimVal,
        thirdTrim: isNaN(thirdTrimVal as number) ? null : thirdTrimVal,
      });
    }
  }

  return {
    rude,
    studentName,
    level,
    grade,
    parallel,
    turn,
    grades,
  };
}

function normalizeSubject(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchSubjectName(
  sieSubj: string,
  sigceSubjects: Array<{ id: string; name: string }>,
): { id: string; name: string } | null {
  const normSie = normalizeSubject(sieSubj);

  for (const s of sigceSubjects) {
    const normSigce = normalizeSubject(s.name);
    if (normSie === normSigce) return s;
  }

  if (normSie.includes('lenguaje') || normSie.includes('comunicacion')) {
    const found = sigceSubjects.find(
      (s) => normalizeSubject(s.name).includes('lenguaje') || normalizeSubject(s.name).includes('comunicacion'),
    );
    if (found) return found;
  }
  if (normSie.includes('matematica')) {
    const found = sigceSubjects.find((s) => normalizeSubject(s.name).includes('matematica'));
    if (found) return found;
  }
  if (normSie.includes('fisica') && !normSie.includes('educacion')) {
    const found = sigceSubjects.find(
      (s) => normalizeSubject(s.name).includes('fisica') && !normalizeSubject(s.name).includes('educacion'),
    );
    if (found) return found;
  }
  if (normSie.includes('quimica')) {
    const found = sigceSubjects.find((s) => normalizeSubject(s.name).includes('quimica'));
    if (found) return found;
  }
  if (normSie.includes('sociales') || normSie.includes('historia')) {
    const found = sigceSubjects.find(
      (s) => normalizeSubject(s.name).includes('sociales') || normalizeSubject(s.name).includes('historia'),
    );
    if (found) return found;
  }
  if (normSie.includes('extranjera') || normSie.includes('ingles')) {
    const found = sigceSubjects.find(
      (s) => normalizeSubject(s.name).includes('extranjera') || normalizeSubject(s.name).includes('ingles'),
    );
    if (found) return found;
  }
  if (normSie.includes('educacion fisica') || normSie.includes('deportes')) {
    const found = sigceSubjects.find(
      (s) => normalizeSubject(s.name).includes('educacion fisica') || normalizeSubject(s.name).includes('deportes'),
    );
    if (found) return found;
  }

  return null;
}
