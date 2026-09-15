import * as fs from 'fs';

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

  // Check qualitative notes (e.g. Inicial)
  const qualMatch = html.match(/<textarea[^>]*disabled=["']disabled["'][^>]*>([\s\S]*?)<\/textarea>/i);
  if (qualMatch) {
    grades.push({
      subjectName: 'INICIAL EN FAMILIA COMUNITARIA',
      qualitativeNote: qualMatch[1].trim(),
    });
  }

  // Check quantitative notes table (Primaria & Secundaria)
  // Match rows in the table
  const rowMatches = html.matchAll(/<tr>\s*<td[^>]*data-title=["']Asignatura["'][^>]*>([\s\S]*?)<\/td>([\s\S]*?)<\/tr>/gi);

  for (const rm of rowMatches) {
    const rawSubj = rm[1].replace(/<[^>]+>/g, '').trim();
    const restTd = rm[2];

    // Find nota inputs: name="nota[]" value="..."
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

// Test against report responses
if (require.main === module) {
  const data = JSON.parse(fs.readFileSync('report_2026-09-13_23-42-19.json', 'utf8'));
  const notaResponses = data.events.filter((e: any) => e.subtype === 'response' && e.details && e.details.url && e.details.url.includes('estudiante_notas') && !e.details.url.includes('updatescore'));

  console.log(`Found ${notaResponses.length} modal responses in report.`);
  [0, 1, 10].forEach(idx => {
    if (notaResponses[idx]) {
      const parsed = parseStudentNotesModal(notaResponses[idx].details.responseBody);
      console.log(`\n--- Parsed [Index ${idx}] ---`);
      console.log(JSON.stringify(parsed, null, 2));
    }
  });
}
