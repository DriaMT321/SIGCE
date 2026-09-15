import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../common/database/prisma.service';
import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  parseStudentNotesModal,
  matchSubjectName,
  StudentComparisonResult,
  SubjectGradeComparison,
} from '../services/sie-grade-parser.service';

export interface AuditSummary {
  totalStudents: number;
  totalExactMatches: number;
  totalWithDiscrepancies: number;
  matchPercentage: number;
  sieAverage: number;
  sigceAverage: number;
  auditedCoursesCount: number;
  auditedAt: string;
}

export interface AuditExecutionOptions {
  courseFilter?: string;
  maxCourses?: number;
  username?: string;
  password?: string;
  visualMode?: boolean;
}

@Injectable()
export class AuditSieGradesUseCase {
  private readonly logger = new Logger(AuditSieGradesUseCase.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private getExecutablePath(): string | undefined {
    const candidates = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return undefined;
  }

  private getScratchDir(): string {
    const candidates = [
      path.resolve(process.cwd(), '../../scratch'),
      path.resolve(process.cwd(), 'scratch'),
      path.resolve(__dirname, '../../../../../../../scratch'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
    const defaultP = path.resolve(process.cwd(), '../../scratch');
    if (!fs.existsSync(defaultP)) fs.mkdirSync(defaultP, { recursive: true });
    return defaultP;
  }

  async getLatestAudit(): Promise<{
    hasData: boolean;
    summary: AuditSummary | null;
    students: StudentComparisonResult[];
    auditedAt?: string;
    reportFile?: string;
  }> {
    const scratchDir = this.getScratchDir();
    const files = fs
      .readdirSync(scratchDir)
      .filter((f) => f.startsWith('auditoria_calificaciones_') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return { hasData: false, summary: null, students: [] };
    }

    const latestFile = path.join(scratchDir, files[0]);
    try {
      const raw = fs.readFileSync(latestFile, 'utf8');
      const students: StudentComparisonResult[] = JSON.parse(raw);

      const totalStudents = students.length;
      const totalExactMatches = students.filter((s) => s.overallMatch).length;
      const totalWithDiscrepancies = students.filter((s) => s.totalDiscrepancies > 0).length;
      const matchPercentage = totalStudents > 0 ? Math.round((totalExactMatches / totalStudents) * 100) : 0;

      const sieAvgs = students.filter((s) => s.sieAverage > 0).map((s) => s.sieAverage);
      const sigceAvgs = students.filter((s) => s.sigceAverage > 0).map((s) => s.sigceAverage);

      const globalSieAvg = sieAvgs.length > 0 ? Math.round((sieAvgs.reduce((a, b) => a + b, 0) / sieAvgs.length) * 10) / 10 : 0;
      const globalSigceAvg = sigceAvgs.length > 0 ? Math.round((sigceAvgs.reduce((a, b) => a + b, 0) / sigceAvgs.length) * 10) / 10 : 0;

      const uniqueCourses = new Set(students.map((s) => s.courseName)).size;
      const fileStat = fs.statSync(latestFile);

      return {
        hasData: true,
        summary: {
          totalStudents,
          totalExactMatches,
          totalWithDiscrepancies,
          matchPercentage,
          sieAverage: globalSieAvg,
          sigceAverage: globalSigceAvg,
          auditedCoursesCount: uniqueCourses,
          auditedAt: fileStat.mtime.toISOString(),
        },
        students,
        auditedAt: fileStat.mtime.toISOString(),
        reportFile: files[0],
      };
    } catch (e) {
      this.logger.error(`Error al leer archivo de auditoría ${latestFile}:`, e);
      return { hasData: false, summary: null, students: [] };
    }
  }

  async executeAudit(options?: AuditExecutionOptions): Promise<{
    summary: AuditSummary;
    students: StudentComparisonResult[];
    message: string;
  }> {
    const sieUrl =
      this.configService.get<string>('sie.baseUrl') ||
      process.env.SIE_BASE_URL ||
      'https://academico.sie.gob.bo';

    const username =
      options?.username?.trim() ||
      this.configService.get<string>('sie.username') ||
      process.env.SIE_USERNAME ||
      '2967609';
    const password =
      options?.password?.trim() ||
      this.configService.get<string>('sie.password') ||
      process.env.SIE_PASSWORD ||
      'Olaa@mar123*';

    const visualMode = options?.visualMode === true;
    const maxCourses = options?.maxCourses || 4;
    const courseFilter = options?.courseFilter?.trim() || '';

    this.logger.log(
      `Iniciando auditoría de solo lectura en SIE: ${sieUrl} (Filtro: "${courseFilter}", Máx: ${maxCourses}, Visual: ${visualMode})`,
    );

    const executablePath = this.getExecutablePath();
    const browser = await puppeteer.launch({
      headless: !visualMode,
      executablePath,
      args: [
        '--window-size=960,1040',
        '--window-position=960,0',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const allStudentComparisons: StudentComparisonResult[] = [];

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      // 1. Login
      await page.goto(sieUrl, { waitUntil: 'networkidle2', timeout: 40000 });
      await page.waitForSelector('#username', { timeout: 15000 });
      await page.type('#username', username, { delay: 20 });
      await page.type('#password', password, { delay: 20 });

      const checkbox = await page.$('input[type="checkbox"]');
      if (checkbox) {
        const isChecked = await (await checkbox.getProperty('checked')).jsonValue();
        if (!isChecked) await checkbox.click();
      }

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {}),
        page.click('.btn-aceptar'),
      ]);

      // 2. Navegación /acceso/principal/ -> /sie/inbox/ -> /sie/inbox/sie/open -> /sie/infoEstudiante/
      await page.goto('https://academico.sie.gob.bo/sie/inbox/', { waitUntil: 'networkidle2', timeout: 35000 });

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {}),
        page.evaluate(() => {
          const btn = document.querySelector('#form_goplena') as HTMLElement;
          if (btn) btn.click();
          else {
            const form = document.querySelector('form[action*="/sie/inbox/sie/open"]') as HTMLFormElement;
            if (form) form.submit();
          }
        }),
      ]);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {}),
        page.evaluate(() => {
          const formEst = document.querySelector('form[action*="/sie/infoEstudiante/"]') as HTMLFormElement;
          if (formEst) formEst.submit();
          else {
            const btn = Array.from(document.querySelectorAll('button, a')).find((el) =>
              (el.textContent || '').toLowerCase().includes('estudiante'),
            ) as HTMLElement;
            if (btn) btn.click();
          }
        }),
      ]);

      // 3. Obtener lista de cursos
      const coursesTree = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[onclick*="seeStudents"]'));
        return links
          .map((a) => {
            const onclick = a.getAttribute('onclick') || '';
            const match = onclick.match(/seeStudents\('(.*?)'\)/);
            const infoUe = match ? match[1] : '';
            const nivelMatch = infoUe.match(/nivel";s:\d+:"([^"]+)"/);
            const gradoMatch = infoUe.match(/grado";s:\d+:"([^"]+)"/);
            const paraleloMatch = infoUe.match(/paralelo";s:\d+:"([^"]+)"/);
            const fullCourse = [
              nivelMatch ? nivelMatch[1] : '',
              gradoMatch ? gradoMatch[1] : '',
              paraleloMatch ? paraleloMatch[1] : '',
            ]
              .filter(Boolean)
              .join(' - ');

            return {
              text: fullCourse || (a.textContent || '').trim().replace(/\s+/g, ' '),
              infoUe,
            };
          })
          .filter((c) => c.infoUe.length > 0);
      });

      let coursesToAudit = coursesTree;
      if (courseFilter) {
        const q = courseFilter.toLowerCase();
        coursesToAudit = coursesTree.filter((c) => c.text.toLowerCase().includes(q));
      }
      coursesToAudit = coursesToAudit.slice(0, maxCourses);

      const sigceSubjects = await this.prisma.subject.findMany();

      // 4. Procesar cursos
      for (const courseItem of coursesToAudit) {
        await page.evaluate((infoUe) => {
          if (typeof (window as any).seeStudents === 'function') {
            (window as any).seeStudents(infoUe);
          }
        }, courseItem.infoUe);

        await page
          .waitForFunction(
            () => {
              const t = document.querySelector('#idstudents table');
              return t && t.querySelectorAll('tbody tr').length > 0;
            },
            { timeout: 15000 },
          )
          .catch(() => {});

        const studentsInCourse = await page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll('#idstudents table tbody tr'));
          return rows
            .map((r) => {
              const cells = Array.from(r.querySelectorAll('td')).map((td) => td.innerText.trim());
              const btn = r.querySelector(
                '[onclick*="changeMatricula"], [onclick*="infoStudent"], [onclick*="infoUe"]',
              );
              let infoUe = '';
              let infoStudent = '';

              if (btn) {
                const onclickStr = btn.getAttribute('onclick') || '';
                const match = onclickStr.match(/'(a:3:[^']+)'\s*,\s*'({[^']+})'/);
                if (match) {
                  infoUe = match[1];
                  infoStudent = match[2];
                }
              }

              return {
                rude: cells[1] || '',
                infoUe,
                infoStudent,
              };
            })
            .filter((s) => s.rude.length > 0);
        });

        for (const st of studentsInCourse) {
          if (!st.infoUe || !st.infoStudent) continue;

          try {
            // PURE READ-ONLY POST al modal
            const modalHtml = await page.evaluate(async (infoUe, infoStudent) => {
              const resp = await fetch('/sie/infoEstudiante/sie/estudiante_notas/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({ infoUe, infoStudent }).toString(),
              });
              return await resp.text();
            }, st.infoUe, st.infoStudent);

            const scraped = parseStudentNotesModal(modalHtml);
            const rude = scraped.rude.trim();

            // Buscar estudiante en PostgreSQL
            const student = await this.prisma.student.findUnique({
              where: { rude },
              include: {
                grades: {
                  where: { period: { number: 1 }, enrollment: { academicYear: { year: 2026 } } },
                  include: { subject: true },
                },
              },
            });

            const sigceGradesMap = new Map<string, number>();
            if (student?.grades) {
              student.grades.forEach((g) => sigceGradesMap.set(g.subjectId, g.value));
            }

            const comparisons: SubjectGradeComparison[] = [];
            let totalMatched = 0;
            let totalDiscrepancies = 0;
            let sieSum = 0;
            let sieCount = 0;
            let sigceSum = 0;
            let sigceCount = 0;
            const matchedSubjectIds = new Set<string>();

            for (const sg of scraped.grades) {
              const matchedSub = matchSubjectName(sg.subjectName, sigceSubjects);
              const sie1T = sg.firstTrim;

              if (sie1T !== null && sie1T !== undefined) {
                sieSum += sie1T;
                sieCount++;
              }

              if (matchedSub) {
                matchedSubjectIds.add(matchedSub.id);
                const sigce1T = sigceGradesMap.get(matchedSub.id);

                if (sigce1T !== undefined) {
                  sigceSum += sigce1T;
                  sigceCount++;

                  const isCoincident = sie1T === sigce1T;
                  if (isCoincident) totalMatched++;
                  else totalDiscrepancies++;

                  comparisons.push({
                    sieSubject: sg.subjectName,
                    sigceSubject: matchedSub.name,
                    sieGrade1T: sie1T,
                    sigceGrade1T: sigce1T,
                    sieGrade2T: sg.secondTrim,
                    status: isCoincident ? 'COINCIDE' : 'DISCREPANCIA',
                    diff: sie1T !== null && sie1T !== undefined ? sie1T - sigce1T : undefined,
                  });
                } else {
                  comparisons.push({
                    sieSubject: sg.subjectName,
                    sigceSubject: matchedSub.name,
                    sieGrade1T: sie1T,
                    sigceGrade1T: null,
                    sieGrade2T: sg.secondTrim,
                    status: 'SOLO_EN_SIE',
                  });
                }
              } else {
                comparisons.push({
                  sieSubject: sg.subjectName,
                  sieGrade1T: sie1T,
                  sigceGrade1T: null,
                  sieGrade2T: sg.secondTrim,
                  status: 'SOLO_EN_SIE',
                });
              }
            }

            if (student?.grades) {
              for (const g of student.grades) {
                if (!matchedSubjectIds.has(g.subjectId)) {
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

            allStudentComparisons.push({
              rude,
              studentName: scraped.studentName || (student ? `${student.lastName} ${student.firstName}` : ''),
              courseName: `${scraped.level || ''} - ${scraped.grade || ''} ${scraped.parallel || ''}`.trim(),
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
            });
          } catch (stErr) {
            this.logger.warn(`Error al consultar notas para RUDE ${st.rude}:`, stErr);
          }
        }
      }

      // 5. Guardar en scratch/
      const scratchDir = this.getScratchDir();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const jsonPath = path.join(scratchDir, `auditoria_calificaciones_${timestamp}.json`);
      const mdPath = path.join(scratchDir, `auditoria_calificaciones_${timestamp}.md`);

      fs.writeFileSync(jsonPath, JSON.stringify(allStudentComparisons, null, 2), 'utf8');

      // Calcular sumario
      const totalStudents = allStudentComparisons.length;
      const totalExactMatches = allStudentComparisons.filter((c) => c.overallMatch).length;
      const totalWithDiscrepancies = allStudentComparisons.filter((c) => c.totalDiscrepancies > 0).length;
      const matchPercentage = totalStudents > 0 ? Math.round((totalExactMatches / totalStudents) * 100) : 0;

      const sieAvgs = allStudentComparisons.filter((s) => s.sieAverage > 0).map((s) => s.sieAverage);
      const sigceAvgs = allStudentComparisons.filter((s) => s.sigceAverage > 0).map((s) => s.sigceAverage);

      const globalSieAvg = sieAvgs.length > 0 ? Math.round((sieAvgs.reduce((a, b) => a + b, 0) / sieAvgs.length) * 10) / 10 : 0;
      const globalSigceAvg = sigceAvgs.length > 0 ? Math.round((sigceAvgs.reduce((a, b) => a + b, 0) / sigceAvgs.length) * 10) / 10 : 0;

      const summary: AuditSummary = {
        totalStudents,
        totalExactMatches,
        totalWithDiscrepancies,
        matchPercentage,
        sieAverage: globalSieAvg,
        sigceAverage: globalSigceAvg,
        auditedCoursesCount: coursesToAudit.length,
        auditedAt: new Date().toISOString(),
      };

      // Guardar Markdown
      let md = `# Reporte de Auditoría de Calificaciones: SIE vs SIGCE\n\n`;
      md += `**Fecha**: ${new Date().toLocaleString()}\n`;
      md += `**Total Alumnos Auditados**: ${totalStudents}\n`;
      md += `**Coincidencias Exactas**: ${totalExactMatches} (${matchPercentage}%)\n`;
      md += `**Con Discrepancias**: ${totalWithDiscrepancies}\n\n`;
      md += `> [!NOTE]\n> Auditoría en modo solo lectura. Ninguna nota fue modificada en el SIE ni en SIGCE.\n\n`;

      md += `| RUDE | Estudiante | Curso | Promedio SIE | Promedio SIGCE | Discrepancias | Estado |\n`;
      md += `|---|---|---|---|---|---|---|\n`;
      for (const c of allStudentComparisons) {
        const st = c.overallMatch ? 'COINCIDE' : c.totalDiscrepancies > 0 ? `DISCREPANCIA (${c.totalDiscrepancies})` : 'SOLO_SIE';
        md += `| ${c.rude} | ${c.studentName} | ${c.courseName} | ${c.sieAverage} pts | ${c.sigceAverage} pts | ${c.totalDiscrepancies} | ${st} |\n`;
      }
      fs.writeFileSync(mdPath, md, 'utf8');

      return {
        summary,
        students: allStudentComparisons,
        message: `Auditoría completada exitosamente para ${totalStudents} estudiantes en ${coursesToAudit.length} cursos.`,
      };
    } finally {
      await browser.close().catch(() => {});
    }
  }
}
