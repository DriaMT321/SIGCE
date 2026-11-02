import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import puppeteer from 'puppeteer';
import { urloficialsie } from '../../application/services/urlsieoficial';
import { crearproxyegresoviejecutacion } from './proxyegresoviejecutacion';
import type {
  estudianteexternaisie,
  navegadorauditoriacalificacionessie,
  resultadoextraccionsie,
} from '../../application/ports/ejecucionauditoriacalificacionsie.ports';
import { analizarmodalcalificacionessie } from './analizadormodalcalificacionessie';

@Injectable()
export class adaptadornavegadorpuppeteerauditoriasie implements navegadorauditoriacalificacionessie {
  async obtenercalificaciones(opciones: {
    url: string;
    usuario: string;
    contrasena: string;
    modovisual: boolean;
    maximocursos: number;
    filtrocurso: string;
  }): Promise<resultadoextraccionsie> {
    const origensie = urloficialsie(opciones.url);
    const proxyegreso = await crearproxyegresoviejecutacion(new URL(origensie).origin);
    let navegador: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
    const resultado: resultadoextraccionsie = {
      cursosauditados: 0,
      estudiantes: [],
      advertencias: [],
    };

    try {
      navegador = await puppeteer.launch({
        headless: !opciones.modovisual,
        executablePath: this.obtenerexecutableruta(),
        args: [
          '--window-size=960,1040',
          '--window-position=960,0',
          `--proxy-server=${proxyegreso.url}`,
          '--proxy-bypass-list=<-loopback>',
          '--disable-background-networking',
          '--disable-quic',
          '--dns-prefetch-disable',
          '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
        ],
      });
      const pagina = await navegador.newPage();
      await pagina.setViewport({ width: 1280, height: 900 });
      await pagina.goto(opciones.url, { waitUntil: 'networkidle2', timeout: 40000 });
      await pagina.waitForSelector('#username', { timeout: 15000 });
      await pagina.type('#username', opciones.usuario, { delay: 20 });
      await pagina.type('#password', opciones.contrasena, { delay: 20 });

      const casillaverificacion = await pagina.$('input[type="checkbox"]');
      if (casillaverificacion) {
        const estaMarcado = await (await casillaverificacion.getProperty('checked')).jsonValue();
        if (!estaMarcado) await casillaverificacion.click();
      }

      await Promise.all([
        pagina.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {}),
        pagina.click('.btn-aceptar'),
      ]);

      await pagina.goto(new URL('/sie/inbox/', opciones.url).toString(), {
        waitUntil: 'networkidle2',
        timeout: 35000,
      });
      await Promise.all([
        pagina.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {}),
        pagina.evaluate(() => {
          const boton = document.querySelector('#form_goplena') as HTMLElement | null;
          if (boton) boton.click();
          else {
            const formulario = document.querySelector(
              'form[action*="/sie/inbox/sie/open"]',
            ) as HTMLFormElement | null;
            formulario?.submit();
          }
        }),
      ]);
      await Promise.all([
        pagina.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {}),
        pagina.evaluate(() => {
          const formulario = document.querySelector(
            'form[action*="/sie/infoEstudiante/"]',
          ) as HTMLFormElement | null;
          if (formulario) formulario.submit();
          else {
            const boton = Array.from(document.querySelectorAll('button, a')).find((elemento) =>
              (elemento.textContent || '').toLowerCase().includes('estudiante'),
            ) as HTMLElement | undefined;
            boton?.click();
          }
        }),
      ]);

      const cursos = await pagina.evaluate(() => {
        const enlaces = Array.from(document.querySelectorAll('a[onclick*="seeStudents"]'));
        return enlaces
          .map((enlace) => {
            const atributo = enlace.getAttribute('onclick') || '';
            const coincidencia = atributo.match(/seeStudents\('(.*?)'\)/);
            const informacion = coincidencia?.[1] || '';
            const nivel = informacion.match(/nivel";s:\d+:"([^"]+)"/);
            const grado = informacion.match(/grado";s:\d+:"([^"]+)"/);
            const paralelo = informacion.match(/paralelo";s:\d+:"([^"]+)"/);
            const nombre = [nivel?.[1], grado?.[1], paralelo?.[1]].filter(Boolean).join(' - ');

            return {
              nombre: nombre || (enlace.textContent || '').trim().replace(/\s+/g, ' '),
              informacion,
            };
          })
          .filter((curso) => curso.informacion.length > 0);
      });
      const filtro = opciones.filtrocurso.toLowerCase();
      const cursosseleccionados = cursos
        .filter((curso) => !filtro || curso.nombre.toLowerCase().includes(filtro))
        .slice(0, opciones.maximocursos);
      resultado.cursosauditados = cursosseleccionados.length;

      for (const curso of cursosseleccionados) {
        await pagina.evaluate((informacion) => {
          const ventana = window as unknown as {
            seeStudents?: (argumento: unknown) => void;
          };
          ventana.seeStudents?.(informacion);
        }, curso.informacion);

        await pagina
          .waitForFunction(
            () => {
              const tabla = document.querySelector('#idstudents table');
              return Boolean(tabla?.querySelectorAll('tbody tr').length);
            },
            { timeout: 15000 },
          )
          .catch(() => {});

        const estudiantescurso = await pagina.evaluate(() => {
          const filas = Array.from(document.querySelectorAll('#idstudents table tbody tr'));
          return filas
            .map((fila) => {
              const celdas = Array.from(fila.querySelectorAll('td')).map((celda) =>
                celda.innerText.trim(),
              );
              const boton = fila.querySelector(
                '[onclick*="changeMatricula"], [onclick*="infoStudent"], [onclick*="infoUe"]',
              );
              const atributo = boton?.getAttribute('onclick') || '';
              const coincidencia = atributo.match(/'(a:3:[^']+)'\s*,\s*'({[^']+})'/);
              return {
                rude: celdas[1] || '',
                informacionue: coincidencia?.[1] || '',
                informacionestudiante: coincidencia?.[2] || '',
              };
            })
            .filter((estudiante) => estudiante.rude.length > 0);
        });

        for (const referencia of estudiantescurso) {
          if (!referencia.informacionue || !referencia.informacionestudiante) continue;

          try {
            const html = await pagina.evaluate(
              async (informacionue, informacionestudiante) => {
                const respuesta = await fetch('/sie/infoEstudiante/sie/estudiante_notas/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                  },
                  body: new URLSearchParams({
                    infoUe: informacionue,
                    infoStudent: informacionestudiante,
                  }).toString(),
                });
                if (!respuesta.ok) {
                  throw new Error(
                    `El portal SIE respondió ${respuesta.status} al consultar notas.`,
                  );
                }
                return respuesta.text();
              },
              referencia.informacionue,
              referencia.informacionestudiante,
            );
            const estudiante: estudianteexternaisie = analizarmodalcalificacionessie(html);
            if (!estudiante.rude) {
              estudiante.rude = referencia.rude;
            }
            resultado.estudiantes.push(estudiante);
          } catch (error) {
            resultado.advertencias.push({ rude: referencia.rude, error });
          }
        }
      }

      return resultado;
    } finally {
      await navegador?.close().catch(() => undefined);
      await proxyegreso.cerrar().catch(() => undefined);
    }
  }

  private obtenerexecutableruta(): string | undefined {
    const candidatos = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    return candidatos.find((candidato) => fs.existsSync(candidato));
  }
}
