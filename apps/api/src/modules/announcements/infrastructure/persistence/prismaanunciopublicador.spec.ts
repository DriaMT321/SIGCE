import { severidadalerta, alcanceanuncio, urgenciaanuncio } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { publicadoranuncioprisma } from './prismaanunciopublicador';

describe('PublicadorAnuncioPrisma', () => {
  it('persiste el comunicado y sus alertas dentro de una transacción', async () => {
    const anuncio = {
      id: 'anuncio-1',
      title: 'Aviso',
      content: 'Aviso académico',
      urgency: urgenciaanuncio.ALTA,
      scope: alcanceanuncio.ALL_COURSES,
      createdAt: new Date('2026-10-23T00:00:00.000Z'),
    };
    const crearanuncio = jest.fn().mockResolvedValue(anuncio);
    const crearalertas = jest.fn().mockResolvedValue({ count: 1 });
    const transaccion = jest.fn(async (operacion: (cliente: unknown) => unknown) =>
      operacion({ announcement: { create: crearanuncio }, alert: { createMany: crearalertas } }),
    );
    const prisma = { $transaction: transaccion } as unknown as servicioprisma;
    const publicador = new publicadoranuncioprisma(prisma);

    await expect(
      publicador.publicar({
        creadorId: 'administrador-1',
        datos: {
          title: 'Aviso',
          content: 'Aviso académico',
          urgency: urgenciaanuncio.ALTA,
          scope: alcanceanuncio.ALL_COURSES,
        },
        notificaciones: [
          {
            userId: 'estudiante-1',
            title: '[Comunicado ALTA] Aviso',
            message: 'Aviso académico',
            severity: severidadalerta.WARNING,
            urgency: urgenciaanuncio.ALTA,
            scope: alcanceanuncio.ALL_COURSES,
          },
        ],
      }),
    ).resolves.toBe(anuncio);

    expect(transaccion).toHaveBeenCalledTimes(1);
    expect(crearanuncio).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ createdById: 'administrador-1' }),
      }),
    );
    expect(crearalertas).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: 'estudiante-1',
          severity: 'WARNING',
          status: 'OPEN',
          metadata: {
            announcementId: 'anuncio-1',
            urgency: urgenciaanuncio.ALTA,
            scope: alcanceanuncio.ALL_COURSES,
          },
        }),
      ],
      skipDuplicates: true,
    });
  });
});
