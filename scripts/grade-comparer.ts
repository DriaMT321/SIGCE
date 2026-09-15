import { PrismaClient } from '@prisma/client';
import { ScrapedStudentModal } from './parse-sie-modal';

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
  sigceAverage: number;
  sieAverage: number;
}

function normalizeSubject(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchSubjectName(sieSubj: string, sigceSubjects: Array<{ id: string; name: string }>): { id: string; name: string } | null {
  const normSie = normalizeSubject(sieSubj);

  // Exact or contains match
  for (const s of sigceSubjects) {
    const normSigce = normalizeSubject(s.name);
    if (normSie === normSigce) return s;
  }

  // Domain heuristics
  if (normSie.includes('lenguaje') || normSie.includes('comunicacion')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('lenguaje') || normalizeSubject(s.name).includes('comunicacion'));
    if (found) return found;
  }
  if (normSie.includes('matematica')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('matematica'));
    if (found) return found;
  }
  if (normSie.includes('fisica') && !normSie.includes('educacion')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('fisica') && !normalizeSubject(s.name).includes('educacion'));
    if (found) return found;
  }
  if (normSie.includes('quimica')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('quimica'));
    if (found) return found;
  }
  if (normSie.includes('sociales') || normSie.includes('historia')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('sociales') || normalizeSubject(s.name).includes('historia'));
    if (found) return found;
  }
  if (normSie.includes('extranjera') || normSie.includes('ingles')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('extranjera') || normalizeSubject(s.name).includes('ingles'));
    if (found) return found;
  }
  if (normSie.includes('educacion fisica') || normSie.includes('deportes')) {
    const found = sigceSubjects.find(s => normalizeSubject(s.name).includes('educacion fisica') || normalizeSubject(s.name).includes('deportes'));
    if (found) return found;
  }

  return null;
}

export async function compareStudentGrades(
  prisma: PrismaClient,
  scraped: ScrapedStudentModal,
  academicYearNumber = 2026,
): Promise<StudentComparisonResult> {
  const rude = (scraped.rude || '').trim();
  const courseName = `${scraped.level || ''} - ${scraped.grade || ''} ${scraped.parallel || ''}`.trim();

  // Find student in SIGCE
  const student = await prisma.student.findUnique({
    where: { rude },
    include: {
      grades: {
        where: {
          period: { number: 1 },
          enrollment: { academicYear: { year: academicYearNumber } },
        },
        include: { subject: true },
      },
    },
  });

  const sigceSubjects = await prisma.subject.findMany();
  const sigceGradesMap = new Map<string, number>();

  if (student && student.grades) {
    student.grades.forEach(g => {
      sigceGradesMap.set(g.subjectId, g.value);
    });
  }

  const comparisons: SubjectGradeComparison[] = [];
  let totalMatched = 0;
  let totalDiscrepancies = 0;
  let sieSum = 0;
  let sieCount = 0;
  let sigceSum = 0;
  let sigceCount = 0;

  // Process scraped SIE grades
  const matchedSigceSubjectIds = new Set<string>();

  for (const sg of scraped.grades) {
    const matchedSubject = matchSubjectName(sg.subjectName, sigceSubjects);
    const sie1T = sg.firstTrim;

    if (sie1T !== null && sie1T !== undefined) {
      sieSum += sie1T;
      sieCount++;
    }

    if (matchedSubject) {
      matchedSigceSubjectIds.add(matchedSubject.id);
      const sigce1T = sigceGradesMap.get(matchedSubject.id);

      if (sigce1T !== undefined) {
        sigceSum += sigce1T;
        sigceCount++;

        const isCoincident = sie1T === sigce1T;
        if (isCoincident) {
          totalMatched++;
        } else {
          totalDiscrepancies++;
        }

        comparisons.push({
          sieSubject: sg.subjectName,
          sigceSubject: matchedSubject.name,
          sieGrade1T: sie1T,
          sigceGrade1T: sigce1T,
          sieGrade2T: sg.secondTrim,
          status: isCoincident ? 'COINCIDE' : 'DISCREPANCIA',
          diff: sie1T !== null && sie1T !== undefined ? sie1T - sigce1T : undefined,
        });
      } else {
        // Exists in SIE but not in SIGCE
        comparisons.push({
          sieSubject: sg.subjectName,
          sigceSubject: matchedSubject.name,
          sieGrade1T: sie1T,
          sigceGrade1T: null,
          sieGrade2T: sg.secondTrim,
          status: 'SOLO_EN_SIE',
        });
      }
    } else {
      // Area not directly mapped to a specific SIGCE secondary subject (e.g. Artes, Música, Técnica, etc.)
      comparisons.push({
        sieSubject: sg.subjectName,
        sieGrade1T: sie1T,
        sigceGrade1T: null,
        sieGrade2T: sg.secondTrim,
        status: 'SOLO_EN_SIE',
      });
    }
  }

  // Check subjects in SIGCE not in SIE
  if (student && student.grades) {
    for (const g of student.grades) {
      if (!matchedSigceSubjectIds.has(g.subjectId)) {
        sigceSum += g.value;
        sigceCount++;
        comparisons.push({
          sieSubject: '— (No presente en SIE)',
          sigceSubject: g.subject.name,
          sieGrade1T: null,
          sigceGrade1T: g.value,
          status: 'SOLO_EN_SIGCE',
        });
      }
    }
  }

  const sieAverage = sieCount > 0 ? Math.round((sieSum / sieCount) * 10) / 10 : 0;
  const sigceAverage = sigceCount > 0 ? Math.round((sigceSum / sigceCount) * 10) / 10 : 0;

  return {
    rude,
    studentName: scraped.studentName || (student ? `${student.lastName} ${student.firstName}` : ''),
    courseName,
    level: scraped.level,
    grade: scraped.grade,
    parallel: scraped.parallel,
    turn: scraped.turn,
    comparisons,
    overallMatch: totalDiscrepancies === 0 && totalMatched > 0,
    totalSubjectsMatched: totalMatched,
    totalDiscrepancies,
    sieAverage,
    sigceAverage,
  };
}
