import { Injectable } from '@nestjs/common';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  estudianteauditoriasie,
  materiaauditoriasie,
  repositorioauditoriacalificacionessie,
} from '../../application/ports/repositorioauditoriacalificacionsie';

@Injectable()
export class repositorioauditoriacalificacionessieprisma implements repositorioauditoriacalificacionessie {
  constructor(private readonly prisma: servicioprisma) {}

  async obtenerdatosreferenciaauditoria(): Promise<{
    academicYearId: string | null;
    subjects: materiaauditoriasie[];
  }> {
    const [academicogestion, materias] = await Promise.all([
      this.prisma.academicYear.findFirst({
        where: { isActive: true },
        orderBy: { year: 'desc' },
        select: { id: true },
      }),
      this.prisma.subject.findMany({ select: { id: true, name: true } }),
    ]);
    return { academicYearId: academicogestion?.id ?? null, subjects: materias };
  }

  buscarcalificacionesestudiantes(
    rudes: string[],
    idgestionacademica: string,
    numeroperiodo: number,
  ): Promise<estudianteauditoriasie[]> {
    if (rudes.length === 0) return Promise.resolve([]);
    return this.prisma.student.findMany({
      where: { rude: { in: [...new Set(rudes)] }, deletedAt: null },
      select: {
        id: true,
        rude: true,
        firstName: true,
        lastName: true,
        grades: {
          where: {
            period: { academicYearId: idgestionacademica, number: numeroperiodo },
            enrollment: { academicYearId: idgestionacademica },
          },
          select: { subjectId: true, value: true, subject: { select: { name: true } } },
        },
      },
    });
  }
}
