import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseStudentNotesModal } from './parse-sie-modal';
import { compareStudentGrades, StudentComparisonResult } from './grade-comparer';

dotenv.config();

const prisma = new PrismaClient();

function getExecutablePath(): string | undefined {
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

export async function runGradeComparison(maxCourses = 5) {
  console.log('========================================================================');
  console.log('  AUDITORÍA DE CALIFICACIONES: SCRAPING SIE VS BASE DE DATOS SIGCE');
  console.log('  MODO ESTRICTO: SOLO LECTURA (PROHIBIDO MODIFICAR NOTAS)');
  console.log('========================================================================\n');

  const username = process.env.SIE_USERNAME || '';
  const password = process.env.SIE_PASSWORD || '';
  const sieUrl = process.env.SIE_BASE_URL || 'https://academico.sie.gob.bo';

  const executablePath = getExecutablePath();
  const browser = await puppeteer.launch({
    headless: true, // Modo headless para auditoría rápida o diagnóstico
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allStudentComparisons: StudentComparisonResult[] = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    console.log('[1/5] Iniciando sesión en el portal SIE...');
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
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.click('.btn-aceptar'),
    ]);

    console.log('  -> Autenticado correctamente.');

    console.log('[2/5] Navegando automáticamente hacia el módulo de Estudiantes...');
    // Ir a /sie/inbox/
    await page.goto('https://academico.sie.gob.bo/sie/inbox/', { waitUntil: 'networkidle2', timeout: 35000 });

    // Enviar U.E. Regular (#form_goplena)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.evaluate(() => {
        const btn = document.querySelector('#form_goplena') as HTMLElement;
        if (btn) btn.click();
        else {
          const form = document.querySelector('form[action*="/sie/inbox/sie/open"]') as HTMLFormElement;
          if (form) form.submit();
        }
      }),
    ]);

    // Enviar formulario Estudiantes
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.evaluate(() => {
        const formEst = document.querySelector('form[action*="/sie/infoEstudiante/"]') as HTMLFormElement;
        if (formEst) formEst.submit();
        else {
          const btn = Array.from(document.querySelectorAll('button, a')).find((el) =>
            (el.textContent || '').toLowerCase().includes('estudiante')
          ) as HTMLElement;
          if (btn) btn.click();
        }
      }),
    ]);

    console.log('  -> Acceso confirmado a Gestión 2026:', page.url());

    console.log('[3/5] Identificando cursos en el árbol académico...');
    const coursesTree = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[onclick*="seeStudents"]'));
      return links.map((a) => {
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
        ].filter(Boolean).join(' - ');

        return {
          text: fullCourse || (a.textContent || '').trim().replace(/\s+/g, ' '),
          infoUe,
        };
      }).filter((c) => c.infoUe.length > 0);
    });

    console.log(`  -> Encontrados ${coursesTree.length} cursos disponibles en el SIE.`);
    const filterArg = process.argv[2] || '';
    let coursesToAudit = coursesTree;

    if (filterArg && isNaN(Number(filterArg))) {
      const query = filterArg.toLowerCase();
      coursesToAudit = coursesTree.filter((c) => c.text.toLowerCase().includes(query));
      console.log(`  -> Filtrando cursos con término "${filterArg}": ${coursesToAudit.length} coincidencias.`);
    } else {
      const maxCount = Number(filterArg) || maxCourses;
      coursesToAudit = coursesTree.slice(0, maxCount);
    }

    console.log(`[4/5] Escrapeando calificaciones de estudiantes (procesando ${coursesToAudit.length} cursos)...`);

    for (let cIdx = 0; cIdx < coursesToAudit.length; cIdx++) {
      const courseItem = coursesToAudit[cIdx];
      console.log(`\n  -------------------------------------------------------------`);
      console.log(`  [Curso ${cIdx + 1}/${coursesToAudit.length}] "${courseItem.text}"`);
      console.log(`  -------------------------------------------------------------`);

      // Cargar lista de alumnos del curso
      await page.evaluate((infoUe) => {
        if (typeof (window as any).seeStudents === 'function') {
          (window as any).seeStudents(infoUe);
        }
      }, courseItem.infoUe);

      // Esperar a que la tabla se actualice
      await page.waitForFunction(
        () => {
          const t = document.querySelector('#idstudents table');
          return t && t.querySelectorAll('tbody tr').length > 0;
        },
        { timeout: 15000 }
      ).catch(() => {});

      // Extraer datos de alumnos y parámetros de notas
      const studentsInCourse = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#idstudents table tbody tr'));
        return rows.map((r) => {
          const cells = Array.from(r.querySelectorAll('td')).map((td) => td.innerText.trim());
          const btn = r.querySelector('[onclick*="changeMatricula"], [onclick*="infoStudent"], [onclick*="infoUe"]');
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
            rowNum: cells[0] || '',
            rude: cells[1] || '',
            ci: cells[2] || '',
            nombre: `${cells[3] || ''} ${cells[4] || ''} ${cells[5] || ''}`.trim(),
            infoUe,
            infoStudent,
          };
        }).filter((s) => s.rude.length > 0);
      });

      console.log(`  -> Alumnos inscritos en el curso: ${studentsInCourse.length}`);

      for (const st of studentsInCourse) {
        if (!st.infoUe || !st.infoStudent) continue;

        try {
          // Petición PURE READ-ONLY para consultar modal de notas
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

          // Parsear y comparar
          const scraped = parseStudentNotesModal(modalHtml);
          const comp = await compareStudentGrades(prisma, scraped);
          allStudentComparisons.push(comp);

          const statusIcon = comp.overallMatch ? '✓' : comp.totalDiscrepancies > 0 ? '⚠️' : 'ℹ️';
          console.log(
            `    [${statusIcon}] RUDE ${comp.rude.padEnd(17)} | ${comp.studentName.slice(0, 26).padEnd(26)} | SIE: ${comp.sieAverage.toString().padStart(4)} pts | SIGCE: ${comp.sigceAverage.toString().padStart(4)} pts | Discrepancias: ${comp.totalDiscrepancies}`
          );
        } catch (e: unknown) {
          console.warn(`    Error al consultar notas de ${st.rude}:`, e instanceof Error ? e.message : String(e));
        }
      }
    }

    console.log('\n[5/5] Generando reporte consolidado de auditoría...');

    const totalStudents = allStudentComparisons.length;
    const totalExactMatches = allStudentComparisons.filter((c) => c.overallMatch).length;
    const totalWithDiscrepancies = allStudentComparisons.filter((c) => c.totalDiscrepancies > 0).length;
    const matchPercentage = totalStudents > 0 ? Math.round((totalExactMatches / totalStudents) * 100) : 0;

    console.log('\n========================================================================');
    console.log('  RESUMEN DE AUDITORÍA: SIE VS SIGCE (GESTIÓN 2026)');
    console.log('========================================================================');
    console.log(`  • Total Estudiantes Auditados : ${totalStudents}`);
    console.log(`  • Coincidencias Exactas (100%): ${totalExactMatches} (${matchPercentage}%)`);
    console.log(`  • Estudiantes con Diferencias : ${totalWithDiscrepancies}`);
    console.log('========================================================================\n');

    // Guardar reporte en scratch/
    const scratchDir = path.resolve(__dirname, '../scratch');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = path.join(scratchDir, `auditoria_calificaciones_${timestamp}.json`);
    const mdPath = path.join(scratchDir, `auditoria_calificaciones_${timestamp}.md`);

    fs.writeFileSync(jsonPath, JSON.stringify(allStudentComparisons, null, 2), 'utf8');

    let mdContent = `# Reporte de Auditoría de Calificaciones: SIE vs SIGCE\n\n`;
    mdContent += `**Fecha**: ${new Date().toLocaleString()}\n`;
    mdContent += `**Total Alumnos Auditados**: ${totalStudents}\n`;
    mdContent += `**Coincidencias Exactas**: ${totalExactMatches} (${matchPercentage}%)\n`;
    mdContent += `**Con Discrepancias**: ${totalWithDiscrepancies}\n\n`;
    mdContent += `> [!NOTE]\n> Auditoría de solo lectura. Ningún registro ni calificación fue alterado en el SIE ni en SIGCE.\n\n`;

    mdContent += `## Detalle por Estudiante\n\n`;
    mdContent += `| RUDE | Estudiante | Curso | Promedio SIE | Promedio SIGCE | Discrepancias | Estado |\n`;
    mdContent += `|---|---|---|---|---|---|---|\n`;

    for (const c of allStudentComparisons) {
      let estado = 'COINCIDE';
      if (c.totalDiscrepancies > 0) estado = `DISCREPANCIA (${c.totalDiscrepancies})`;
      else if (c.sieAverage === 0 && c.sigceAverage > 0) estado = 'PENDIENTE_EN_SIE';
      else if (c.sieAverage > 0 && c.sigceAverage === 0) estado = 'SOLO_EN_SIE';
      else if (c.sieAverage === 0 && c.sigceAverage === 0) estado = 'SIN_CALIFICACIONES';

      mdContent += `| ${c.rude} | ${c.studentName} | ${c.courseName} | ${c.sieAverage} pts | ${c.sigceAverage} pts | ${c.totalDiscrepancies} | ${estado} |\n`;
    }

    const studentsWithDiscrepancies = allStudentComparisons.filter((c) => c.totalDiscrepancies > 0);
    if (studentsWithDiscrepancies.length > 0) {
      mdContent += `\n## Detalle de Discrepancias por Asignatura\n\n`;
      for (const st of studentsWithDiscrepancies) {
        mdContent += `### ${st.studentName} (RUDE: ${st.rude}) - ${st.courseName}\n\n`;
        mdContent += `| Asignatura (SIE) | Asignatura (SIGCE) | Nota SIE (1T) | Nota SIGCE (1T) | Diferencia | Estado |\n`;
        mdContent += `|---|---|---|---|---|---|\n`;
        for (const sub of st.comparisons.filter((item) => item.status === 'DISCREPANCIA')) {
          const diffStr = sub.diff !== undefined ? (sub.diff > 0 ? `+${sub.diff}` : `${sub.diff}`) : '—';
          mdContent += `| ${sub.sieSubject} | ${sub.sigceSubject || '—'} | ${sub.sieGrade1T ?? '—'} | ${sub.sigceGrade1T ?? '—'} | ${diffStr} | ⚠️ DISCREPANCIA |\n`;
        }
        mdContent += `\n`;
      }
    }

    fs.writeFileSync(mdPath, mdContent, 'utf8');
    console.log(`  -> Reporte JSON guardado en: ${jsonPath}`);
    console.log(`  -> Reporte Markdown guardado en: ${mdPath}`);

    return {
      totalStudents,
      totalExactMatches,
      totalWithDiscrepancies,
      matchPercentage,
      jsonPath,
      mdPath,
    };
  } finally {
    await browser.close();
    await prisma.$disconnect();
    console.log('\nNavegador cerrado de forma segura.');
  }
}

if (require.main === module) {
  const maxC = parseInt(process.argv[2] || '3', 10);
  runGradeComparison(maxC).catch(console.error);
}
