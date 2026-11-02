import { Injectable } from '@nestjs/common';
import { AlertSeverity, AlertStatus } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  publicadoranuncio,
  entradapublicaranuncio,
} from '../../application/ports/anunciopublicacion.port';
import { registroanuncio } from '../../application/ports/repositorioanuncios.port';

const constantetamanolotenotificaciones = 100;

@Injectable()
export class publicadoranuncioprisma implements publicadoranuncio {
  constructor(private readonly prisma: servicioprisma) {}

  async publicar(entrada: entradapublicaranuncio): Promise<registroanuncio> {
    return this.prisma.$transaction(async (transaccion) => {
      const anuncio = await transaccion.announcement.create({
        data: {
          title: entrada.datos.title,
          content: entrada.datos.content,
          urgency: entrada.datos.urgency,
          scope: entrada.datos.scope,
          targetCourseId: entrada.datos.targetCourseId || null,
          targetParentId: entrada.datos.targetParentId || null,
          targetTeacherId: entrada.datos.targetTeacherId || null,
          targetUserIds: entrada.datos.targetUserIds ?? [],
          createdById: entrada.creadorId,
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, role: true },
          },
          targetCourse: { select: { id: true, name: true } },
          targetParent: { select: { id: true, firstName: true, lastName: true } },
          targetTeacher: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      for (
        let inicio = 0;
        inicio < entrada.notificaciones.length;
        inicio += constantetamanolotenotificaciones
      ) {
        const lote = entrada.notificaciones.slice(
          inicio,
          inicio + constantetamanolotenotificaciones,
        );
        await transaccion.alert.createMany({
          data: lote.map((notificacion) => ({
            userId: notificacion.userId,
            title: notificacion.title,
            message: notificacion.message,
            severity: notificacion.severity as AlertSeverity,
            status: AlertStatus.OPEN,
            link: '/dashboard/announcements',
            metadata: {
              announcementId: anuncio.id,
              urgency: notificacion.urgency,
              scope: notificacion.scope,
            },
          })),
          skipDuplicates: true,
        });
      }

      return anuncio;
    });
  }
}
