import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';
import {
  type verificadorreplicalocalsie,
  type resultadoverificacionreplicalocalsie,
} from '../../application/ports/verificadorreplicalocalsie.port';

@Injectable()
export class adaptadornavegadorreplicalocalsie implements verificadorreplicalocalsie {
  async verificar(htmlsubido?: string): Promise<resultadoverificacionreplicalocalsie> {
    if (process.env.NODE_ENV === 'production' && process.env.SIE_ALLOW_REPLICA_IN_PROD !== 'true') {
      throw new ForbiddenException(
        'La verificación de la réplica local está disponible solo en desarrollo.',
      );
    }

    let html = htmlsubido?.trim();
    if (!html) {
      const posiblesRutas = [
        process.env.SIE_LOCAL_REPLICA_PATH?.trim(),
        resolve(process.cwd(), 'fixtures/sie-replica/replica-calificaciones.html'),
        resolve(process.cwd(), '../../fixtures/sie-replica/replica-calificaciones.html'),
        resolve(__dirname, '../../../../../../../fixtures/sie-replica/replica-calificaciones.html'),
        '/home/ubuntu/sigce/fixtures/sie-replica/replica-calificaciones.html',
      ].filter((r): r is string => Boolean(r));

      let rutaresuelta: string | undefined;
      for (const r of posiblesRutas) {
        const absoluta = resolve(r);
        if (existsSync(absoluta)) {
          rutaresuelta = absoluta;
          break;
        }
      }

      if (!rutaresuelta) {
        throw new BadRequestException('No se encontró el archivo HTML de la réplica local.');
      }
      const informacion = await stat(rutaresuelta);
      if (!informacion.isFile() || informacion.size > 500_000) {
        throw new BadRequestException(
          'El archivo local no es válido o supera el tamaño permitido.',
        );
      }
      html = await readFile(rutaresuelta, 'utf8');
    }
    if (Buffer.byteLength(html, 'utf8') > 500_000) {
      throw new BadRequestException('El archivo local supera el tamaño permitido.');
    }

    const fecha = new Date().toISOString();
    const navegador = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
      const pagina = await navegador.newPage();
      await pagina.setJavaScriptEnabled(false);
      await pagina.setRequestInterception(true);
      pagina.on('request', (solicitud) => {
        if (solicitud.url() === 'about:blank') {
          void solicitud.continue();
        } else {
          void solicitud.abort('blockedbyclient');
        }
      });
      await pagina.setContent(html, { waitUntil: 'domcontentloaded', timeout: 5000 });
      const resultado = await pagina.evaluate(() => ({
        titulo: document.title || 'Réplica local',
        tieneFormulario: Boolean(
          document.querySelector('#login-form') &&
            document.querySelector('#username') &&
            document.querySelector('#password'),
        ),
        tieneTabla: Boolean(
          document.querySelector('#student-rows') || document.querySelector('#sie-grades'),
        ),
      }));
      const lista = resultado.tieneFormulario && resultado.tieneTabla;

      return {
        active: true,
        loginSuccess: false,
        localReplica: true,
        structureRecognized: lista,
        portalTitle: resultado.titulo,
        checkedAt: fecha,
        message: lista
          ? 'La réplica local abrió y contiene el formulario y la tabla esperados. No se contactó el portal oficial.'
          : 'El archivo abrió, pero no contiene la estructura que usa la prueba local del trabajador.',
      };
    } finally {
      await navegador.close();
    }
  }
}

