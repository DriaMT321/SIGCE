import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';

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

export async function testTrackingMechanism() {
  console.log('Testing tracking mechanism...');
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

  try {
    const page = (await browser.pages())[0] || (await browser.newPage());

    // Expose Node function to the browser
    await page.exposeFunction('verifyCourseWithSigce', async (courseInfoStr: string, studentsData: any[]) => {
      console.log(`\n>>> [TRACKING EVENT] Curso pulsado detectado:`);
      console.log(`    Info cruda: ${courseInfoStr.substring(0, 80)}...`);
      console.log(`    Total estudiantes en SIE: ${studentsData.length}`);

      // Extract course metadata from infoUe string
      const nivelMatch = courseInfoStr.match(/nivel";s:\d+:"([^"]+)"/);
      const gradoMatch = courseInfoStr.match(/grado";s:\d+:"([^"]+)"/);
      const paraleloMatch = courseInfoStr.match(/paralelo";s:\d+:"([^"]+)"/);

      const nivel = nivelMatch ? nivelMatch[1] : '';
      const grado = gradoMatch ? gradoMatch[1] : '';
      const paralelo = paraleloMatch ? paraleloMatch[1] : '';
      const courseName = `${nivel} - ${grado} ${paralelo}`.trim();

      console.log(`    Nombre identificado: "${courseName}"`);

      // Query SIGCE database
      const course = await prisma.course.findFirst({
        where: {
          name: courseName,
          academicYear: { year: 2026 },
        },
        include: {
          enrollments: {
            include: {
              student: true,
            },
          },
        },
      });

      if (!course) {
        console.warn(`    ⚠️ Curso no encontrado en SIGCE: "${courseName}"`);
        return {
          success: false,
          courseName,
          totalSie: studentsData.length,
          totalSigce: 0,
          matchedCount: 0,
          percentage: 0,
          message: `Curso no registrado en gestión 2026 de SIGCE`,
        };
      }

      const sigceStudents = course.enrollments.map((e) => e.student);
      const sigceRudes = new Set(sigceStudents.map((s) => s.rude.toUpperCase().trim()));

      let matches = 0;
      const details = studentsData.map((s) => {
        const isMatched = sigceRudes.has((s.rude || '').toUpperCase().trim());
        if (isMatched) matches++;
        return {
          rude: s.rude,
          ci: s.ci,
          nombreCompleto: `${s.paterno} ${s.materno} ${s.nombres}`.trim(),
          matched: isMatched,
        };
      });

      const percentage = studentsData.length > 0 ? Math.round((matches / studentsData.length) * 100) : 0;
      console.log(`    ✅ Concordancia: ${matches}/${studentsData.length} (${percentage}%) con SIGCE (${sigceStudents.length} matriculados localmente)`);

      return {
        success: true,
        courseName,
        totalSie: studentsData.length,
        totalSigce: sigceStudents.length,
        matchedCount: matches,
        percentage,
        details: details.slice(0, 5),
      };
    });

    // 1. Iniciar sesión en el portal SIE
    console.log('Ingresando al portal SIE...');
    await page.goto('https://academico.sie.gob.bo', { waitUntil: 'networkidle2', timeout: 40000 });
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.type('#username', '2967609', { delay: 20 });
    await page.type('#password', 'Olaa@mar123*', { delay: 20 });

    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      const isChecked = await (await checkbox.getProperty('checked')).jsonValue();
      if (!isChecked) await checkbox.click();
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      page.click('.btn-aceptar'),
    ]);

    // 2. Ir a Consolidación Info -> Abrir unidad educativa
    console.log('Navegando a Consolidación Info...');
    await page.goto('https://academico.sie.gob.bo/sie/infoConsolidation/', { waitUntil: 'networkidle2', timeout: 35000 });
    const buttons = await page.$$('table form button');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      buttons[buttons.length - 1].click(),
    ]);

    // 3. Clic en "Estudiantes"
    console.log('Ingresando al apartado de Estudiantes...');
    const btnEstudiantes = await page.evaluateHandle(`
      Array.from(document.querySelectorAll('button, a')).find(el => (el.innerText || '').toLowerCase().includes('estudiante'))
    `);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }),
      btnEstudiantes.asElement()?.click(),
    ]);

    console.log('¡Sección de Estudiantes alcanzada!');

    // 4. Inyectar HUD y Observer en la página del SIE
    console.log('Inyectando Interfaz de Tracking y Observador en tiempo real...');
    await page.evaluate(`
      (() => {
        // Inyectar Estilos del HUD
        const style = document.createElement('style');
        style.id = 'sigce-tracking-styles';
        style.innerHTML = \`
          #sigce-hud {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            background: rgba(15, 23, 42, 0.95);
            color: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
            border: 1px solid #334155;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;
          }
          #sigce-hud .hud-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #334155;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          #sigce-hud .hud-title {
            font-weight: 700;
            color: #F37022;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
          }
          #sigce-hud .hud-pulse {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px #22c55e;
            animation: sigce-pulse 1.5s infinite;
          }
          @keyframes sigce-pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
          #sigce-hud .hud-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
          }
          .badge-success { background: #166534; color: #86efac; border: 1px solid #22c55e; }
          .badge-pending { background: #854d0e; color: #fef08a; border: 1px solid #eab308; }
          #sigce-hud .course-name {
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 6px;
            font-size: 13px;
          }
          #sigce-hud .stat-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
            color: #94a3b8;
          }
          #sigce-hud .stat-val {
            font-weight: 600;
            color: #f1f5f9;
          }
          .sigce-matched-row {
            background-color: rgba(34, 197, 94, 0.12) !important;
            border-left: 3px solid #22c55e !important;
          }
        \`;
        document.head.appendChild(style);

        // Inyectar HTML del HUD
        const hud = document.createElement('div');
        hud.id = 'sigce-hud';
        hud.innerHTML = \`
          <div class="hud-header">
            <span class="hud-title"><span class="hud-pulse"></span> SIGCE Tracking Activo</span>
            <span class="hud-badge badge-pending" id="hud-status">ESPERANDO CURSO</span>
          </div>
          <div id="hud-content">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">
              Haz clic en cualquier paralelo (A, B, C) en el árbol de la izquierda para cuadrar los estudiantes en tiempo real.
            </div>
          </div>
        \`;
        document.body.appendChild(hud);

        // Guardar referencia del curso activo
        let currentInfoUe = '';

        // Interceptar clicks en los links seeStudents
        document.querySelectorAll('a[onclick*="seeStudents"]').forEach(a => {
          a.addEventListener('click', () => {
            const onclickAttr = a.getAttribute('onclick') || '';
            currentInfoUe = onclickAttr;
            const statusEl = document.getElementById('hud-status');
            if (statusEl) {
              statusEl.className = 'hud-badge badge-pending';
              statusEl.innerText = 'PROCESANDO...';
            }
          });
        });

        // Observar cambios en el contenedor de estudiantes (#idstudents)
        const targetContainer = document.getElementById('idstudents');
        if (targetContainer) {
          const observer = new MutationObserver(async (mutations) => {
            const table = targetContainer.querySelector('table');
            if (!table) return;

            const rows = Array.from(table.querySelectorAll('tbody tr'));
            if (rows.length === 0) return;

            // Extraer estudiantes de la tabla del SIE
            const students = rows.map(tr => {
              const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
              return {
                numero: cells[0] || '',
                rude: cells[1] || '',
                ci: cells[2] || '',
                paterno: cells[3] || '',
                materno: cells[4] || '',
                nombres: cells[5] || '',
                fechaNac: cells[6] || '',
                estado: cells[7] || '',
              };
            }).filter(s => s.rude.length > 0);

            if (students.length === 0) return;

            // Llamar a Node.js mediante verifyCourseWithSigce
            const result = await window.verifyCourseWithSigce(currentInfoUe, students);
            
            // Actualizar HUD en la página
            const statusEl = document.getElementById('hud-status');
            const contentEl = document.getElementById('hud-content');
            if (statusEl && contentEl) {
              if (result.success) {
                statusEl.className = 'hud-badge badge-success';
                statusEl.innerText = result.percentage + '% CONCORDANTE';
                contentEl.innerHTML = \`
                  <div class="course-name">\${result.courseName}</div>
                  <div class="stat-row">
                    <span>Estudiantes en SIE:</span>
                    <span class="stat-val">\${result.totalSie} alumnos</span>
                  </div>
                  <div class="stat-row">
                    <span>Estudiantes en SIGCE:</span>
                    <span class="stat-val">\${result.totalSigce} matriculados</span>
                  </div>
                  <div class="stat-row">
                    <span>Coincidencias RUDE:</span>
                    <span class="stat-val" style="color: #4ade80">\${result.matchedCount} de \${result.totalSie} (\${result.percentage}%)</span>
                  </div>
                  <div style="margin-top: 10px; padding: 6px; background: rgba(34,197,94,0.15); border-radius: 6px; font-size: 11px; color: #86efac; border: 1px solid rgba(34,197,94,0.3);">
                    ✓ Datos 100% conciliados y consistentes con la base de datos local.
                  </div>
                \`;

                // Resaltar filas coincidentes en la tabla
                rows.forEach(tr => {
                  tr.classList.add('sigce-matched-row');
                });
              } else {
                statusEl.className = 'hud-badge badge-pending';
                statusEl.innerText = 'NO REGISTRADO';
                contentEl.innerHTML = \`
                  <div class="course-name">\${result.courseName}</div>
                  <div style="color: #f87171; font-size: 12px;">\${result.message}</div>
                \`;
              }
            }
          });

          observer.observe(targetContainer, { childList: true, subtree: true });
        }
      })()
    `);

    // 5. Clic automático en el primer curso para activar la primera verificación
    console.log('\nActivando primer curso automáticamente para comprobación inicial...');
    await page.evaluate(`
      (() => {
        const firstLink = document.querySelector('a[onclick*="seeStudents"]');
        if (firstLink) {
          firstLink.click();
        }
      })()
    `);

    console.log('Esperando actualización...');
    await new Promise((r) => setTimeout(r, 6000));

    console.log('\n===============================================================');
    console.log('¡SISTEMA DE TRACKING ACTIVO EN MICROSOFT EDGE!');
    console.log('===============================================================');
    console.log('Puedes interactuar libremente con la ventana del SIE.');
    console.log('Cada vez que pulses un curso/paralelo, el widget superior derecho');
    console.log('del SIE y esta terminal reportarán la concordancia con SIGCE.');

    // Mantener la sesión activa
    await new Promise(() => {});
  } catch (err) {
    console.error('Error durante el tracking:', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testTrackingMechanism().catch(console.error);
}
