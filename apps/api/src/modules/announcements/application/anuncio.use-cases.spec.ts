import {
  severidadalerta,
  alcanceanuncio,
  urgenciaanuncio,
  rolusuario,
} from '@academic/domain-kernel';
import { actorusuario } from '../../../core/application/actorusuario';
import { casousocrearanuncio } from './anuncio.use-cases';
import { resolvedordestinatariosanuncio } from './ports/anunciodestinatarioresolvedor.port';
import { publicadoranuncio } from './ports/anunciopublicacion.port';

describe('CasoUsoCrearAnuncio', () => {
  it('orquesta destinatarios y publica anuncio con notificaciones en severidad correspondiente', async () => {
    const resolvedor: jest.Mocked<resolvedordestinatariosanuncio> = {
      resolverdestinatarios: jest.fn().mockResolvedValue(['estudiante-1', 'familiar-1']),
    };
    const publicador: jest.Mocked<publicadoranuncio> = {
      publicar: jest.fn().mockResolvedValue({
        id: 'anuncio-1',
        title: 'Evaluación',
        content: 'x'.repeat(181),
        urgency: urgenciaanuncio.CRITICA,
        scope: alcanceanuncio.COURSE,
        createdAt: new Date('2026-10-23T00:00:00.000Z'),
      }),
    };
    const casouso = new casousocrearanuncio(resolvedor, publicador);
    const usuario: actorusuario = {
      id: 'administrador-1',
      role: rolusuario.ADMINISTRATIVE,
    };
    const datos = {
      title: 'Evaluación',
      content: 'x'.repeat(181),
      urgency: urgenciaanuncio.CRITICA,
      scope: alcanceanuncio.COURSE,
      targetCourseId: 'curso-1',
    };

    await casouso.ejecutar(usuario, datos);

    expect(resolvedor.resolverdestinatarios).toHaveBeenCalledWith(datos);
    expect(publicador.publicar).toHaveBeenCalledWith({
      creadorId: 'administrador-1',
      datos,
      notificaciones: ['estudiante-1', 'familiar-1'].map((idusuario) => ({
        userId: idusuario,
        title: '[Comunicado CRITICA] Evaluación',
        message: `${'x'.repeat(180)}...`,
        severity: severidadalerta.DANGER,
        urgency: urgenciaanuncio.CRITICA,
        scope: alcanceanuncio.COURSE,
      })),
    });
  });
});
