import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import { parseStudentNotesModal, ScrapedStudentModal } from './parse-sie-modal';
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

export async function runSieTracking(customUser?: string, customPass?: string) {
  console.log('===============================================================');
  console.log('SISTEMA DE SINCRONIZACIÓN Y AUDITORÍA: SIE VS SIGCE (SOLO LECTURA)');
  console.log('===============================================================\n');

  const username = customUser || process.argv[2] || process.env.SIE_USERNAME || '2967609';
  const password = customPass || process.argv[3] || process.env.SIE_PASSWORD || 'Olaa@mar123*';
  const sieUrl = process.env.SIE_BASE_URL || 'https://academico.sie.gob.bo';

  console.log(`  -> Usuario SIE Director: ${username}`);
  console.log(`  -> Portal SIE: ${sieUrl}`);

  // 1. Cargar datos locales de SIGCE
  console.log('\n[1/4] Verificando cursos, estudiantes y notas en SIGCE (Gestión 2026)...');
  const academicYear = await prisma.academicYear.findUnique({ where: { year: 2026 } });
  if (!academicYear) throw new Error('No se encontró la Gestión Académica 2026 en SIGCE.');

  const totalStudents = await prisma.student.count();
  const totalGrades = await prisma.grade.count();

  console.log(`  -> Gestión Académica: ${academicYear.name} (2026)`);
  console.log(`  -> Estudiantes matriculados en SIGCE: ${totalStudents}`);
  console.log(`  -> Calificaciones registradas en 1er Trimestre: ${totalGrades}`);

  // 2. Iniciar navegador visible en la mitad derecha de la pantalla (Split Screen)
  console.log('\n[2/4] Abriendo ventana visible de Microsoft Edge para el portal SIE...');
  const executablePath = getExecutablePath();

  const browser = await puppeteer.launch({
    headless: false,
    executablePath,
    defaultViewport: null,
    args: [
      '--window-size=960,1040',
      '--window-position=960,0',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());

  try {
    // 3. Exponer función de auditoría y comparación Node.js <-> Navegador
    await page.exposeFunction('auditStudentNotesModal', async (modalHtml: string) => {
      try {
        const scraped: ScrapedStudentModal = parseStudentNotesModal(modalHtml);
        const comparison: StudentComparisonResult = await compareStudentGrades(prisma, scraped);

        console.log(`\n  [AUDITORÍA RUDE: ${comparison.rude}] ${comparison.studentName}`);
        console.log(`   Curso: ${comparison.courseName}`);
        console.log(`   Promedio SIE: ${comparison.sieAverage} pts | Promedio SIGCE: ${comparison.sigceAverage} pts`);
        console.log(`   Coincidencias: ${comparison.totalSubjectsMatched} | Discrepancias: ${comparison.totalDiscrepancies}`);

        if (comparison.totalDiscrepancies > 0) {
          comparison.comparisons
            .filter((c) => c.status === 'DISCREPANCIA')
            .forEach((c) => {
              console.log(
                `    ⚠️ ${c.sigceSubject || c.sieSubject}: SIE=${c.sieGrade1T ?? '—'} vs SIGCE=${c.sigceGrade1T ?? '—'} (Diferencia: ${c.diff ?? 'N/A'})`
              );
            });
        }

        return {
          success: true,
          comparison,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Error al procesar modal de notas:', message);
        return { success: false, error: message };
      }
    });

    // 4. Inicio de sesión en el portal SIE
    console.log(`\n[3/4] Iniciando sesión en el portal SIE con usuario "${username}"...`);
    await page.goto(sieUrl, { waitUntil: 'networkidle2', timeout: 40000 });

    await page.waitForSelector('#username', { timeout: 15000 });
    await page.type('#username', username, { delay: 25 });
    await page.type('#password', password, { delay: 25 });

    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      const isChecked = await (await checkbox.getProperty('checked')).jsonValue();
      if (!isChecked) await checkbox.click();
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.click('.btn-aceptar'),
    ]);

    console.log('  -> ¡Inicio de sesión exitoso! URL actual:', page.url());

    // 5. Navegar automáticamente: /acceso/principal/ -> /sie/inbox/ -> /sie/inbox/sie/open -> /sie/infoEstudiante/
    console.log('\n[4/4] Navegando automáticamente hacia el módulo de Estudiantes (Gestión 2026)...');

    // Paso 5.1: Ir a Bandeja (/sie/inbox/)
    console.log('  -> Accediendo a Bandeja (/sie/inbox/)...');
    await page.goto('https://academico.sie.gob.bo/sie/inbox/', { waitUntil: 'networkidle2', timeout: 35000 });

    // Paso 5.2: Enviar formulario "U.E. Regular" (#form_goplena)
    console.log('  -> Seleccionando U.E. Regular...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.evaluate(() => {
        const btn = document.querySelector('#form_goplena') as HTMLElement;
        if (btn) {
          btn.click();
          return;
        }
        const form = document.querySelector('form[action*="/sie/inbox/sie/open"]') as HTMLFormElement;
        if (form) form.submit();
      }),
    ]);

    // Paso 5.3: Enviar formulario "Estudiantes" (action="/sie/infoEstudiante/")
    console.log('  -> Abriendo el árbol de Estudiantes...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.evaluate(() => {
        const formEst = document.querySelector('form[action*="/sie/infoEstudiante/"]') as HTMLFormElement;
        if (formEst) {
          formEst.submit();
          return;
        }
        const btn = Array.from(document.querySelectorAll('button, a')).find((el) =>
          (el.textContent || '').toLowerCase().includes('estudiante')
        ) as HTMLElement;
        if (btn) btn.click();
      }),
    ]);

    console.log('  -> ¡Llegada confirmada a Estudiantes! URL:', page.url());

    // 6. Inyectar Interfaz Flotante (HUD) y Scraper de Comparación
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.id = 'sigce-audit-styles';
      style.innerHTML = `
        #sigce-hud {
          position: fixed; top: 15px; right: 15px; width: 420px; max-height: 90vh; overflow-y: auto;
          background: rgba(15, 23, 42, 0.96); color: #f8fafc;
          border-radius: 12px; padding: 16px;
          box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.7);
          border: 1px solid #334155; z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px; backdrop-filter: blur(8px);
        }
        #sigce-hud .hud-header {
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 10px;
        }
        #sigce-hud .hud-title { font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        #sigce-hud .hud-pulse { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #22c55e; }
        #sigce-hud .hud-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
        .badge-success { background: #166534; color: #86efac; border: 1px solid #22c55e; }
        .badge-warning { background: #854d0e; color: #fef08a; border: 1px solid #eab308; }
        .badge-pending { background: #1e293b; color: #94a3b8; border: 1px solid #475569; }
        #sigce-hud .stat-row { display: flex; justify-content: space-between; margin: 4px 0; color: #94a3b8; }
        #sigce-hud .stat-val { font-weight: 600; color: #f1f5f9; }
        .sigce-th { background: #0f172a !important; color: #38bdf8 !important; text-align: center !important; font-size: 11px !important; }
        .sigce-td-sie { text-align: center !important; font-weight: 600 !important; font-size: 12px !important; background: #f8fafc !important; }
        .sigce-td-sigce { text-align: center !important; font-weight: 600 !important; font-size: 12px !important; background: #f0fdf4 !important; }
        .sigce-td-status { text-align: center !important; font-size: 11px !important; font-weight: 700 !important; }
        .status-coincide { color: #16a34a !important; background: #dcfce7 !important; }
        .status-discrepancia { color: #dc2626 !important; background: #fee2e2 !important; }
        .status-solo-sie { color: #2563eb !important; background: #dbeafe !important; }
        .status-solo-sigce { color: #d97706 !important; background: #fef3c7 !important; }
      `;
      document.head.appendChild(style);

      const hud = document.createElement('div');
      hud.id = 'sigce-hud';
      hud.innerHTML = `
        <div class="hud-header">
          <span class="hud-title"><span class="hud-pulse"></span> Auditoría SIE vs SIGCE</span>
          <span class="hud-badge badge-success">SOLO LECTURA</span>
        </div>
        <div id="hud-content">
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">
            Pulsa cualquier curso en el árbol a la izquierda para comparar automáticamente las notas registradas en el SIE con las de SIGCE.
          </div>
          <div style="padding: 8px; background: rgba(56, 189, 248, 0.1); border-radius: 6px; font-size: 11px; color: #7dd3fc; border: 1px solid rgba(56, 189, 248, 0.2);">
            🔒 <b>Garantía de Seguridad:</b> Modo 100% de Solo Lectura. No se modificará ninguna nota en el SIE ni en SIGCE.
          </div>
        </div>
      `;
      document.body.appendChild(hud);

      // Función de extracción y comparación invocada cuando se carga el listado de alumnos
      const targetContainer = document.getElementById('idstudents');
      if (targetContainer) {
        let isProcessing = false;

        const observer = new MutationObserver(async () => {
          if (isProcessing) return;
          const table = targetContainer.querySelector('table');
          if (!table) return;

          const rows = Array.from(table.querySelectorAll('tbody tr'));
          if (rows.length === 0) return;

          isProcessing = true;

          const hudContent = document.getElementById('hud-content');
          if (hudContent) {
            hudContent.innerHTML = `
              <div style="font-weight: 700; color: #facc15; margin-bottom: 6px;">Escrapeando y comparando notas...</div>
              <div style="color: #94a3b8; font-size: 12px;">Consultando notas existentes de ${rows.length} estudiantes...</div>
            `;
          }

          // Insertar columnas en la cabecera
          const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
          if (headerRow && !headerRow.querySelector('.sigce-th')) {
            const th1 = document.createElement('th');
            th1.className = 'sigce-th';
            th1.innerText = 'PROM. SIE (1T)';
            const th2 = document.createElement('th');
            th2.className = 'sigce-th';
            th2.innerText = 'PROM. SIGCE (1T)';
            const th3 = document.createElement('th');
            th3.className = 'sigce-th';
            th3.innerText = 'ESTADO AUDITORÍA';
            headerRow.appendChild(th1);
            headerRow.appendChild(th2);
            headerRow.appendChild(th3);
          }

          let courseMatches = 0;
          let courseDiscrepancies = 0;
          let totalAudited = 0;

          for (const r of rows) {
            const cells = Array.from(r.querySelectorAll('td')).map((td) => td.innerText.trim());
            const rude = cells[1] || '';
            if (!rude) continue;

            // Extraer infoUe e infoStudent desde los botones con onclick
            const btnWithOnclick = r.querySelector('[onclick*="changeMatricula"], [onclick*="infoStudent"], [onclick*="infoUe"]');
            let infoUe = '';
            let infoStudent = '';

            if (btnWithOnclick) {
              const onclickStr = btnWithOnclick.getAttribute('onclick') || '';
              const match = onclickStr.match(/'(a:3:[^']+)'\s*,\s*'({[^']+})'/);
              if (match) {
                infoUe = match[1];
                infoStudent = match[2];
              }
            }

            if (!infoUe || !infoStudent) {
              // Intentar buscar en inputs ocultos si existieran
              const form = document.querySelector('form#formNotas') || document.querySelector('form');
              const ueInput = form ? (form.querySelector('input#infoUe') as HTMLInputElement) : null;
              if (ueInput) infoUe = ueInput.value;
            }

            if (infoUe && infoStudent) {
              try {
                // Petición PURE READ-ONLY para obtener el modal con las notas del estudiante
                const res = await fetch('/sie/infoEstudiante/sie/estudiante_notas/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                  },
                  body: new URLSearchParams({ infoUe, infoStudent }).toString(),
                });

                const modalHtml = await res.text();
                // Enviar modal a Node.js para parsear y comparar con prisma.grade
                const auditResult = await (window as any).auditStudentNotesModal(modalHtml);

                if (auditResult && auditResult.success && auditResult.comparison) {
                  const comp = auditResult.comparison;
                  totalAudited++;
                  if (comp.overallMatch) courseMatches++;
                  else courseDiscrepancies++;

                  // Renderizar celdas en la fila
                  if (!r.querySelector('.sigce-td-sie')) {
                    const tdSie = document.createElement('td');
                    tdSie.className = 'sigce-td-sie';
                    tdSie.innerText = comp.sieAverage > 0 ? `${comp.sieAverage} pts` : 'Sin notas';

                    const tdSigce = document.createElement('td');
                    tdSigce.className = 'sigce-td-sigce';
                    tdSigce.innerText = comp.sigceAverage > 0 ? `${comp.sigceAverage} pts` : '—';

                    const tdStatus = document.createElement('td');
                    tdStatus.className = 'sigce-td-status';
                    if (comp.overallMatch) {
                      tdStatus.className += ' status-coincide';
                      tdStatus.innerText = '✓ COINCIDE';
                    } else if (comp.totalDiscrepancies > 0) {
                      tdStatus.className += ' status-discrepancia';
                      tdStatus.innerText = `⚠️ ${comp.totalDiscrepancies} DISCREPANCIAS`;
                    } else {
                      tdStatus.className += ' status-solo-sie';
                      tdStatus.innerText = 'REGISTRADO EN SIE';
                    }

                    r.appendChild(tdSie);
                    r.appendChild(tdSigce);
                    r.appendChild(tdStatus);
                  }
                }
              } catch (fetchErr) {
                console.warn(`Error al consultar notas para RUDE ${rude}:`, fetchErr);
              }
            }
          }

          // Actualizar resumen en el HUD
          if (hudContent) {
            const pct = totalAudited > 0 ? Math.round((courseMatches / totalAudited) * 100) : 0;
            hudContent.innerHTML = `
              <div style="font-weight: 700; color: #ffffff; font-size: 14px; margin-bottom: 8px;">Auditoría de Calificaciones</div>
              <div class="stat-row"><span>Alumnos Evaluados:</span><span class="stat-val">${totalAudited}</span></div>
              <div class="stat-row"><span>Coincidencias Exactas:</span><span class="stat-val" style="color: #4ade80;">${courseMatches} (${pct}%)</span></div>
              <div class="stat-row"><span>Con Discrepancias:</span><span class="stat-val" style="color: ${courseDiscrepancies > 0 ? '#f87171' : '#94a3b8'};">${courseDiscrepancies}</span></div>
              <div style="margin-top: 10px; padding: 6px; background: rgba(34, 197, 94, 0.15); border-radius: 6px; font-size: 11px; color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3);">
                ✓ Datos escrapeados y contrastados con éxito. Cero notas modificadas.
              </div>
            `;
          }

          isProcessing = false;
        });

        observer.observe(targetContainer, { childList: true, subtree: true });
      }
    });

    // 7. Click inicial automático en el primer curso para iniciar la comparación
    console.log('  -> Activando comprobación inicial en el primer curso del árbol...');
    await page.evaluate(() => {
      const first = document.querySelector('a[onclick*="seeStudents"]') as HTMLElement;
      if (first) first.click();
    });

    console.log('\n===============================================================');
    console.log('¡SISTEMA DE AUDITORÍA Y COMPARACIÓN EN VIVO ACTIVO!');
    console.log('===============================================================');
    console.log('  • La ventana de Edge permanece visible en la mitad derecha.');
    console.log('  • Conforme navegues por cualquier curso en el SIE,');
    console.log('    el sistema escrapeará automáticamente las notas registradas');
    console.log('    y las contrastará con la base de datos de SIGCE.');
    console.log('  • Garantía estricta: No se modificará ninguna nota.');
    console.log('  • Presiona Ctrl+C en esta terminal cuando desees finalizar.');
    console.log('===============================================================\n');

    await new Promise(() => {});
  } catch (error) {
    console.error('Error durante la ejecución del tracking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runSieTracking().catch(console.error);
}
